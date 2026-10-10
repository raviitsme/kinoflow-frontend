import React from 'react';

export default function Features() {
  const features = [
    {
      id: "sync",
      icon: (
        <svg className="w-6 h-6 transition-transform duration-300 ease-out group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        </svg>
      ),
      badge: "PERFECT MATCH",
      title: "Play & Pause for Everyone",
      desc: "No more countdowns! When you hit play, pause, or skip ahead, your friends' screens react instantly. Everyone stays on the exact same second, together."
    },
    {
      id: "roles",
      icon: (
        <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      badge: "YOU'RE IN CHARGE",
      title: "Host Control & Permissions",
      desc: "Avoid the chaos. As the room host, you decide who gets to control the remote. Keep playback completely locked or share the remote with co-hosts."
    },
    {
      id: "chat",
      icon: (
        <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      badge: "LIVE CHAT",
      title: "Built-In Room Chat",
      desc: "Share your reactions, drop memes, and chat in real-time alongside the video. A clean sidebar chat keeps the conversation going without covering up the movie."
    },
    {
      id: "setup",
      icon: (
        <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      badge: "ZERO FRICTION",
      title: "No Signups, No Downloads",
      desc: "Forget about registering accounts or installing bloated extensions. Just click, share your link, and start watching immediately in any browser."
    }
  ];

  return (
    <section id="features" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-brand-black overflow-hidden border-t border-brand-border/40">
      
      {/* Background ambient projection glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75-[500px] lg:w-2003h-75h-[500px] lg:h-200 bg-brand-red/3 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none select-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center mb-16 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-brand-charcoal/60 border border-brand-border/60 text-[9px] sm:text-xs text-brand-muted select-none">
            <span className="relative flex h-1.5 sm:h-2 w-1.5 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 sm:h-2 w-1.5 sm:w-2 bg-brand-red"></span>
            </span>
            <span className="font-semibold uppercase tracking-wider text-[9px] sm:text-[10px] md:text-xs text-brand-white">
              LOADED WITH FEATURES
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-white tracking-tight leading-none">
            Everything you need for Movie Night
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted max-w-md sm:max-w-lg mx-auto leading-relaxed font-medium">
            KinoFlow is built to be simple, fast, and completely hassle-free so you can focus on enjoying the show.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feat) => (
            <div
              key={feat.id}
              className="group relative bg-brand-charcoal/30 backdrop-blur-md border border-brand-border/80 hover:border-brand-red/40 rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_40px_rgba(229,9,20,0.12)] transition-all duration-500 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Icon & Badge Row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="text-brand-white bg-brand-black/60 p-3 rounded-xl border border-brand-border/80 group-hover:border-brand-red/40 group-hover:text-brand-red transition-all duration-500">
                    {feat.icon}
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-extrabold tracking-widest text-brand-red bg-brand-red/10 border border-brand-red/20 px-3 py-1 rounded-md">
                    {feat.badge}
                  </span>
                </div>

                {/* Feature Title */}
                <h3 className="text-lg sm:text-xl font-black text-brand-white group-hover:text-brand-red transition-colors duration-300">
                  {feat.title}
                </h3>

                {/* Feature Description */}
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mt-2.5">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
