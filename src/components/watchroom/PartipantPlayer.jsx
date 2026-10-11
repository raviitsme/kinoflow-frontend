import React, { useEffect, useRef, useState } from 'react';
import socketService from '../../services/socketService';

// A seek/play/pause we trigger ourselves produces state events for a while.
// Ignore those events during this window so we never react to our own actions.
const LOCK_MS = 2000;
const DRIFT_THRESHOLD = 1.5;

export default function ParticipantPlayer({ roomId, currentVideoId }) {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const playerWrapperRef = useRef(null);

  const lastProgrammaticTime = useRef(0);
  const desiredState = useRef('paused');
  const roomIdRef = useRef(roomId);
  const initialVideoIdRef = useRef(currentVideoId);

  const [playerReady, setPlayerReady] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Personal preferences
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [ccActive, setCcActive] = useState(false);
  const [quality, setQuality] = useState('default');
  const [availableQualities, setAvailableQualities] = useState([]);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  const lock = () => {
    lastProgrammaticTime.current = Date.now();
  };

  const requestSync = () => {
    socketService.socket?.emit('request_sync', { roomId: roomIdRef.current });
  };

  useEffect(() => {
    let cancelled = false;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    const handleStateChange = (event) => {
      if (Date.now() - lastProgrammaticTime.current < LOCK_MS) return;

      const S = window.YT.PlayerState;
      if (event.data === S.BUFFERING || event.data === S.CUED || event.data === S.UNSTARTED) {
        return;
      }

      if (event.data === S.PLAYING && desiredState.current === 'paused') {
        lock();
        event.target.pauseVideo();
      } else if (event.data === S.PAUSED && desiredState.current === 'playing') {
        lock();
        event.target.playVideo();
      }
    };

    const initPlayer = () => {
      if (cancelled || playerRef.current || !containerRef.current) return;

      const mount = document.createElement('div');
      mount.style.width = '100%';
      mount.style.height = '100%';
      containerRef.current.appendChild(mount);

      playerRef.current = new window.YT.Player(mount, {
        width: '100%',
        height: '100%',
        videoId: initialVideoIdRef.current || 'LXb3EKWsInQ',
        playerVars: {
          autoplay: 0,
          controls: 1, 
          disablekb: 1, 
          fs: 1,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3, // hide annotations
          cc_load_policy: 0,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (cancelled) return;
            setPlayerReady(true);
            event.target.setVolume(50);
            requestSync();
            if (typeof event.target.getAvailableQualityLevels === 'function') {
              setAvailableQualities(event.target.getAvailableQualityLevels());
            }
          },
          onStateChange: handleStateChange,
        },
      });
    };

    const prevReadyCallback = window.onYouTubeIframeAPIReady;
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevReadyCallback === 'function') prevReadyCallback();
        initPlayer();
      };
    }

    return () => {
      cancelled = true;
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
      playerRef.current = null;
      setPlayerReady(false);
    };
  }, []); 

  useEffect(() => {
    const player = playerRef.current;
    if (!playerReady || !player || !currentVideoId) return;

    const currentId = player.getVideoData?.().video_id;
    if (currentId !== currentVideoId) {
      lock();
      player.loadVideoById(currentVideoId, 0);
      desiredState.current = 'paused';
      player.pauseVideo?.();
      setTimeout(() => {
        const p = playerRef.current;
        if (p && typeof p.getAvailableQualityLevels === 'function') {
          setAvailableQualities(p.getAvailableQualityLevels());
        }
      }, 1500);
    }
  }, [currentVideoId, playerReady]);

  useEffect(() => {
    if (!playerReady) return;

    const applyDesired = (player) => {
      if (desiredState.current === 'playing') player.playVideo();
      else player.pauseVideo();
    };

      const handlePlaybackBroadcast = ({ action, time }) => {
      const player = playerRef.current;
      if (!player || typeof player.getCurrentTime !== 'function') return;

      lock();
      
      // FIX: Add a small buffer to the target time when playing to account for network/startup lag
      const latencyCompensation = action === 'play' ? 0.3 : 0;
      const target = Number(time) + latencyCompensation;

      if (action === 'play') desiredState.current = 'playing';
      if (action === 'pause') desiredState.current = 'paused';

      const drift = Math.abs(player.getCurrentTime() - target);
      
      // FIX: Differentiate between a manual 'seek' and a background 'sync'
      if (action === 'seek') {
        player.seekTo(target, true);
      } else if (drift > 0.5) { 
        // Only seek if the drift is noticeably large (> 0.5s)
        player.seekTo(target, true);
      }

      if (action === 'play' || action === 'pause') {
        const state = player.getPlayerState();
        const S = window.YT.PlayerState;
        if (action === 'play' && state !== S.PLAYING && state !== S.BUFFERING) {
          player.playVideo();
        } else if (action === 'pause' && state !== S.PAUSED) {
          player.pauseVideo();
        }
      }
    };


    const handleVideoChanged = ({ videoId }) => {
      const player = playerRef.current;
      if (!player || typeof player.loadVideoById !== 'function' || !videoId) return;

      lock();
      desiredState.current = 'paused';
      player.loadVideoById(videoId, 0);
      player.pauseVideo();
      setTimeout(() => {
        const p = playerRef.current;
        if (p && typeof p.getAvailableQualityLevels === 'function') {
          setAvailableQualities(p.getAvailableQualityLevels());
        }
      }, 1500);
    };

    const handleSyncState = ({ videoId, playState, currentTime }) => {
      const player = playerRef.current;
      if (!player) return;

      lock();
      const target = Number(currentTime) || 0;
      desiredState.current = playState === 'playing' ? 'playing' : 'paused';

      const currentId = player.getVideoData?.().video_id;
      if (videoId && currentId !== videoId) {
        player.loadVideoById(videoId, target);
      } else if (Math.abs(player.getCurrentTime() - target) > DRIFT_THRESHOLD) {
        player.seekTo(target, true);
      }

      applyDesired(player);
    };

    socketService.on('playback_broadcast', handlePlaybackBroadcast);
    socketService.on('video_changed', handleVideoChanged);
    socketService.on('sync_state', handleSyncState);

    return () => {
      socketService.off('playback_broadcast', handlePlaybackBroadcast);
      socketService.off('video_changed', handleVideoChanged);
      socketService.off('sync_state', handleSyncState);
    };
  }, [playerReady]);

  const handleJoin = () => {
    const player = playerRef.current;
    if (!player || !playerReady) return;
    setHasJoined(true);
    lock();
    player.playVideo();
    requestSync();
  };

  const handleToggleMute = () => {
    const player = playerRef.current;
    if (!player) return;
    if (isMuted) {
      player.unMute();
      player.setVolume(volume);
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const player = playerRef.current;
    if (!player) return;
    const v = parseInt(e.target.value, 10);
    setVolume(v);
    player.setVolume(v);
    if (v > 0 && isMuted) {
      player.unMute();
      setIsMuted(false);
    }
  };

  const handleToggleCC = () => {
    const player = playerRef.current;
    if (!player) return;
    if (ccActive) {
      player.unloadModule('captions');
      setCcActive(false);
    } else {
      player.loadModule('captions');
      player.setOption('captions', 'track', { languageCode: 'en' });
      setCcActive(true);
    }
  };

  const handleQualityChange = (e) => {
    const player = playerRef.current;
    if (!player) return;
    setQuality(e.target.value);
    player.setPlaybackQuality(e.target.value);
  };

  const handleSpeedChange = (e) => {
    const player = playerRef.current;
    if (!player) return;
    const rate = parseFloat(e.target.value);
    setSpeed(rate);
    player.setPlaybackRate(rate);
  };

  const toggleFullscreen = () => {
    const wrapper = playerWrapperRef.current;
    if (!wrapper) return;
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Video viewport */}
      <div
        ref={playerWrapperRef}
        className="relative aspect-video w-full bg-brand-black rounded-2xl overflow-hidden border border-brand-border/80 shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
      >
        {/* Video at its original size: title and native controls are fully visible */}
        <div className="absolute inset-0 pointer-events-none">
          <div ref={containerRef} className="w-full h-full" />
        </div>

        {/* Transparent blocker: participants can see the player but cannot touch it */}
        <div
          className="absolute inset-0 z-20 bg-transparent cursor-default"
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Tap-to-join overlay (satisfies the browser autoplay policy) */}
        {!hasJoined && (
          <button
            onClick={handleJoin}
            disabled={!playerReady}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-brand-black/85 backdrop-blur-sm text-brand-white cursor-pointer disabled:cursor-wait"
          >
            <span className="text-4xl">{playerReady ? '▶' : '⏳'}</span>
            <span className="text-sm font-semibold tracking-wide uppercase">
              {playerReady ? 'Tap to join the watch party' : 'Loading player...'}
            </span>
          </button>
        )}

        {/* Live status badge */}
        <div className="absolute top-3 left-3 z-30 pointer-events-none flex items-center gap-2 bg-brand-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-brand-border/60 text-xs text-brand-white">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
          </span>
          <span className="font-semibold text-[11px] tracking-wide uppercase">
            Synced With Host
          </span>
        </div>

        {/* Fullscreen button (top-right so it doesn't cover YouTube's own control bar) */}
        <div className="absolute top-3 right-3 z-30">
          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-black/80 backdrop-blur-md border border-brand-border/80 text-brand-white hover:border-brand-red/50 hover:text-brand-red transition-all active:scale-95 cursor-pointer shadow-md"
            title="Toggle Cinema Fullscreen"
          >
            {isFullscreen ? '⏹' : '📺'}
          </button>
        </div>
      </div>

      {/* Spectator options panel */}
      <div className="bg-brand-charcoal/40 border border-brand-border/60 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Mute and volume */}
          <div className="flex items-center gap-3 bg-brand-black/40 border border-brand-border/40 px-3.5 py-2 rounded-xl flex-1 min-w-50">
            <button
              onClick={handleToggleMute}
              className="text-brand-muted hover:text-brand-white text-xs transition-colors cursor-pointer"
            >
              {isMuted || volume === 0 ? '🔇' : '🔊'}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 accent-brand-red h-1 rounded-full cursor-pointer bg-brand-border"
            />
            <span className="text-[10px] font-mono text-brand-muted w-8 text-right">
              {isMuted ? 0 : volume}%
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* CC */}
            <button
              onClick={handleToggleCC}
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer border ${
                ccActive
                  ? 'bg-brand-red/20 border-brand-red/40 text-brand-red'
                  : 'bg-brand-black/40 border-brand-border/60 text-brand-muted hover:text-brand-white'
              }`}
            >
              CC Subtitles
            </button>

            {/* Quality */}
            <div className="flex items-center gap-1.5 bg-brand-black/40 border border-brand-border/60 px-2.5 py-1.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-brand-muted">HD</span>
              <select
                value={quality}
                onChange={handleQualityChange}
                className="bg-transparent text-brand-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option className="bg-brand-charcoal text-brand-white" value="default">Auto</option>
                {availableQualities.map((q) => (
                  <option key={q} className="bg-brand-charcoal text-brand-white" value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>

            {/* Speed */}
            <div className="flex items-center gap-1.5 bg-brand-black/40 border border-brand-border/60 px-2.5 py-1.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-brand-muted">Speed</span>
              <select
                value={speed}
                onChange={handleSpeedChange}
                className="bg-transparent text-brand-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option className="bg-brand-charcoal text-brand-white" value="0.5">0.5x</option>
                <option className="bg-brand-charcoal text-brand-white" value="1">1.0x (Normal)</option>
                <option className="bg-brand-charcoal text-brand-white" value="1.5">1.5x</option>
                <option className="bg-brand-charcoal text-brand-white" value="2">2.0x</option>
              </select>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-brand-muted/70 flex items-center gap-1.5">
          Sync mode active. Personal settings configured locally. Playback managed by the Host.
        </p>
      </div>
    </div>
  );
}