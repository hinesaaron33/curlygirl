"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

const heroSlides = [
  { src: "/hero/slide-1.jpg", alt: "Year 1 Secondary Newcomer/SLIFE Thematic Units" },
  { src: "/hero/slide-2.jpg", alt: "What's Inside This Bundle?" },
  { src: "/hero/slide-3.jpg", alt: "Scope & Sequence — Year-Long Curriculum" },
  { src: "/hero/slide-4.jpg", alt: "Google Slides for Each Unit" },
  { src: "/hero/slide-5.jpg", alt: "Student Workbooks" },
];

export function LaptopMockup() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);

  // Detect desktop on mount — default is mobile (static image, no slideshow)
  useEffect(() => {
    if (window.innerWidth >= 1024) setIsMobile(false);
  }, []);

  const startAutoAdvance = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
  }, []);

  const stopAutoAdvance = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Only autoplay when visible in viewport and not mobile
  useEffect(() => {
    if (isMobile) return;

    const el = containerRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          startAutoAdvance();
        } else {
          stopAutoAdvance();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);

    return () => {
      obs.disconnect();
      stopAutoAdvance();
    };
  }, [startAutoAdvance, stopAutoAdvance, isMobile]);

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-md lg:max-w-none">
      {/* Monitor body */}
      <div className="rounded-2xl border-[3px] border-[#2a2a2e] bg-gradient-to-b from-[#2a2a2e] to-[#1d1d20] p-2.5 shadow-2xl">
        {/* Screen bezel */}
        <div className="rounded-xl bg-black p-[2px]">
          {/* Screen */}
          <div
            className="relative h-72 overflow-hidden rounded-[10px] bg-[#e8e8e8] sm:h-80 lg:h-[22rem]"
            onMouseEnter={stopAutoAdvance}
            onMouseLeave={() => {
              if (isVisibleRef.current) startAutoAdvance();
            }}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-ink/10 bg-white/80 px-3 py-1.5">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="ml-2 flex-1 rounded-md bg-ink/[0.06] px-3 py-0.5 text-center text-[10px] text-ink/30">
                curlygirleld.com
              </div>
            </div>

            {isMobile ? (
              /* Static image on mobile */
              <div className="absolute inset-0 top-8">
                <Image
                  src={heroSlides[0].src}
                  alt={heroSlides[0].alt}
                  fill
                  className="object-cover"
                  sizes="400px"
                  quality={75}
                  priority
                  loading="eager"
                />
              </div>
            ) : (
              <>
                {/* Fade slideshow on desktop */}
                <div className="absolute inset-0 top-8">
                  {heroSlides.map((slide, i) => {
                    const isNearby = i === activeSlide || i === (activeSlide + 1) % heroSlides.length || i === (activeSlide - 1 + heroSlides.length) % heroSlides.length;
                    return (
                      <div
                        key={i}
                        className={`absolute inset-0 transition-opacity duration-700 ${i === activeSlide ? "opacity-100" : "opacity-0"}`}
                      >
                        {isNearby && (
                          <Image
                            src={slide.src}
                            alt={slide.alt}
                            fill
                            className="object-cover"
                            sizes="500px"
                            quality={75}
                            {...(i === 0 ? { priority: true, loading: "eager" as const } : { loading: "lazy" as const })}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Dot indicators — desktop only */}
                <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${i === activeSlide ? "bg-pink scale-125" : "bg-ink/20 hover:bg-ink/40"}`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chin with logo */}
        <div className="flex items-center justify-center py-2">
          <div className="h-3 w-3 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Stand neck */}
      <div className="mx-auto h-16 w-[18%] bg-gradient-to-b from-[#c0c0c4] via-[#d4d4d8] to-[#bbbbbe] shadow-[inset_2px_0_4px_rgba(0,0,0,0.08),inset_-2px_0_4px_rgba(0,0,0,0.08)]" />

      {/* Stand base — oval foot */}
      <div className="mx-auto h-3 w-[45%] rounded-[50%] bg-gradient-to-b from-[#c8c8cc] to-[#b0b0b4] shadow-[0_2px_8px_rgba(0,0,0,0.12)]" />

      {/* Shadow underneath */}
      <div className="mx-auto mt-0.5 h-2 w-[40%] rounded-full bg-ink/[0.08] blur-md" />
    </div>
  );
}
