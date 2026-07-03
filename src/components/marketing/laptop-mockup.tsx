"use client";

import MonitorShowcase from "./monitor-showcase";

export function LaptopMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      {/* Monitor body */}
      <div className="rounded-2xl border-[3px] border-[#2a2a2e] bg-gradient-to-b from-[#2a2a2e] to-[#1d1d20] p-2.5 shadow-2xl">
        {/* Screen bezel */}
        <div className="rounded-xl bg-black p-[2px]">
          {/* Screen */}
          <div className="relative overflow-hidden rounded-[10px] bg-[#FBF7F2]">
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

            {/* Animated product showcase (sizes itself to the frames' 1280:800 ratio) */}
            <MonitorShowcase />
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
