"use client";

import { useState } from "react";
import { GOLD } from "./theme";

export type Review = {
  name: string;
  role: string;
  text: string;
  rating?: number;
};

export default function Testimonials({ reviews }: { reviews: Review[] }) {
  const [active, setActive] = useState(0);
  const r = reviews[active] ?? reviews[0];

  return (
    <section className="bg-white py-16 md:py-24 px-5">
      <div className="max-w-[640px] mx-auto">
        <h2 className="text-4xl font-bold text-center tracking-tight text-[#0E0E0E]">Testimonials</h2>

        <div className="mt-10 rounded-[20px] border border-black/10 bg-white p-6 md:p-7 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 rounded-full flex-shrink-0" style={{ backgroundColor: "#D9D9D9" }} />
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
                onClick={() => setActive(i)}
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
