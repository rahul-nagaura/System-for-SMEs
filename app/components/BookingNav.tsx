"use client";
import Link from "next/link";

export default function BookingNav({ activePage }: { activePage: "bml" | "booking" | "results" }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#fff8f2] border-b-2 border-[#725b22] h-20 flex justify-between items-center px-6 max-w-[1200px] mx-auto left-0 right-0">
      <Link href="/" className="font-black text-xl uppercase text-[#775a00] flex items-center gap-2">
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
        Systems for SME
      </Link>
      <div className="hidden md:flex gap-8 items-center">
        {/* BML Calculator link */}
        <Link
          href="/bml"
          prefetch={true}
          className={`text-xs uppercase tracking-wider font-extrabold transition-colors py-1 ${
            activePage === "bml"
              ? "text-[#775a00] border-b-2 border-[#775a00]"
              : "text-[#4f4633] hover:text-[#775a00]"
          }`}
        >
          BML Calculator
        </Link>

        {/* Onboarding link */}
        <Link
          href="/booking"
          prefetch={true}
          className={`text-xs uppercase tracking-wider font-extrabold transition-colors py-1 ${
            activePage === "booking"
              ? "text-[#775a00] border-b-2 border-[#775a00]"
              : "text-[#4f4633] hover:text-[#775a00]"
          }`}
        >
          Onboarding
        </Link>

        {/* Results link - only shown on results page */}
        {activePage === "results" && (
          <span className="text-xs uppercase tracking-wider font-extrabold text-[#775a00] border-b-2 border-[#775a00] py-1">
            Results
          </span>
        )}
      </div>
    </header>
  );
}
