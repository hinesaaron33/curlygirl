"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const VOCAB = [
  { en: "community", es: "comunidad" },
  { en: "belong", es: "pertenecer" },
  { en: "introduce", es: "presentar" },
  { en: "share", es: "compartir" },
];

const FRAMES = ["My name is ___.", "I am from ___.", "I like to ___."];

const LOOP_MS = 7000;

export function LessonBuilderAnimation() {
  const reducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
  }, []);

  useEffect(() => {
    if (reducedMotion || !isDesktop) return;
    const id = setInterval(() => setCycle((c) => c + 1), LOOP_MS);
    return () => clearInterval(id);
  }, [reducedMotion, isDesktop]);

  if (reducedMotion || !isDesktop) {
    return <FinishedSlide />;
  }

  return (
    <div className="relative h-full w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={cycle}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 1, 0] }}
          transition={{ duration: LOOP_MS / 1000, times: [0, 0.06, 0.4, 0.93, 1], ease: "linear" }}
        >
          <Slide />
        </motion.div>
      </AnimatePresence>
      <Sparkles />
    </div>
  );
}

function Slide() {
  return (
    <motion.div
      className="relative h-full w-full overflow-hidden rounded-xl border border-ink/[0.08] bg-[#FAF7F0]"
      initial={{ boxShadow: "0 4px 12px rgba(26,58,74,0.06)" }}
      animate={{ boxShadow: "0 16px 40px rgba(26,58,74,0.16)" }}
      transition={{ duration: 1.4, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <Title />
      <Cards />
      <Frames />
      <ImagePlaceholder />
      <Checkmark />
    </motion.div>
  );
}

function Title() {
  return (
    <motion.div
      className="absolute top-5 left-6 right-6"
      initial={{ x: -24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-pink">
        Unit 02 · September
      </p>
      <h3 className="mt-1 font-[family-name:var(--font-playfair)] text-lg font-bold text-ink">
        All About Me
      </h3>
    </motion.div>
  );
}

function Cards() {
  return (
    <div className="absolute left-6 right-6 top-[5.25rem] grid grid-cols-2 gap-2.5">
      {VOCAB.map((v, i) => (
        <motion.div
          key={v.en}
          className="rounded-lg border border-ink/10 bg-white px-3 py-2 shadow-sm"
          initial={{ y: -36, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 1.2 + i * 0.08,
            type: "spring",
            stiffness: 320,
            damping: 18,
          }}
        >
          <p className="text-sm font-semibold text-ink">{v.en}</p>
          <p className="mt-0.5 text-[11px] italic text-teal-dark">{v.es}</p>
        </motion.div>
      ))}
    </div>
  );
}

function Frames() {
  return (
    <div className="absolute bottom-[5.5rem] left-6 right-6 space-y-1.5">
      {FRAMES.map((f, i) => (
        <motion.div
          key={f}
          className="overflow-hidden border-b border-dashed border-ink/20"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 2.3 + i * 0.5, duration: 0.45, ease: "easeOut" }}
        >
          <p className="whitespace-nowrap pb-1 text-[13px] text-ink/80">{f}</p>
        </motion.div>
      ))}
    </div>
  );
}

function ImagePlaceholder() {
  return (
    <motion.div
      className="absolute bottom-3 right-3 flex h-14 w-20 items-center justify-center rounded-md border-2 border-white bg-gradient-to-br from-base-light to-blush-light shadow-md"
      initial={{ scale: 0, rotate: -14, opacity: 0 }}
      animate={{ scale: 1, rotate: -6, opacity: 1 }}
      transition={{ delay: 4.0, type: "spring", stiffness: 220, damping: 13 }}
    >
      <svg className="h-6 w-6 text-white/85" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 19.5h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
      </svg>
    </motion.div>
  );
}

function Checkmark() {
  return (
    <motion.div
      className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink to-pink-dark shadow-lg shadow-pink/30"
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 4.5, type: "spring", stiffness: 260, damping: 11 }}
    >
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    </motion.div>
  );
}

function Sparkles() {
  const positions = [
    { top: "8%", left: "6%", dur: 3.2, delay: 0 },
    { top: "55%", right: "5%", dur: 4.1, delay: 1.4 },
    { bottom: "10%", left: "18%", dur: 3.6, delay: 2.6 },
  ];
  return (
    <>
      {positions.map((p, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute"
          style={p}
          initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.6, 1, 0.6],
            rotate: [0, 180, 360],
            y: [0, -10, 0],
          }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        >
          <svg className="h-4 w-4 text-gold-dark" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.5l1.6 6.9 6.9 1.6-6.9 1.6L12 19.5l-1.6-6.9L3.5 11l6.9-1.6Z" />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

function FinishedSlide() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 overflow-hidden rounded-xl border border-ink/[0.08] bg-[#FAF7F0] shadow-md">
        <div className="absolute left-6 right-6 top-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-pink">Unit 02 · September</p>
          <h3 className="mt-1 font-[family-name:var(--font-playfair)] text-lg font-bold text-ink">All About Me</h3>
        </div>
        <div className="absolute left-6 right-6 top-[5.25rem] grid grid-cols-2 gap-2.5">
          {VOCAB.map((v) => (
            <div key={v.en} className="rounded-lg border border-ink/10 bg-white px-3 py-2 shadow-sm">
              <p className="text-sm font-semibold text-ink">{v.en}</p>
              <p className="mt-0.5 text-[11px] italic text-teal-dark">{v.es}</p>
            </div>
          ))}
        </div>
        <div className="absolute bottom-[5.5rem] left-6 right-6 space-y-1.5">
          {FRAMES.map((f) => (
            <p key={f} className="border-b border-dashed border-ink/20 pb-1 text-[13px] text-ink/80">{f}</p>
          ))}
        </div>
        <div className="absolute bottom-3 right-3 flex h-14 w-20 -rotate-6 items-center justify-center rounded-md border-2 border-white bg-gradient-to-br from-base-light to-blush-light shadow-md">
          <svg className="h-6 w-6 text-white/85" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 19.5h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
          </svg>
        </div>
        <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink to-pink-dark shadow-lg shadow-pink/30">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
