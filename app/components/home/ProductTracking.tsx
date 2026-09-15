"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GOLD } from "./theme";

type CaseStudy = {
  n: number;
  category: string;
  problem: string;
  solution: string;
  image: string;
  ratio: number;
  client: string;
  location: string;
  detail: string;
};

const CASES: CaseStudy[] = [
  {
    n: 1,
    category: "Manufacturing",
    problem: "Manual data tracking provides no insights. Also paper slips are often lost.",
    solution: "A robust tracking module, with KPIs at a glance.",
    image: "/case-manufacturing.png",
    ratio: 726 / 422,
    client: "Shemkein (MK Industries)",
    location: "Bathinda, PB",
    detail:
      "A cooler motor manufacturing company was tracking their product replacements in an un-systemized way on paper slips, that frequently got lost. We built a Custom Web App - mobile first, easy to use. Now the staff makes the entries, owner can see KPI’s and make smarter decisions to optimize processes.",
  },
  {
    n: 2,
    category: "QSR - Services",
    problem: "Cafe staff works fine when owner’s present - in his absence SOPs failed, no reporting.",
    solution: "Pay-roll connected Task reporting system gives control on staff.",
    image: "/case-qsr.png",
    ratio: 722 / 440,
    client: "BREAD & SIPPP Cafe",
    location: "Kamla Nagar, New Delhi",
    detail:
      "A cafe owner had assigned tasks and SOPs to staff, which usually worked smoothly, but in owner’s absence, failed. This reporting layer captures shift-wise tasks with image proofs, and daily percentage of work reflects in payroll. Ensures that work goes on, even when you are not there.",
  },
  {
    n: 3,
    category: "Retail Services",
    problem: "Handled 700+ daily milk delivery on paper, took 4hr daily, still manual errors exist.",
    solution: "Everything tracked clearly, without errors and extra time.",
    image: "/case-retail.png",
    ratio: 722 / 376,
    client: "Rajlok Dairy",
    location: "Kamla Nagar, New Delhi",
    // TODO(rahul): replace with the real Rajlok Dairy write-up. Placeholder derived from the dashboard shown.
    detail:
      "A dairy handling 700+ milk deliveries a day was running everything on paper - about 4 hours daily, and still prone to manual errors. We built a Daily Operations Dashboard that tracks sales, collections, stock movement and profit in one close-day view - so the day reconciles automatically, without errors or extra time.",
  },
];

// How long each card stays up before auto-advancing to the next one.
const AUTO_ADVANCE_MS = 4000;

export default function ProductTracking() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [autoTick, setAutoTick] = useState(0); // bumped on manual nav to restart the timer
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const c = CASES[active];

  const goTo = (i: number) => {
    setActive((i + CASES.length) % CASES.length);
    setExpanded(false);
    setAutoTick((t) => t + 1); // manual navigation gets a fresh full interval
  };

  // Only auto-play while the carousel is on screen, so it's already moving
  // by the time a scrolling user reaches it (and doesn't run in the background).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-advance to the next case study. Paused while off-screen, while a
  // card is expanded (someone's reading), or while the zoom lightbox is open.
  useEffect(() => {
    if (!isVisible || expanded || zoomSrc) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % CASES.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [isVisible, expanded, zoomSrc, autoTick]);

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
    // Only treat as a swipe when it's mostly horizontal and long enough.
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
    goTo(dx < 0 ? active + 1 : active - 1);
  };

  return (
    <section ref={sectionRef} className="bg-white py-16 md:py-24 px-5">
      <div className="max-w-[640px] mx-auto">
        <div
          className="rounded-[28px] overflow-hidden shadow-sm select-none"
          style={{ touchAction: "pan-y" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Problem — black */}
          <div className="bg-[#0E0E0E] text-white px-6 md:px-9 pt-7 pb-9">
            <span className="w-11 h-11 rounded-full bg-white text-[#0E0E0E] flex items-center justify-center font-bold text-lg">
              {c.n}
            </span>
            <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/40">
              {c.category}
            </div>
            <h3 className="mt-3 text-[30px] md:text-[34px] font-medium leading-[1.14]">{c.problem}</h3>
          </div>

          {/* Solution — cream */}
          <div className="px-6 md:px-9 pt-8 pb-7" style={{ backgroundColor: "#FBF6EA" }}>
            <h3 className="text-[30px] md:text-[34px] font-medium leading-[1.14] text-[#0E0E0E]">{c.solution}</h3>

            <div
              className="relative w-full rounded-2xl overflow-hidden border border-black/10 mt-7 bg-white"
              style={{ aspectRatio: c.ratio }}
            >
              <Image src={c.image} alt={`${c.client} dashboard`} fill sizes="(max-width:640px) 90vw, 600px" className="object-cover object-top" />
            </div>

            {expanded && (
              <div className="mt-7">
                <div className="text-[15px] text-[#0E0E0E]/60">Client:</div>
                <div className="mt-1 text-2xl font-bold text-[#0E0E0E] leading-tight">{c.client}</div>
                <div className="text-[15px] text-[#0E0E0E]/55">{c.location}</div>
                <p className="mt-5 text-[15px] leading-relaxed text-justify text-[#0E0E0E]/80">{c.detail}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex-1 rounded-full py-4 font-medium text-lg bg-[#0E0E0E] text-white hover:opacity-90 active:scale-95 transition-all"
              >
                {expanded ? "Show Less" : "See Details"}
              </button>
              <button
                onClick={() => setZoomSrc(c.image)}
                className="flex-1 rounded-full py-4 font-medium text-lg text-[#0E0E0E] hover:opacity-90 active:scale-95 transition-all"
                style={{ backgroundColor: GOLD }}
              >
                Zoom Image
              </button>
            </div>
          </div>
        </div>

        {/* Dots */}
        {CASES.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {CASES.map((cs, i) => (
              <button
                key={cs.n}
                onClick={() => goTo(i)}
                aria-label={`Show case study ${i + 1}`}
                className="w-2.5 h-2.5 rounded-full transition-colors"
                style={{ backgroundColor: i === active ? GOLD : "rgba(14,14,14,0.2)" }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Zoom lightbox */}
      {zoomSrc && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setZoomSrc(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-[1100px] w-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={zoomSrc} alt="Dashboard preview" className="w-full h-auto max-h-[88vh] object-contain rounded-xl" />
            <button
              onClick={() => setZoomSrc(null)}
              aria-label="Close"
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white text-[#0E0E0E] text-xl font-bold flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
