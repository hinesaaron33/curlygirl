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
      className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="border-t border-ink/[0.08] bg-base/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-3 sm:gap-4">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-full bg-pink px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-pink/20 transition-all duration-200 hover:bg-pink-dark hover:-translate-y-0.5"
          >
            See Plans
          </a>
          <a
            href="#compare-plans"
            className="inline-flex items-center gap-2 rounded-full bg-[#7C3AED] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#7C3AED]/20 transition-all duration-200 hover:bg-[#6D28D9] hover:-translate-y-0.5"
          >
            Compare Plans
          </a>
        </div>
      </div>
    </div>
  );
}
