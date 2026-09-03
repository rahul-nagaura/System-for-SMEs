import Link from "next/link";
import { GOLD } from "./theme";

/**
 * "Find My BML Score" CTA → /bml.
 * - variant="gold": gold pill + white arrow-circle (use on dark backgrounds)
 * - variant="dark": black pill + white arrow-circle (use on gold backgrounds)
 */
export default function BmlButton({
  variant = "gold",
  className = "",
}: {
  variant?: "gold" | "dark";
  className?: string;
}) {
  if (variant === "dark") {
    return (
      <Link
        href="/bml"
        className={`inline-flex items-center gap-3 rounded-full pl-8 pr-2 py-2 font-semibold uppercase bg-[#0E0E0E] text-white hover:opacity-90 active:scale-95 transition-all ${className}`}
      >
        Find My BML Score
        <span className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#0E0E0E]" aria-hidden>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </span>
      </Link>
    );
  }
  return (
    <Link
      href="/bml"
      className={`inline-flex items-center gap-3 rounded-full pl-7 pr-2 py-2 font-semibold uppercase text-[#0E0E0E] hover:opacity-95 active:scale-95 transition-all ${className}`}
      style={{ backgroundColor: GOLD }}
    >
      Find My BML Score
      <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0E0E0E]" aria-hidden>
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </span>
    </Link>
  );
}
