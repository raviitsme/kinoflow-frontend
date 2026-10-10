import React from 'react';

export default function Footer({ onStartWatchingClick }) {
  const currentYear = new Date().getFullYear();

  const handleQuickScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-brand-black border-t border-brand-border/40 relative overflow-hidden z-10">
      
      {/* Tiny ambient bottom-right crimson glow */}
      <div className="absolute bottom-0 right-0 w-500h-50rand-red/[0.02] blur-[80px] rounded-full pointer-events-none select-none z-0" />

      {/* Main Footer Container */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10 relative z-10">
        
        {/* UPPER FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-brand-border/40">
          
          {/* Column 1: Brand & Description (Spans 5 Columns) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5 select-none">
              <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center font-black text-brand-white shadow-[0_0_12px_rgba(229,9,20,0.5)]">
                K
              </div>
              <span className="text-lg font-black tracking-tight text-brand-white">
                KINO<span className="text-brand-red">FLOW</span>
              </span>
            </div>
            <p className="text-xs text-brand-muted max-w-sm leading-relaxed font-medium">
              KinoFlow is a next-generation social theater platform enabling friends to stream, play, and discuss YouTube videos together in frame-by-frame synchronization.
            </p>
          </div>

          {/* Column 2: Navigation Links (Spans 3 Columns) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] font-bold tracking-widest text-brand-white uppercase">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted font-medium">
              <li>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => handleQuickScroll(e, 'how-it-works')}
                  className="hover:text-brand-red transition-colors duration-200"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a 
                  href="#features" 
                  onClick={(e) => handleQuickScroll(e, 'features')}
                  className="hover:text-brand-red transition-colors duration-200"
                >
                  Key Features
                </a>
              </li>
              <li>
                <a 
                  href="#preview" 
                  onClick={(e) => handleQuickScroll(e, 'preview')}
                  className="hover:text-brand-red transition-colors duration-200"
                >
                  Watch Room Preview
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Friendly Quick Tip (Spans 4 Columns) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[10px] font-bold tracking-widest text-brand-white uppercase">
              Quick Tip
            </h4>
            
            {/* Friendly user card */}
            <div className="bg-brand-charcoal/60 border border-brand-border/60 rounded-xl p-4 space-y-2">
              <p className="text-[11px] text-brand-muted leading-relaxed font-medium">
                Want to test it out right now? Click <button onClick={onStartWatchingClick} className="text-brand-red hover:underline font-bold focus:outline-none">Launch Watch Party</button>, copy your room link, and open it in a private window to see the instant sync in action!
              </p>
            </div>
          </div>

        </div>

        {/* BOTTOM FOOTER LOGS */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-brand-muted/60 font-medium select-none">
          <div>
            KinoFlow &copy; {currentYear} &middot; Designed for the Ultimate Watch Room
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium">
            <span>Real-Time Playback</span>
            <span className="text-brand-border">|</span>
            <span>Zero Setup Required</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
