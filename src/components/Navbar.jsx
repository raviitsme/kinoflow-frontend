import React, { useState, useEffect } from "react";

export default function Navbar({ onStartWatchingClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scroll height to dim/gently transition the header glass background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      // Offset slightly to account for fixed navbar height
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
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled || mobileMenuOpen
          ? "bg-brand-black/80 backdrop-blur-xl py-3 border-b border-brand-border/80 shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
          : "bg-transparent py-5 border-b border-brand-border/10"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left Side: Brand Logo with Red Cine-Glow Indicator */}
        <div
          onClick={() => {
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          {/* Logo Icon */}
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-brand-red to-brand-red-hover transition-transform duration-500 group-hover:rotate-6 shadow-[0_0_15px_rgba(229,9,20,0.4)] group-hover:shadow-[0_0_25px_rgba(229,9,20,0.7)]">
            <span className="font-black text-base sm:text-lg text-brand-white tracking-tighter">
              K
            </span>
            {/* Inner dynamic lens flare */}
            <div className="absolute inset-0.5 rounded-lg bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Logo Name & Live Status Badge */}
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-tight text-brand-white leading-none">
              KINO
              <span className="text-brand-red group-hover:text-brand-white transition-colors duration-300">
                FLOW
              </span>
            </span>
          </div>
        </div>

        {/* Center: Desktop Nav Links (Hidden on Mobile) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("home")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="relative text-brand-muted hover:text-brand-white transition-colors duration-300 py-1 group"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 group-hover:w-full rounded-full shadow-[0_0_8px_rgba(229,9,20,0.8)]" />
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="relative text-brand-muted hover:text-brand-white transition-colors duration-300 py-1 group"
          >
            How It Works
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 group-hover:w-full rounded-full shadow-[0_0_8px_rgba(229,9,20,0.8)]" />
          </a>
          <a
            href="#features"
            className="relative text-brand-muted hover:text-brand-white transition-colors duration-300 py-1 group"
          >
            Features
            <span className="absolute bottom-0 left-0 w-0 h-0.5g-brand-red transition-all duration-300 group-hover:w-full rounded-full shadow-[0_0_8px_rgba(229,9,20,0.8)]" />
          </a>
        </nav>

        {/* Right Side: Desktop CTA + Mobile Hamburger Trigger */}
        <div className="flex items-center gap-4">
          {/* CTA Button (Hidden on Mobile) */}
          <button
            onClick={onStartWatchingClick}
            className="hidden md:flex sm:items-center sm:relative group overflow-hidden px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-brand-red text-brand-white font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,9,20,0.5)] active:scale-95 cursor-pointer"
          >
            {/* Glossy sweep effect */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />

            <span className="relative z-10 flex items-center gap-1.5">
              Start Watching
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </span>
          </button>

          {/* Hamburger Menu Trigger Button (Visible only on mobile/tablet) */}
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-brand-charcoal/80 border border-brand-border hover:border-brand-red/50 text-brand-white transition-all duration-300 cursor-pointer focus:outline-none"
          >
            <div className="w-5 h-4 flex flex-col justify-between relative">
              <span
                className={`w-full h-0.5 bg-brand-white rounded transition-all duration-300 origin-left ${mobileMenuOpen ? "rotate-45 translate-x-0.5 -translate-y-px" : ""}`}
              />
              <span
                className={`w-full h-0.5g-brand-white rounded transition-all duration-300 ${mobileMenuOpen ? "opacity-0 scale-0" : ""}`}
              />
              <span
                className={`w-full h-0.5 bg-brand-white rounded transition-all duration-300 origin-left ${mobileMenuOpen ? "-rotate-45 translate-x-0.5rtranslate-y-p" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Glassmorphism Navigation Drawer (Smooth Slide & Fade) */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-brand-black/95 backdrop-blur-2xl border-b border-brand-border transition-all duration-300 ease-in-out origin-top overflow-hidden ${
          mobileMenuOpen
            ? "max-h-75 opacity-100 scale-y-100 py-6"
            : "max-h-0 opacity-0 scale-y-0 py-0"
        }`}
      >
        <nav className="flex flex-col items-center gap-6 px-6">
          <a
            href="#how-it-works"
            onClick={(e) => handleMobileNavClick(e, "how-it-works")}
            className="text-sm font-semibold tracking-wider uppercase text-brand-muted hover:text-brand-white transition-colors duration-200"
          >
            How It Works
          </a>
          <a
            href="#features"
            onClick={(e) => handleMobileNavClick(e, "features")}
            className="text-sm font-semibold tracking-wider uppercase text-brand-muted hover:text-brand-white transition-colors duration-200"
          >
            Features
          </a>

          {/* Call-to-action Button inside Mobile Drawer */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onStartWatchingClick();
            }}
            className="w-full relative group overflow-hidden py-3 rounded-xl bg-brand-red text-brand-white font-bold text-xs uppercase tracking-widest text-center shadow-lg active:scale-95 cursor-pointer mt-2"
          >
            Start Watching Room →
          </button>
        </nav>
      </div>
    </header>
  );
}
