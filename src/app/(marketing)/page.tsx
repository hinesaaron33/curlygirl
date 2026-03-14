"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

/* ── Marquee topics ── */
const topics = [
  "Narrative Writing", "Academic Vocabulary", "Reading Comprehension",
  "Speaking & Listening", "Grammar in Context", "Text Structures",
  "Argumentative Writing", "Poetry & Figurative Language", "Close Reading",
  "Collaborative Discussions", "Research Skills", "Media Literacy",
];

/* ── Features ── */
const features = [
  {
    title: "Save Hours Every Week",
    description: "Stop spending evenings and weekends creating lesson plans from scratch. Our library is ready to go.",
    iconColor: "bg-teal/20 text-teal-dark",
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
  },
  {
    title: "Standards-Aligned",
    description: "Every plan is aligned to WIDA and state ELD frameworks, so you can teach with confidence and compliance.",
    iconColor: "bg-pink/15 text-pink",
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>,
  },
  {
    title: "Fully Customizable",
    description: "Every plan can be tailored to your students' proficiency levels, interests, and classroom context.",
    iconColor: "bg-blush/30 text-pink-dark",
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>,
  },
  {
    title: "Differentiated for ELLs",
    description: "Built-in scaffolding and differentiation for emerging, developing, and bridging proficiency levels.",
    iconColor: "bg-gold/20 text-gold-dark",
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>,
  },
  {
    title: "Print-Ready PDFs",
    description: "Download polished, professionally formatted PDFs ready for your classroom with a single click.",
    iconColor: "bg-teal/20 text-teal-dark",
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>,
  },
  {
    title: "Expert-Created",
    description: "Every plan is designed by experienced middle school ELD educators who know what works in real classrooms.",
    iconColor: "bg-pink/15 text-pink",
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>,
  },
];

/* ── Steps ── */
const steps = [
  { num: "1", title: "Browse Our Library", desc: "Explore 500+ lesson plans organized by topic, grade level, and ELD proficiency standard." },
  { num: "2", title: "Customize for Your Students", desc: "Use our built-in editor to tailor activities, vocabulary, and scaffolding to your students' needs." },
  { num: "3", title: "Download & Print", desc: "Export clean, print-ready PDFs formatted beautifully for your classroom — one click and you're done." },
];

/* ── Testimonials ── */
const testimonials = [
  { quote: "Curly Girl ELD has completely transformed my planning. I used to spend my entire Sunday prepping. Now I spend 20 minutes customizing and I'm done.", name: "Maria G.", role: "7th Grade ELD, California", color: "bg-blush" },
  { quote: "The differentiation built into every lesson is incredible. My newcomer students and my bridging students can both access the same content.", name: "James T.", role: "8th Grade ELD, Texas", color: "bg-teal" },
  { quote: "I recommended Curly Girl to my entire department. We all use it now and our ELD block has never been more consistent or effective.", name: "Sandra L.", role: "6th Grade ELD, Arizona", color: "bg-gold" },
];

/* ── Pricing ── */
const pricingTiers = [
  {
    name: "Free",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    period: "",
    description: "Explore what Curly Girl ELD has to offer.",
    features: ["Browse lesson plan previews", "1 PDF download per month", "Community access", "Email support"],
    highlighted: false,
  },
  {
    name: "Starter",
    monthlyPrice: "$14.99",
    yearlyPrice: "$9.99",
    period: "/mo",
    description: "Perfect for individual teachers getting started.",
    features: ["Core lesson plan library", "Basic customization tools", "5 PDF downloads per month", "Email support"],
    highlighted: false,
  },
  {
    name: "Professional",
    monthlyPrice: "$24.99",
    yearlyPrice: "$19.99",
    period: "/mo",
    description: "For educators who want the full toolkit.",
    features: ["Full lesson plan library", "Advanced editor & customization", "Unlimited PDF downloads", "Priority support", "New plans added monthly", "Collaboration tools"],
    highlighted: true,
  },
];

/* ── Scroll reveal hook ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("opacity-100", "translate-y-0"); },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealDiv({ children, className = "", delay = "" }: { children: React.ReactNode; className?: string; delay?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`opacity-0 translate-y-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${delay} ${className}`}>
      {children}
    </div>
  );
}

/* ── Star icon ── */
function Star() {
  return (
    <svg className="h-3.5 w-3.5 text-gold-dark" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

/* ── Product slides for monitor mockup ── */
const heroSlides = [
  { src: "/hero/slide-1.jpg", alt: "Year 1 Secondary Newcomer/SLIFE Thematic Units" },
  { src: "/hero/slide-2.jpg", alt: "What's Inside This Bundle?" },
  { src: "/hero/slide-3.jpg", alt: "Scope & Sequence — Year-Long Curriculum" },
  { src: "/hero/slide-4.jpg", alt: "Google Slides for Each Unit" },
  { src: "/hero/slide-5.jpg", alt: "Student Workbooks" },
];

/* ── iMac Monitor Mockup ── */
function LaptopMockup() {
  const [activeSlide, setActiveSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoAdvance = useCallback(() => {
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

  useEffect(() => {
    startAutoAdvance();
    return stopAutoAdvance;
  }, [startAutoAdvance, stopAutoAdvance]);

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      {/* Monitor body */}
      <div className="rounded-2xl border-[3px] border-[#2a2a2e] bg-gradient-to-b from-[#2a2a2e] to-[#1d1d20] p-2.5 shadow-2xl">
        {/* Screen bezel */}
        <div className="rounded-xl bg-black p-[2px]">
          {/* Screen */}
          <div
            className="relative h-72 overflow-hidden rounded-[10px] bg-[#e8e8e8] sm:h-80 lg:h-[22rem]"
            onMouseEnter={stopAutoAdvance}
            onMouseLeave={startAutoAdvance}
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

            {/* Fade slideshow */}
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
                        sizes="(max-width: 768px) 400px, 500px"
                        quality={75}
                        {...(i === 0 ? { priority: true, loading: "eager" as const } : { loading: "lazy" as const })}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Dot indicators */}
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

/* ── StatCard with scroll-triggered bounce + optional counter ── */
function StatCard({ value, label, countTo, delay = 0, bounce = false, href, hoverLabel }: { value?: React.ReactNode; label: string; countTo?: number; delay?: number; bounce?: boolean; href?: string; hoverLabel?: string }) {
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
  }, [animate, delay, bounce, countTo]);

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

export default function HomePage() {
  const [yearly, setYearly] = useState(true);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-base-light via-base to-base-dark">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-pink/[0.08] blur-[120px]" />
          <div className="absolute -right-20 top-1/3 h-[400px] w-[400px] rounded-full bg-white/20 blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-blush/[0.15] blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-36 pb-20 sm:px-6 sm:pt-44 sm:pb-28 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 xl:gap-20">
            {/* Left column — text, CTAs, trust row */}
            <div>
              <div className="animate-fade-in-up mb-8 h-1 w-16 rounded-full bg-gradient-to-r from-pink to-blush" />

              <p className="animate-fade-in-up delay-100 mb-6 text-[15px] font-semibold tracking-[0.2em] text-teal-dark uppercase">
                Lesson Plans For Multilingual Learners
              </p>

              <h1 className="animate-fade-in-up delay-200 max-w-3xl font-[family-name:var(--font-playfair)] text-5xl font-bold leading-[1.1] tracking-tight text-ink sm:text-6xl lg:text-5xl xl:text-6xl">
                We make lesson planning
                <br />
                <em>
                  {"effortless.".split("").map((char, i) => (
                    <span
                      key={i}
                      className="animate-bounce-letter"
                      style={{ animationDelay: `${0.5 + i * 0.08}s` }}
                    >
                      {char}
                    </span>
                  ))}
                </em>
              </h1>

              <p className="animate-fade-in-up delay-300 mt-8 max-w-xl text-lg leading-relaxed text-slate">
                Expert-crafted, standards-aligned ELD lesson plans designed by experienced middle school educators. Customize them for your classroom and save hours every week.
              </p>

              <div className="animate-fade-in-up delay-400 mt-10 flex flex-wrap items-center gap-4">
                <Link href="/#pricing" className="group inline-flex items-center gap-2 rounded-full bg-pink px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-pink/25 ring-2 ring-transparent transition-all duration-300 hover:bg-pink-dark hover:shadow-2xl hover:shadow-pink/40 hover:-translate-y-1 hover:scale-105 hover:ring-gold">
                  GET STARTED
                  <span className="relative h-5 w-5">
                    <svg className="absolute inset-0 h-5 w-5 transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
                    <svg className="absolute inset-0 h-5 w-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </span>
                </Link>
                <Link href="#features" className="group inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-white/30 px-8 py-3.5 text-base font-semibold text-ink/70 backdrop-blur-sm transition-all duration-300 hover:border-gold hover:bg-white/50 hover:text-ink hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-gold/20">
                  Shop Lessons
                  <span className="relative h-5 w-5">
                    <svg className="absolute inset-0 h-5 w-5 transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                    <svg className="absolute inset-0 h-5 w-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </span>
                </Link>
              </div>

              {/* Trust row */}
              <div className="animate-fade-in-up delay-500 mt-14 flex flex-wrap items-center gap-6">
                <div className="flex -space-x-2.5">
                  <div className="h-9 w-9 rounded-full border-2 border-white bg-teal shadow-md" />
                  <div className="h-9 w-9 rounded-full border-2 border-white bg-pink shadow-md" />
                  <div className="h-9 w-9 rounded-full border-2 border-white bg-gold shadow-md" />
                  <div className="h-9 w-9 rounded-full border-2 border-white bg-blush shadow-md" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink/80">Trusted by 1250+ Educators</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} />)}</div>
                    <span className="text-xs text-ink/40">4.9/5 average rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column — laptop mockup + counter */}
            <div className="relative mt-16 lg:mt-0">
              <div className="animate-fade-in-up delay-500">
                <LaptopMockup />
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-ink/[0.08]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-4 px-4 py-8 sm:px-6 lg:px-8">
            <StatCard countTo={700} label="Reviews" delay={1000} bounce href="#testimonials" hoverLabel="READ REVIEWS" />
            <StatCard value={<>225<span className="text-4xl font-bold align-middle">+</span></>} label="Lesson Plans" />
            <StatCard countTo={1250} label="Educators Served" delay={2000} bounce />
            <StatCard value="50" label="States Represented" />
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <section className="overflow-hidden border-b border-ink/[0.06] bg-base-dark/50 py-6">
        <div className="flex whitespace-nowrap">
          <div className="animate-marquee flex items-center gap-10 pr-10">
            {[...topics, ...topics].map((t, i) => (
              <span key={i} className="flex items-center gap-10">
                <span className="text-sm font-medium text-ink/25">{t}</span>
                <span className="text-pink/40">&#9671;</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="relative overflow-hidden bg-base py-28 sm:py-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-20 right-[10%] h-[300px] w-[300px] rounded-full bg-white/15 blur-[100px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <RevealDiv><p className="text-lg font-semibold tracking-[0.2em] text-pink uppercase">Our Story</p></RevealDiv>
            <RevealDiv delay="delay-100">
              <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight tracking-tight text-slate sm:text-4xl lg:text-[2.75rem]">
                Born from 15 Years of<br />&quot;There&apos;s Nothing Out There for My Students&quot;
              </h2>
              <p className="mt-6 text-base leading-relaxed text-slate">
                Here&apos;s the truth about ELD teaching: you get handed a roster of newcomers from 12 different countries, zero curriculum, and a &quot;good luck.&quot; I know because I lived it for 15 years. Curly Girl ELD exists so no teacher has to build their entire program from a blank Google Doc ever again. Every unit is thematic, standards aligned, and built from what actually works with secondary multilingual learners, not what looks good in a textbook.
              </p>
              <div className="mt-8">
                <Link href="/#pricing" className="group inline-flex items-center gap-2 rounded-full bg-pink px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink/25 ring-2 ring-transparent transition-all duration-300 hover:bg-pink-dark hover:shadow-2xl hover:shadow-pink/40 hover:-translate-y-1 hover:scale-105 hover:ring-gold">
                  GET STARTED
                  <span className="relative h-4 w-4">
                    <svg className="absolute inset-0 h-4 w-4 transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
                    <svg className="absolute inset-0 h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </span>
                </Link>
              </div>
            </RevealDiv>
            <RevealDiv delay="delay-300">
              <ul className="mt-10 space-y-4">
                {["New plans added every month", "Created by certified ELD specialists", "Aligned to WIDA and state ELD standards", "Tested in real middle school classrooms"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink">
                      <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <span className="text-sm text-slate">{item}</span>
                  </li>
                ))}
              </ul>
            </RevealDiv>
          </div>

          {/* Lesson card preview */}
          <RevealDiv delay="delay-200">
            <div className="rounded-2xl border border-white/40 bg-white/30 p-8 shadow-xl shadow-ink/[0.06] backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-teal" />
                <span className="text-xs font-semibold tracking-wider text-teal-dark uppercase">Sample Lesson Plan</span>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl border border-ink/[0.06] bg-white/60 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-pink/15 px-2.5 py-0.5 text-[11px] font-semibold text-pink-dark">Writing</span>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <svg key={i} className="h-3 w-3 text-gold-dark" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                  </div>
                  <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-lg font-semibold text-ink">Narrative Writing for ELLs</h3>
                  <p className="mt-1 text-xs text-ink/40">Grade 6–8 &bull; 45 min &bull; ELD Standards Aligned</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Vocabulary scaffolding", "Story structure", "Peer review"].map(tag => (
                      <span key={tag} className="rounded-md bg-base/40 px-2 py-0.5 text-[11px] text-ink/50">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-ink/[0.06] bg-white/40 p-5 opacity-60 shadow-sm">
                  <span className="rounded-full bg-teal/15 px-2.5 py-0.5 text-[11px] font-semibold text-teal-dark">Vocabulary</span>
                  <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-base font-semibold text-ink/80">Science Vocabulary Building</h3>
                  <p className="mt-1 text-xs text-ink/30">Grade 7 &bull; 30 min</p>
                </div>
                <div className="rounded-xl border border-ink/[0.06] bg-white/30 p-5 opacity-35 shadow-sm">
                  <span className="rounded-full bg-blush/30 px-2.5 py-0.5 text-[11px] font-semibold text-pink-dark">Reading</span>
                  <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-base font-semibold text-ink/60">Reading Comprehension Strategies</h3>
                  <p className="mt-1 text-xs text-ink/20">Grade 6–8 &bull; 50 min</p>
                </div>
              </div>
            </div>
          </RevealDiv>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="relative overflow-hidden bg-base-dark py-28 sm:py-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-20 left-[20%] h-[350px] w-[350px] rounded-full bg-pink/[0.06] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealDiv><p className="text-[13px] font-semibold tracking-[0.2em] text-teal-dark uppercase">Features</p></RevealDiv>
          <RevealDiv delay="delay-100">
            <h2 className="mt-4 max-w-xl font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Everything you need to teach ELD with confidence
            </h2>
          </RevealDiv>
          <RevealDiv delay="delay-200">
            <p className="mt-4 max-w-xl text-base text-ink/50">
              From ready-made plans to instant downloads, we handle the prep so you can focus on your students.
            </p>
          </RevealDiv>

          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <RevealDiv key={f.title} delay={`delay-${(i + 1) * 100}`}>
                <div className="h-full rounded-2xl border border-white/40 bg-white/30 p-7 shadow-sm backdrop-blur-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-pink/[0.08]">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.iconColor}`}>{f.icon}</div>
                  <h3 className="mt-5 text-base font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/45">{f.description}</p>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="relative overflow-hidden bg-base py-28 sm:py-36">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <RevealDiv><p className="text-[13px] font-semibold tracking-[0.2em] text-pink uppercase">How It Works</p></RevealDiv>
            <RevealDiv delay="delay-100">
              <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Four simple steps to better lessons
              </h2>
            </RevealDiv>
          </div>

          <div className="mx-auto mt-20 max-w-2xl">
            {steps.map((step, i) => (
              <RevealDiv key={step.num} delay={`delay-${(i + 1) * 100}`}>
                <div className="relative flex gap-8">
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-teal bg-white/40 font-[family-name:var(--font-playfair)] text-lg font-bold text-teal-dark">{step.num}</div>
                    <div className="mt-2 h-full w-px bg-gradient-to-b from-teal/40 to-transparent" />
                  </div>
                  <div className="pb-16">
                    <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
                    <p className="mt-2 text-sm text-ink/50">{step.desc}</p>
                  </div>
                </div>
              </RevealDiv>
            ))}
            {/* Step 4 — accent */}
            <RevealDiv delay="delay-400">
              <div className="relative flex gap-8">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-pink bg-pink/10 font-[family-name:var(--font-playfair)] text-lg font-bold text-pink">4</div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-pink">Teach with Confidence</h3>
                  <p className="mt-2 text-sm text-ink/50">Walk into your classroom prepared, knowing your lesson is standards-aligned, differentiated, and engaging.</p>
                </div>
              </div>
            </RevealDiv>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="relative overflow-hidden bg-base-dark pt-2 pb-28 sm:pt-3 sm:pb-36 scroll-mt-[72px]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-10 right-[15%] h-[300px] w-[300px] rounded-full bg-blush/[0.1] blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <RevealDiv>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-ink sm:text-4xl">Choose your plan</h2>
            </RevealDiv>
            <RevealDiv delay="delay-200">
              <p className="mx-auto mt-4 max-w-md text-base text-ink/50">Start free and explore. Upgrade anytime to unlock the full library.</p>

              {/* Monthly / Yearly toggle */}
              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/30 p-1 backdrop-blur-sm">
                <button
                  onClick={() => setYearly(false)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${!yearly ? "bg-pink text-white shadow-md" : "text-ink/50 hover:text-ink"}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setYearly(true)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${yearly ? "bg-pink text-white shadow-md" : "text-ink/50 hover:text-ink"}`}
                >
                  Yearly
                  <span className="ml-1.5 rounded-full bg-gold/80 px-2 py-0.5 text-[10px] font-bold text-ink">SAVE 33%</span>
                </button>
              </div>
            </RevealDiv>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pricingTiers.map((tier, i) => (
              <RevealDiv key={tier.name} delay={`delay-${(i + 1) * 100}`}>
                <div className={`group relative flex h-full flex-col rounded-2xl border bg-white/30 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink/15 ${tier.highlighted ? "border-pink/30 ring-4 ring-pink/10 hover:border-pink hover:ring-pink/30" : "border-white/40 hover:border-pink hover:ring-4 hover:ring-pink/15"}`}>
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-pink px-6 py-1.5 text-xs font-bold tracking-wider text-white uppercase shadow-lg shadow-pink/25 transition-all duration-300 group-hover:bg-white group-hover:text-pink group-hover:shadow-white/25">Most Popular</span>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-ink text-center">{tier.name}</h3>
                  <p className="mt-1 text-sm text-slate text-center">{tier.description}</p>
                  <div className="mt-6 flex items-baseline justify-center gap-1">
                    <span className="font-[family-name:var(--font-playfair)] text-5xl font-bold text-ink">{yearly ? tier.yearlyPrice : tier.monthlyPrice}</span>
                    {tier.period && <span className="text-lg text-ink/75">{tier.period}</span>}
                  </div>
                  {yearly && tier.yearlyPrice !== "$0" && (
                    <div className="mt-3 text-center">
                      <span className="inline-block rounded-full bg-gold/80 px-4 py-1 text-xs font-bold tracking-wide text-ink uppercase">Billed Annually</span>
                    </div>
                  )}
                  <ul className="mt-8 flex-1 space-y-3">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-ink/60">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-dark" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link href="/signup" className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all ${tier.highlighted ? "bg-pink text-white shadow-lg shadow-pink/25 group-hover:bg-white group-hover:text-pink group-hover:border-2 group-hover:border-pink group-hover:shadow-xl group-hover:-translate-y-0.5" : "border-2 border-ink/15 bg-white/40 text-ink/70 group-hover:border-pink group-hover:bg-pink group-hover:text-white group-hover:shadow-lg group-hover:shadow-pink/25"}`}>
                      GET STARTED
                      <span className="relative h-4 w-4">
                        <svg className="absolute inset-0 h-4 w-4 transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
                        <svg className="absolute inset-0 h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                      </span>
                    </Link>
                  </div>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonials" className="relative overflow-hidden bg-base py-28 sm:py-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <RevealDiv><p className="text-[13px] font-semibold tracking-[0.2em] text-gold-dark uppercase">Testimonials</p></RevealDiv>
            <RevealDiv delay="delay-100">
              <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-ink sm:text-4xl">Loved by educators everywhere</h2>
            </RevealDiv>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <RevealDiv key={t.name} delay={`delay-${(i + 1) * 100}`}>
                <div className="h-full rounded-2xl border border-white/40 bg-white/30 p-7 shadow-sm backdrop-blur-sm">
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(j => <Star key={j} />)}</div>
                  <p className="mt-5 text-sm leading-relaxed text-ink/55 italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-full ${t.color} shadow-sm`} />
                    <div>
                      <p className="text-sm font-semibold text-ink/80">{t.name}</p>
                      <p className="text-xs text-ink/35">{t.role}</p>
                    </div>
                  </div>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ JOIN CTA ═══ */}
      <section className="relative overflow-hidden bg-base-dark py-28 sm:py-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink/[0.08] blur-[150px]" />
        </div>
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <div className="animate-float mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink font-[family-name:var(--font-playfair)] text-xl font-bold text-white shadow-2xl shadow-pink/30">
            CG
          </div>
          <RevealDiv>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Ready to transform your<br />ELD classroom?
            </h2>
          </RevealDiv>
          <RevealDiv delay="delay-100">
            <p className="mx-auto mt-4 max-w-md text-base text-ink/50">
              Join 500+ educators who are saving hours every week. Start free today.
            </p>
          </RevealDiv>
          <RevealDiv delay="delay-200">
            <div className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
              <input type="email" placeholder="Enter your email" className="flex-1 rounded-xl border border-ink/10 bg-white/40 px-5 py-3.5 text-sm text-ink placeholder:text-ink/30 backdrop-blur-sm transition-colors focus:border-pink/50 focus:outline-none focus:ring-2 focus:ring-pink/20" />
              <Link href="/signup" className="rounded-xl bg-pink px-8 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-pink/25 transition-all hover:bg-pink-dark hover:shadow-xl hover:-translate-y-0.5">
                GET STARTED
              </Link>
            </div>
          </RevealDiv>
          <RevealDiv delay="delay-300">
            <p className="mt-4 text-xs text-ink/30">No credit card required. Cancel anytime.</p>
          </RevealDiv>
        </div>
      </section>
    </>
  );
}
