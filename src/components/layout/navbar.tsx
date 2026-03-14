"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-ink/[0.08] bg-base/85 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" onClick={() => { if (window.location.pathname === "/") { window.scrollTo({ top: 0, behavior: "smooth" }); } }} className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink font-bold text-white text-sm shadow-lg shadow-pink/25">
            CG
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[22px] font-semibold tracking-tight text-ink">
              Curly Girl
            </span>
            <span className="text-[10px] font-semibold tracking-[0.2em] text-pink uppercase">
              ESL / ELD LESSON PLANS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/#about" onClick={(e) => scrollTo(e, "about")} className="rounded-full px-4 py-1.5 text-sm font-medium text-ink uppercase tracking-wide transition-all duration-200 hover:bg-pink hover:text-white hover:font-bold">About</Link>
          <Link href="/#features" onClick={(e) => scrollTo(e, "features")} className="rounded-full px-4 py-1.5 text-sm font-medium text-ink uppercase tracking-wide transition-all duration-200 hover:bg-pink hover:text-white hover:font-bold">Features</Link>
          <Link href="/#how-it-works" onClick={(e) => scrollTo(e, "how-it-works")} className="rounded-full px-4 py-1.5 text-sm font-medium text-ink uppercase tracking-wide transition-all duration-200 hover:bg-pink hover:text-white hover:font-bold">How It Works</Link>
          <Link href="/#pricing" onClick={(e) => scrollTo(e, "pricing")} className="rounded-full px-4 py-1.5 text-sm font-medium text-ink uppercase tracking-wide transition-all duration-200 hover:bg-pink hover:text-white hover:font-bold">Pricing</Link>
          <Link href="/login" className="rounded-full px-4 py-1.5 text-sm font-medium text-ink uppercase tracking-wide transition-all duration-200 hover:bg-pink hover:text-white hover:font-bold">Log In</Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/#pricing"
            onClick={(e) => scrollTo(e, "pricing")}
            className="group inline-flex items-center gap-2 rounded-full bg-pink px-6 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-pink/25 ring-2 ring-transparent transition-all duration-300 hover:bg-pink-dark hover:shadow-2xl hover:shadow-pink/40 hover:-translate-y-1 hover:scale-105 hover:ring-gold"
          >
            GET STARTED
            <span className="relative h-4 w-4">
              <svg className="absolute inset-0 h-4 w-4 transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
              <svg className="absolute inset-0 h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-ink/50 hover:text-ink md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-ink/[0.08] bg-base/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            <Link href="/#about" onClick={(e) => scrollTo(e, "about")} className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink/70 hover:bg-white/20 hover:text-ink">About</Link>
            <Link href="/#features" onClick={(e) => scrollTo(e, "features")} className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink/70 hover:bg-white/20 hover:text-ink">Features</Link>
            <Link href="/#how-it-works" onClick={(e) => scrollTo(e, "how-it-works")} className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink/70 hover:bg-white/20 hover:text-ink">How It Works</Link>
            <Link href="/#pricing" onClick={(e) => scrollTo(e, "pricing")} className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink/70 hover:bg-white/20 hover:text-ink">Pricing</Link>
            <Link href="/login" className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink/70 hover:bg-white/20 hover:text-ink" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
            <div className="mt-3 border-t border-ink/[0.08] pt-4">
              <Link href="/#pricing" onClick={(e) => scrollTo(e, "pricing")} className="block w-full rounded-full bg-pink py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-pink/25 hover:bg-pink-dark">GET STARTED</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
