"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function StatCard({
  value,
  label,
  countTo,
  delay = 0,
  bounce = false,
  href,
  hoverLabel,
}: {
  value?: React.ReactNode;
  label: string;
  countTo?: number;
  delay?: number;
  bounce?: boolean;
  href?: string;
  hoverLabel?: string;
}) {
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  const animate = useCallback(() => {
    if (!countTo) return;
    const duration = 2000;
    let start: number | null = null;

    function step(timestamp: number) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * countTo!));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [countTo]);

  useEffect(() => {
    // On mobile, skip animations — show final values immediately
    if (isMobile) {
      if (countTo) setCount(countTo);
      setTriggered(true);
      return;
    }

    if (!bounce && !countTo) return;
    const el = ref.current;
    if (!el) return;
    let done = false;
    const cleanup = () => {
      done = true;
      obs.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!done && entry.isIntersecting && window.scrollY > 50) {
          setTimeout(() => {
            setTriggered(true);
            animate();
          }, delay);
          cleanup();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    const onScroll = () => {
      if (!done && window.scrollY > 50) {
        obs.unobserve(el);
        obs.observe(el);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, [animate, delay, bounce, countTo, isMobile]);

  const content = (
    <>
      <p className="font-[family-name:var(--font-playfair)] text-6xl font-bold text-[#61A0AF]">
        {countTo ? <>{(triggered ? count : 0).toLocaleString()}<span className="text-4xl font-bold align-middle">+</span></> : value}
      </p>
      {hoverLabel ? (
        <p className="mt-2 text-lg font-semibold text-ink/70">
          <span className="group-hover:hidden">{label}</span>
          <span className="hidden group-hover:inline text-pink">{hoverLabel}</span>
        </p>
      ) : (
        <p className="mt-2 text-lg font-semibold text-ink/70">{label}</p>
      )}
    </>
  );

  const cls = `group rounded-xl bg-[#F5D491] border-2 border-gold-dark/50 shadow-md py-8 text-center ${bounce ? (triggered ? "animate-bounce-in" : "scale-100") : ""} ${href ? "cursor-pointer transition-all duration-300 hover:scale-105 ring-2 ring-transparent hover:ring-pink hover:shadow-lg hover:shadow-pink/20" : ""}`;

  if (href) {
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={cls}>
        {content}
      </a>
    );
  }

  return (
    <div ref={ref} className={cls}>
      {content}
    </div>
  );
}
