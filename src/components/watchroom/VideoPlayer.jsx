import React, { useEffect, useRef, useState } from 'react';
import socketService from '../../services/socketService';
import extractYoutubeId from '../../utils/youtube';

export default function VideoPlayer({ roomId, isHost, myRole, currentVideoId }) {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const playerWrapperRef = useRef(null);
  
  // Time-lock tracker to completely eliminate player state-change loops
  const lastProgrammaticActionTime = useRef(0);

  const [inputUrl, setInputUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [playerReady, setPlayerReady] = useState(false);

  // Define control authority based on role
  const canControl = isHost || myRole === 'Moderator';

  // 1. Initialize the official YouTube IFrame API for ALL users
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
        videoId: currentVideoId || "LXb3EKWsInQ",
        playerVars: {
          autoplay: 0,
          controls: 1,           // Enables the EXACT native YouTube control bar for everyone!
          disablekb: canControl ? 0 : 1, // Disable keyboard scrubbing for spectators
          modestbranding: 1,
          rel: 0,
          fs: 1,                 // Enable native double-click and button fullscreen
          enablejsapi: 1,        // Fixes origin postMessage issues
          origin: window.location.origin,
          widget_referrer: window.location.origin,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            setPlayerReady(true);
            
            // Initial sync request once the iframe loads
            if (socketService.socket) {
              socketService.socket.emit('request_sync', { roomId });
            }
          },
          onStateChange: handlePlayerStateChange,
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
  }, [roomId, currentVideoId, canControl]);

  // 2. Handle native clicks/scrubs on the YouTube Playbar
  const handlePlayerStateChange = (event) => {
    const player = playerRef.current;
    if (!player || typeof player.getCurrentTime !== 'function') return;

    // If a programmatic sync occurred in the last 1.5 seconds, ignore this event
    if (Date.now() - lastProgrammaticActionTime.current < 1500) {
      return;
    }

    const time = player.getCurrentTime();

    if (canControl) {
      // Host or Moderator: Broadcast state changes to the room
      if (event.data === window.YT.PlayerState.PLAYING) {
        socketService.emitAction(roomId, 'play', time);
      } else if (event.data === window.YT.PlayerState.PAUSED) {
        socketService.emitAction(roomId, 'pause', time);
      }
    } else {
      // SPECTATOR SNAPPING GUARD:
      // If a participant clicks pause or play on the native bar, reject the click
      // and immediately request the correct room state to snap them back to the Host!
      if (
        event.data === window.YT.PlayerState.PLAYING ||
        event.data === window.YT.PlayerState.PAUSED
      ) {
        if (socketService.socket) {
          socketService.socket.emit('request_sync', { roomId });
        }
      }
    }
  };

  // 3. Listen for Incoming WebSocket Sync Events
  useEffect(() => {
    const handlePlaybackBroadcast = ({ action, time, sentAt }) => {
      const player = playerRef.current;
      if (!player || !playerReady) return;

      // Set programmatic action time-lock to prevent feedback loop
      lastProgrammaticActionTime.current = Date.now();

      // Compensate for transit latency lag
      const transitLatency = sentAt
        ? Math.max(0, (Date.now() - sentAt) / 1000)
        : 0;
      const targetTime = time + (action === 'play' ? transitLatency : 0);

      const localTime = player.getCurrentTime();
      const drift = Math.abs(localTime - targetTime);

      // Snap to correct time if drift exceeds 0.5s
      if (drift > 0.5) {
        player.seekTo(targetTime, true);
      }

      if (action === 'play') {
        player.playVideo();
      } else if (action === 'pause') {
        player.pauseVideo();
        if (drift > 0.2) player.seekTo(time, true);
      } else if (action === 'seek') {
        player.seekTo(targetTime, true);
      }
    };

    const handleVideoChanged = ({ videoId }) => {
      const player = playerRef.current;
      if (player && typeof player.loadVideoById === 'function') {
        lastProgrammaticActionTime.current = Date.now();
        player.loadVideoById(videoId, 0);
      }
    };

    const handleSyncState = ({ videoId, playState: pState, currentTime: cTime }) => {
      const player = playerRef.current;
      if (!player || !playerReady) return;

      lastProgrammaticActionTime.current = Date.now();
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

  // 4. Host Periodic Position Correction (Heartbeat every 4 seconds)
  useEffect(() => {
    if (!canControl) return;

    const interval = setInterval(() => {
      const player = playerRef.current;
      if (player && typeof player.getPlayerState === 'function') {
        const state = player.getPlayerState();
        if (state === window.YT.PlayerState.PLAYING) {
          const time = player.getCurrentTime();
          socketService.emitAction(roomId, 'seek', time);
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [canControl, roomId]);

  const handleLoadVideo = (e) => {
    e.preventDefault();
    setUrlError('');

    const extractedId = extractYoutubeId(inputUrl);
    if (!extractedId) {
      setUrlError('Please enter a valid YouTube link.');
      return;
    }

    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      lastProgrammaticActionTime.current = Date.now();
      playerRef.current.loadVideoById(extractedId, 0);
    }

    socketService.changeVideo(roomId, extractedId);
    setInputUrl('');
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Native YouTube Viewport */}
      <div 
        ref={playerWrapperRef}
        className="relative aspect-video w-full bg-brand-black rounded-2xl overflow-hidden border border-brand-border/80 shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
      >
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Control bar / Info bar */}
      {canControl ? (
        <div className="bg-brand-charcoal/60 backdrop-blur-md border border-brand-border/80 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <div className="flex items-center gap-1.5">
              <span>👑</span>
              <span><strong>Control Mode:</strong> Use YouTube's playbar natively. Your clicks sync the room instantly.</span>
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
          {urlError && <p className="text-[11px] text-brand-red font-medium">{urlError}</p>}
        </div>
      ) : (
        <div className="bg-brand-charcoal/40 border border-brand-border/60 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap text-xs text-brand-muted">
          <div className="flex items-center gap-1.5 font-medium">
            <span>🍿</span> 
            <span>You have full access to native subtitles (CC), volume, and video quality settings. Timeline scrubbing is restricted to the Host/Moderators.</span>
          </div>
          <span className="text-[10px] bg-brand-black/60 px-2.5 py-1 rounded border border-brand-border uppercase font-mono text-brand-muted">
            Synced Roster
          </span>
        </div>
      )}
    </div>
  );
}
