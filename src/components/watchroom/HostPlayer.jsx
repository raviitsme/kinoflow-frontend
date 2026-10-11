import React, { useEffect, useRef, useState } from 'react';
import socketService from '../../services/socketService';
import extractYoutubeId from '../../utils/youtube';

export default function HostPlayer({ roomId, isHost, currentVideoId }) {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const isIncomingSync = useRef(false);
  const lastProgrammaticTime = useRef(Date.now());
  const initialSyncDone = useRef(false);
  // Capture the video ID at mount time only. Keeping this in a ref (not reading
  // the prop inside the effect) lets us remove currentVideoId from the useEffect
  // dependency array, so the player is never destroyed/recreated on video changes.
  const initialVideoIdRef = useRef(currentVideoId);

  const [inputUrl, setInputUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [playerReady, setPlayerReady] = useState(false);

  // 1. Initialize Native YouTube Player
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: initialVideoIdRef.current || 'LXb3EKWsInQ',
        playerVars: {
          autoplay: 0,
          controls: 1,           // Full native YouTube controls
          disablekb: 0,          // Keyboard shortcuts enabled
          modestbranding: 1,
          rel: 0,
          fs: 1,                 // Native fullscreen expand enabled
          enablejsapi: 1,
          origin: window.location.origin,
          widget_referrer: window.location.origin,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            setPlayerReady(true);
            isIncomingSync.current = true;
            lastProgrammaticTime.current = Date.now();

            // Request active playback state to align before enabling broadcast
            if (socketService.socket) {
              socketService.socket.emit('request_sync', { roomId });
            }

            // Fallback: unlock controller if sync response takes over 2.5s
            setTimeout(() => {
              initialSyncDone.current = true;
            }, 2500);
          },
          onStateChange: handleControllerStateChange,
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
    // Only roomId is a dep — currentVideoId is intentionally excluded.
    // The player is created once; all subsequent video changes go through
    // handleVideoChanged (triggered by the server's video_changed broadcast).
  }, [roomId]);

  // 2. Broadcast Local Actions (When this Host/Moderator clicks play, pause, or scrubs)
  const handleControllerStateChange = (event) => {
    const player = playerRef.current;
    if (!player || typeof player.getCurrentTime !== 'function') return;

    // Prevent newly promoted moderators from broadcasting initial mount events
    if (!initialSyncDone.current) return;

    // Ignore transitions within 1.5s of an incoming programmatic update
    if (Date.now() - lastProgrammaticTime.current < 1500) {
      return;
    }

    // Ignore changes triggered by incoming socket events from other controllers
    if (isIncomingSync.current) {
      isIncomingSync.current = false;
      return;
    }

    const time = player.getCurrentTime();

    if (event.data === window.YT.PlayerState.PLAYING) {
      socketService.emitAction(roomId, 'play', time);
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      socketService.emitAction(roomId, 'pause', time);
    }
  };

  // 3. Listen for Incoming Actions (When the other controller plays/pauses/seeks/switches video)
  useEffect(() => {
    const handlePlaybackBroadcast = ({ action, time }) => {
      const player = playerRef.current;
      if (!player || !playerReady) return;

      isIncomingSync.current = true;
      lastProgrammaticTime.current = Date.now();

      // Compensate for average network transit latency (200ms) without relying on desynced system clocks
      const transitLatency = 0.2;
      const targetTime = action === 'play' ? time + transitLatency : time;

      const localTime = player.getCurrentTime();
      const drift = Math.abs(localTime - targetTime);

      if (drift > 0.4) {
        player.seekTo(targetTime, true);
      }

      if (action === 'play') {
        player.playVideo();
      } else if (action === 'pause') {
        player.pauseVideo();
        if (drift > 0.2) player.seekTo(time, true);
      } else if (action === 'seek' || action === 'sync') {
        // Correct drift if out of sync by more than 400ms
        if (drift > 0.4) player.seekTo(targetTime, true);
      }
    };


    const handleVideoChanged = ({ videoId }) => {
      const player = playerRef.current;
      if (player && typeof player.loadVideoById === 'function') {
        isIncomingSync.current = true;
        lastProgrammaticTime.current = Date.now();
        player.loadVideoById(videoId, 0);
      }
    };

    const handleSyncState = ({ videoId, playState: pState, currentTime: cTime }) => {
      const player = playerRef.current;
      if (!player || !playerReady) return;

      isIncomingSync.current = true;
      lastProgrammaticTime.current = Date.now();
      initialSyncDone.current = true;
      const currentId = player.getVideoData?.().video_id;

      if (videoId && currentId !== videoId) {
        player.loadVideoById(videoId, cTime || 0);
      } else {
        player.seekTo(cTime || 0, true);
      }

      if (pState === 'playing') {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    };

    socketService.on('playback_broadcast', handlePlaybackBroadcast);
    socketService.on('video_changed', handleVideoChanged);
    socketService.on('sync_state', handleSyncState);

    return () => {
      socketService.off('playback_broadcast', handlePlaybackBroadcast);
      socketService.off('video_changed', handleVideoChanged);
      socketService.off('sync_state', handleSyncState);
    };
  }, [roomId, playerReady]);


  // 5. Change Video URL
  // Only emit to server — the server echoes video_changed back to all clients
  // (including this host), so handleVideoChanged is the single load path for
  // everyone. Calling loadVideoById here directly would cause a double-load:
  // once immediately, then again when the echo arrives.
  const handleLoadVideo = (e) => {
    e.preventDefault();
    setUrlError('');

    const extractedId = extractYoutubeId(inputUrl);
    if (!extractedId) {
      setUrlError('Please enter a valid YouTube link.');
      return;
    }

    socketService.changeVideo(roomId, extractedId);
    setInputUrl('');
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Native YouTube Viewport */}
      <div className="relative aspect-video w-full bg-brand-black rounded-2xl overflow-hidden border border-brand-border/80 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Control Banner */}
      <div className="bg-brand-charcoal/60 backdrop-blur-md border border-brand-border/80 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs text-brand-muted">
          <div className="flex items-center gap-1.5">
            <span>{isHost ? '👑' : '🎖️'}</span>
            <span>
              <strong>{isHost ? 'Host Mode' : 'Moderator Mode'}:</strong> You have control permissions. Your play, pause, seek, and video switch actions synchronize the entire room.
            </span>
          </div>
        </div>

        <form onSubmit={handleLoadVideo} className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-brand-border/40">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste any YouTube URL (e.g., https://youtube.com/watch?v=...)"
            className="flex-1 bg-brand-black border border-brand-border/80 rounded-xl px-4 py-2.5 text-xs text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-red transition-colors"
          />
          <button
            type="submit"
            disabled={!inputUrl.trim()}
            className="px-5 py-2.5 bg-brand-charcoal hover:bg-brand-border border border-brand-border text-brand-white font-semibold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-40"
          >
            Switch Video
          </button>
        </form>

        {urlError && (
          <p className="text-[11px] text-brand-red font-medium">⚠️ {urlError}</p>
        )}
      </div>
    </div>
  );
}
