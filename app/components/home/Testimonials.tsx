"use client";

import { useEffect, useRef, useState } from "react";
import { GOLD } from "./theme";

export type Review = {
  name: string;
  role: string;
  text: string;
  rating?: number;
};

// How long each testimonial stays up before auto-advancing to the next one.
const AUTO_ADVANCE_MS = 2000;

// Neutral pastel backgrounds cycled per reviewer, paired with a generic
// person-silhouette icon (not a real photo) so each testimonial reads
// distinctly without needing individual customer headshots.
const AVATAR_PALETTE = ["#F4E3C1", "#DCEBE3", "#E6DCF2", "#F2DCE0", "#DCE6F2"];

function Avatar({ index }: { index: number }) {
  const bg = AVATAR_PALETTE[index % AVATAR_PALETTE.length];
  return (
    <span
      className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center"
      style={{ backgroundColor: bg }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="4" fill="#0E0E0E" fillOpacity="0.5" />
        <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#0E0E0E" fillOpacity="0.5" />
      </svg>
    </span>
  );
}

export default function Testimonials({ reviews }: { reviews: Review[] }) {
  const [active, setActive] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [autoTick, setAutoTick] = useState(0); // bumped on manual nav to restart the timer
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const r = reviews[active] ?? reviews[0];

  const swipe = (dir: number) => {
    setActive((a) => (a + dir + reviews.length) % reviews.length);
    setAutoTick((t) => t + 1);
  };

  const goTo = (i: number) => {
    setActive(i);
    setAutoTick((t) => t + 1);
  };

  // Only auto-play while the testimonials are on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reviews.length <= 1) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [reviews.length]);

  // Auto-advance to the next testimonial while visible.
  useEffect(() => {
    if (!isVisible || reviews.length <= 1) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % reviews.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [isVisible, autoTick, reviews.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
    swipe(dx < 0 ? 1 : -1);
  };

  return (
    <section ref={sectionRef} className="bg-white py-16 md:py-24 px-5">
      <div className="max-w-[640px] mx-auto">
        <h2 className="text-4xl font-bold text-center tracking-tight text-[#0E0E0E]">Testimonials</h2>

        <div
          className="mt-10 rounded-[20px] border border-black/10 bg-white p-6 md:p-7 shadow-sm select-none"
          style={{ touchAction: "pan-y" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex items-center gap-4">
            <Avatar index={active} />
            <div>
              <div className="text-lg font-bold text-[#0E0E0E] leading-tight">{r.name}</div>
              <div className="mt-0.5 text-[13px] font-medium text-[#0E0E0E]/45">{r.role}</div>
            </div>
          </div>
          <p className="mt-5 text-[14px] leading-relaxed text-justify text-[#0E0E0E]/65">{r.text}</p>
        </div>

        {reviews.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {reviews.map((rev, i) => (
              <button
                key={`${rev.name}-${i}`}
                onClick={() => goTo(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className="w-2 h-2 rounded-full transition-colors"
                style={{ backgroundColor: i === active ? GOLD : "rgba(14,14,14,0.2)" }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
