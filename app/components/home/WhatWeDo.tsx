"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GOLD } from "./theme";

const STATEMENT =
  "You can NOT build a 1000Cr business on a broken foundation. We solidify that foundation by building the first 3 layers for your business - so you can finally operate at the top";

export default function WhatWeDo() {
  const words = STATEMENT.split(" ");
  const textRef = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  // Scroll-linked reveal: words turn from dim to white as the paragraph
  // rises up the screen. Fully white once its top nears the upper part of
  // the viewport — starts lighting up as it enters from the bottom. A wider
  // start-to-end span here means more scrolling is needed, i.e. slower.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = textRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const startY = vh; // enters from the bottom edge
      const endY = vh * 0.2; // fully lit once it nears the top
      const raw = (startY - rect.top) / (startY - endY);
      setProgress(Math.min(1, Math.max(0, raw)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="what-we-do" className="text-white py-16 md:py-24" style={{ backgroundColor: "#000000" }}>
      <div className="max-w-[1100px] mx-auto px-5">
        <div className="flex justify-center mb-6">
          <Image src="/logo-mark.png" alt="" width={56} height={56} />
        </div>
        <h2 className="text-4xl font-medium text-center">What we do?</h2>
      </div>
      <div className="relative w-full max-w-[640px] mx-auto aspect-[1200/1030] mt-4">
        <Image src="/pyramid.png" alt="The 4 layers of a self-running business" fill sizes="(max-width:768px) 100vw, 640px" className="object-contain" />
      </div>
      <div className="max-w-[1100px] mx-auto px-5">
        {/* Big statement — words light up white one by one as you scroll */}
        <p
          ref={textRef}
          className="mt-28 md:mt-40 text-center text-[32px] md:text-[44px] font-semibold max-w-2xl mx-auto leading-[1.35] md:leading-[1.3]"
        >
          {words.map((word, i) => {
            const threshold = i / words.length;
            const active = progress >= threshold;
            return (
              <span key={i} className={`transition-colors duration-300 ${active ? "text-white" : "text-white/25"}`}>
                {word}{" "}
              </span>
            );
          })}
        </p>
        {/* Caption below the big statement */}
        <p className="mt-12 text-center text-sm font-medium max-w-md mx-auto text-white/40">
          Layer <span className="font-bold text-white">1, 2 and 3</span> are the <span className="font-bold text-white">foundation</span>.<br />
          We <span className="font-bold" style={{ color: GOLD }}>fix</span> these in your business.
        </p>
      </div>
    </section>
  );
}
