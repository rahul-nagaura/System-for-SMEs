import Link from "next/link";
import { GOLD } from "./theme";

/**
 * "Find My BIL Score" CTA → /bml (the route keeps its old path).
 * - variant="gold": gold pill + white arrow-circle (use on dark backgrounds)
 * - variant="dark": black pill + white arrow-circle (use on gold backgrounds)
 * The arrow is drawn large inside its circle, as in the Figma.
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
        className={`inline-flex items-center gap-3 rounded-full pl-8 pr-2 py-2 font-semibold uppercase bg-[#111111] text-white hover:opacity-90 active:scale-95 transition-all ${className}`}
      >
        Find My BIL Score
        <span className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#111111]" aria-hidden>
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </span>
      </Link>
    );
  }
  return (
    <Link
      href="/bml"
      className={`inline-flex items-center gap-3 rounded-full pl-7 pr-2 py-2 font-semibold uppercase text-[#111111] hover:opacity-95 active:scale-95 transition-all ${className}`}
      style={{ backgroundColor: GOLD }}
    >
      Find My BIL Score
      <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#111111]" aria-hidden>
        <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </span>
    </Link>
  );
}
