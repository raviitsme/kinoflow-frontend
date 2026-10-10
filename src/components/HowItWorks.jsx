import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      badge: "LOBBY SETUP",
      icon: "🍿",
      title: "Launch Your Lobby",
      desc: "Enter your nickname to spin up a private watch room. The system automatically designates you as the Host, loading your control panel immediately.",
      interactiveDetail: "Room initialized on WebSocket Channel #1",
    },
    {
      num: "02",
      badge: "INVITE FRIENDS",
      icon: "🎟️",
      title: "Share Your Code",
      desc: "Copy the unique 6-digit room code or share the direct invite link with your friends. They jump directly into your cinema room—no accounts, no setup.",
      interactiveDetail: "Sync connection open & listening for joiners",
    },
    {
      num: "03",
      badge: "PERFECT SYNC",
      icon: "⚡",
      title: "Watch in Perfect Harmony",
      desc: "Paste any YouTube link and hit play. Our real-time sockets keep timeline scrubs, pauses, and plays perfectly synced to the exact frame.",
      interactiveDetail: "WebSocket state sync: 0ms offset detected",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-brand-black overflow-hidden border-t border-brand-border/40"
    >
      {/* 🔮 Background ambient projection glow matching the Hero Section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 sm:w-125 lg:w-200 h-75-sm:h-125lg:h-200bbg-brand-red/3r-[100px] sm:blur-[150px] rounded-full pointer-events-none select-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* SECTION HEADER */}
        <div className="text-center mb-20 sm:mb-28 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-brand-charcoal/60 border border-brand-border/60 text-[9px] sm:text-xs text-brand-muted select-none">
            <span className="relative flex h-1.5 sm:h-2 w-1.5 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 sm:h-2 w-1.5 sm:w-2 bg-brand-red"></span>
            </span>
            <span className="font-semibold uppercase tracking-wider text-[9px] sm:text-[10px] md:text-xs text-brand-white">
              SOCIALLY SYNCED WORKFLOW
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-white tracking-tight leading-none">
            How KINO<span className="text-brand-red">FLOW</span> Works
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted max-w-md sm:max-w-lg mx-auto leading-relaxed font-medium">
            Go from a blank page to hosting a perfectly synchronized,
            low-latency watch party with your friends in under thirty seconds
            and in just 3 simple steps!
          </p>
        </div>

        {/* TIMELINE CONNECTOR TRACK AREA */}
        <div className="relative">
          {/* Laser-Glow Central Connector Line (Desktop Only - Hidden on Mobile) */}
          <div className="hidden lg:block absolute left-1/2 top-10 bottom-24 w-0.5 bg-linear-to-b from-brand-red via-brand-border to-transparent -translate-x-1/2 z-0" />

          <div className="space-y-12 lg:space-y-24">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={step.num}
                  className={`flex flex-col lg:flex-row items-center justify-between relative z-10 w-full ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* LEFT/RIGHT MOTION GRAPHIC CARD */}
                  <div className="w-full lg:w-[45%] group">
                    <div className="bg-brand-charcoal/30 backdrop-blur-md border border-brand-border/80 hover:border-brand-red/50 rounded-2xl p-5 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_40px_rgba(229,9,20,0.12)] transition-all duration-500 hover:-translate-y-2 hover:translate-x-0.5 cursor-pointer">
                      {/* Badge and Step Icon row */}
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <span className="text-[9px] sm:text-[10px] font-extrabold tracking-widest text-brand-red bg-brand-red/10 border border-brand-red/20 px-3 py-1 rounded-md">
                          {step.badge}
                        </span>
                        <div className="text-xl sm:text-2xl p-2 bg-brand-black/60 rounded-xl border border-brand-border/80 group-hover:border-brand-red/40 group-hover:text-brand-red transition-all duration-500">
                          {step.icon}
                        </div>
                      </div>

                      {/* Step Heading */}
                      <h3 className="text-lg sm:text-xl font-black text-brand-white group-hover:text-brand-red transition-colors duration-300">
                        {step.title}
                      </h3>

                      {/* Step Description */}
                      <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mt-2.5">
                        {step.desc}
                      </p>

                      {/* Mock System Event Log (Simulates Interactive Code Action) */}
                      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-brand-border/50 flex items-center justify-between text-[10px] font-mono text-brand-muted/70 group-hover:text-brand-white transition-colors duration-500">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse"></span>
                          {step.interactiveDetail}
                        </span>
                        <span className="text-[8px] sm:text-[9px] bg-brand-black/40 border border-brand-border px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CENTRAL NETWORK NODE (Desktop Only) */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center w-12 h-12 rounded-full bg-brand-black border-2 border-brand-border group-hover:border-brand-red transition-all duration-500 z-20 group-hover:scale-110">
                    {/* Ring Pulse Glow on Hover */}
                    <span className="absolute inset-0 rounded-full bg-brand-red/10 animate-signal-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <span className="relative font-mono font-black text-sm text-brand-white group-hover:text-brand-red transition-all duration-300">
                      {step.num}
                    </span>
                  </div>

                  {/* Empty spacer column to keep grid symmetric on Desktop */}
                  <div className="hidden lg:block w-[45%]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
