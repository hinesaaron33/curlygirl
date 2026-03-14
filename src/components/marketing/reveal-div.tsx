"use client";

import { createContext, useContext, useEffect, useRef, useCallback, useState } from "react";

/* ── Shared IntersectionObserver context ── */

type RevealCallback = (entry: IntersectionObserverEntry) => void;

const RevealContext = createContext<{
  observe: (el: Element, cb: RevealCallback) => void;
  unobserve: (el: Element) => void;
} | null>(null);

export function RevealProvider({ children }: { children: React.ReactNode }) {
  const callbacksRef = useRef<Map<Element, RevealCallback>>(new Map());
  // Create observer eagerly (not inside useEffect) so it's ready for children
  const observerRef = useRef<IntersectionObserver | null>(null);

  if (typeof window !== "undefined" && !observerRef.current) {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const cb = callbacksRef.current.get(entry.target);
          if (cb) cb(entry);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
  }

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  const observe = useCallback((el: Element, cb: RevealCallback) => {
    callbacksRef.current.set(el, cb);
    observerRef.current?.observe(el);
  }, []);

  const unobserve = useCallback((el: Element) => {
    callbacksRef.current.delete(el);
    observerRef.current?.unobserve(el);
  }, []);

  return (
    <RevealContext.Provider value={{ observe, unobserve }}>
      {children}
    </RevealContext.Provider>
  );
}

export function RevealDiv({
  children,
  className = "",
  delay = "",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: string;
}) {
  const ctx = useContext(RevealContext);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !ctx) return;

    // Immediate check for elements already in viewport (back navigation, bfcache, etc.)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    ctx.observe(el, (entry) => {
      if (entry.isIntersecting) {
        setVisible(true);
        ctx.unobserve(el);
      }
    });

    return () => {
      ctx.unobserve(el);
    };
  }, [ctx]);

  return (
    <div
      ref={ref}
      className={`${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${delay} ${className}`}
    >
      {children}
    </div>
  );
}
