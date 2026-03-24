"use client";

import { useState, useEffect } from "react";

export function StickyCTABar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setVisible(window.scrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed left-0 top-1/2 z-40 -translate-y-1/2 transition-all duration-300 hidden md:block ${
        visible
          ? "translate-x-0 opacity-100"
          : "-translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex w-24 flex-col gap-2 rounded-r-xl border border-l-0 border-ink/[0.08] bg-base/90 p-2.5 shadow-lg backdrop-blur-xl">
        <a
          href="#pricing"
          className="group flex items-center justify-center gap-1 rounded-lg border-2 border-transparent bg-pink px-3 py-3 text-center text-sm font-semibold text-white shadow-md shadow-pink/20 transition-all duration-300 hover:bg-white hover:text-pink hover:border-pink hover:scale-105"
        >
          <span>Pricing</span>
          <svg className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </a>
        <a
          href="#compare-plans"
          className="group flex items-center justify-center gap-1 rounded-lg border-2 border-transparent bg-[#7C3AED] px-3 py-3 text-center text-sm font-semibold text-white shadow-md shadow-[#7C3AED]/20 transition-all duration-300 hover:bg-white hover:text-[#7C3AED] hover:border-[#7C3AED] hover:scale-105"
        >
          <span>Compare</span>
          <svg className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </a>
      </div>
    </div>
  );
}
