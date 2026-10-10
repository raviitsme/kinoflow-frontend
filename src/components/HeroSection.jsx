import React from "react";

export default function HeroSection({ onStartWatchingClick }) {
  // Smooth scroll handler for CTA button
  const handleScrollToFeatures = (e) => {
    e.preventDefault();
    const targetElement = document.getElementById("how-it-works");
    if (targetElement) {
      const offset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center pt-24 sm:pt-32 pb-16 px-4 sm:px-6 md:px-8 overflow-hidden bg-brand-black"
    >
      {/* 1. DEEP CINEMATIC BACKGROUND GLOWS */}
      <div className="absolute top-1/4 left-1/2 lg:left-1/3 -translate-x-1/2 -translate-y-1/2 w-75 sm:w-125 lg:w-1753h-75h-sm:h-125-[700px] bg-brand-red/10 blur-[90px] sm:blur-[130px] rounded-full pointer-events-none select-none z-0" />
      <div className="absolute bottom-1/4 right-1/2 lg:right-1/4 translate-x-1/2 translate-y-1/2 w-62.5:sm:w-100:wlg:w-1502h-62.5h-[400px] lg:h-150wbg-white/1.5r-[80px] sm:blur-[110px] rounded-full pointer-events-none select-none z-0" />

      {/* 2. FLOATING BOKEH PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute top-[15%] left-[5%] sm:left-[15%] w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-brand-red/10 blur-lg sm:blur-xl animate-float-slow" />
        <div className="absolute top-[65%] right-[10%] sm:right-[20%] w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-white/2 blur-xl sm:blur-2xl animate-float-medium" />
        <div className="hidden sm:block absolute bottom-[10%] left-[25%] w-14 h-12 rounded-full bg-brand-red/5 blur-md animate-float-slow [animation-delay:4s]" />
      </div>

      {/* 3. HERO CONTENT GRID */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* LEFT COLUMN: Premium Introduction & Value Proposition */}
        <div className="lg:col-span-6 text-center lg:text-left space-y-6 sm:space-y-8 flex flex-col items-center lg:items-start">
          {/* Active Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-brand-charcoal/60 border border-brand-border/60 text-[9px] sm:text-xs text-brand-muted select-none">
            <span className="relative flex h-1.5 sm:h-2 w-1.5 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 sm:h-2 w-1.5 sm:w-2 bg-brand-red"></span>
            </span>
            <span className="font-semibold uppercase tracking-wider text-[9px] sm:text-[10px] md:text-xs text-brand-white">
              SOCIALLY SYNCED CINEMA
            </span>
          </div>

          {/* Fluid Cinematic Headline */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black text-brand-white tracking-tight leading-[1.1] sm:leading-[1.1]">
            Watch YouTube <br />
            together in <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-red via-[#ff4d56] to-brand-white drop-shadow-[0_0_20px_rgba(229,9,20,0.25)]">
              Perfect Sync
            </span>
          </h1>

          {/* Fluid Descriptive Introduction Text */}
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-brand-muted max-w-md sm:max-w-xl lg:max-w-lg leading-relaxed font-medium">
            Stop guessing the timestamps. Sync playback controls instantly
            across countries and devices using our low-latency WebSocket
            channels. Your group cinema experience, elevated.
          </p>

          {/* Core Interactive Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
            <button
              onClick={onStartWatchingClick}
              className="w-full sm:w-auto relative group overflow-hidden bg-brand-red hover:bg-brand-red-hover text-brand-white font-bold px-8 py-4 rounded-xl text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_4px_20px_rgba(229,9,20,0.25)] hover:shadow-[0_8px_25px_rgba(229,9,20,0.55)] cursor-pointer active:scale-[0.98]"
            >
              {/* Glossy sweep effect */}
              <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
              <span className="relative z-10">Lets KinoFlow</span>
            </button>

            <button
              onClick={handleScrollToFeatures}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-brand-white font-bold text-xs sm:text-sm uppercase tracking-widest border border-brand-border hover:border-brand-white/40 bg-transparent transition-all duration-300 hover:bg-brand-charcoal/30 cursor-pointer text-center"
            >
              How it works ↓
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Glimpse Preview Mockup */}
        <div className="lg:col-span-6 flex justify-center w-full relative">
          {/* Behind-Mockup soft cinematic backlight */}
          <div className="absolute inset-0 bg-brand-red/5 rounded-2xl blur-3xl z-0 pointer-events-none" />

          {/* Glassmorphic Mockup Frame */}
          <div className="relative z-10 w-full max-w-lg bg-brand-charcoal/30 backdrop-blur-md border border-brand-border/80 rounded-2xl p-3 sm:p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:border-brand-red/20 transition-all duration-500 group select-none">
            {/* Mock Window Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-brand-border/60 mb-3 text-[10px] font-mono text-brand-muted">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
              </div>
              <span className="bg-brand-black/60 px-3 py-1 rounded-md border border-brand-border/60">
                kinoflow.app/room/movie-night
              </span>
              <span className="hidden sm:inline text-emerald-500">
                Connected
              </span>
            </div>

            {/* Video Canvas Element */}
            <div className="relative aspect-video w-full bg-brand-black rounded-xl overflow-hidden border border-brand-border/60">
              {/* Mock Movie Background Graphic with gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/40 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.8)_100%)]"></div>

                {/* Simulated Movie Thumbnail Backdrop (Interstellar atmosphere) */}
                <div className="w-full h-full flex items-center justify-center bg-[#09090b]">
                  <div className="w-32 h-32 bg-brand-red/10 rounded-full blur-xl absolute animate-pulse"></div>
                  {/* Mock Play button container */}
                  <div className="w-14 h-14 rounded-full bg-brand-red/90 text-brand-white flex items-center justify-center font-bold text-lg shadow-lg shadow-brand-red/30 cursor-pointer hover:scale-105 transition-transform relative z-10">
                    ▶
                  </div>
                </div>
              </div>

              {/* Top Bar Indicators over Video */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <span className="flex items-center gap-1.5 bg-brand-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-brand-border/50 text-[9px] font-bold text-brand-white">
                  Participants
                </span>

                {/* Interactive avatars display */}
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-brand-red border border-brand-black text-[8px] flex items-center justify-center font-bold text-brand-white shadow">
                    A
                  </div>
                  <div className="w-5 h-5 rounded-full bg-blue-500 border border-brand-black text-[8px] flex items-center justify-center font-bold text-brand-white shadow">
                    R
                  </div>
                  <div className="w-5 h-5 rounded-full bg-emerald-500 border border-brand-black text-[8px] flex items-center justify-center font-bold text-brand-white shadow">
                    S
                  </div>
                </div>
              </div>

              {/* Bottom Playback Overlay */}
              <div className="absolute bottom-3 left-3 right-3 space-y-2 z-10">
                {/* Title */}
                <p className="text-[10px] sm:text-xs font-semibold text-brand-white drop-shadow-md">
                  Interstellar - Space-time Science Clip
                </p>

                {/* Scrubber Timeline track */}
                <div className="space-y-1">
                  <div className="w-full bg-brand-border/60 h-1 rounded-full overflow-hidden">
                    <div className="bg-brand-red h-full w-2/3 shadow-[0_0_8px_rgba(229,9,20,1)]"></div>
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-brand-muted">
                    <span>01:45</span>
                    <span>02:30</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Event Notification Toast Glimpse (Simulating sync) */}
            <div className="mt-3 flex items-center justify-between bg-brand-black/80 border border-brand-border/60 rounded-xl px-4 py-2.5 shadow-lg animate-pulse">
              <div className="flex items-center gap-2">
                <span className="text-xs">🔄</span>
                <span className="text-[11px] text-brand-muted">
                  <strong className="text-brand-red">Alex (Host)</strong> paused
                  the stream
                </span>
              </div>
              <span className="text-[9px] font-mono text-brand-muted">
                Just now
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
