import Image from "next/image";
import Link from "next/link";
import { GOLD } from "./theme";

export default function ProductTracking() {
  return (
    <section className="max-w-[1000px] mx-auto px-5 py-16 md:py-24">
      {/* Black card — the problem */}
      <div className="rounded-[28px] bg-[#0E0E0E] text-white p-6 md:p-10">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-white text-[#0E0E0E] flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/40">Manufacturing</span>
        </div>
        <h3 className="mt-5 text-[32px] md:text-4xl font-medium leading-[1.15]">
          Manual data tracking provides no insights. Also paper slips are often lost.
        </h3>
      </div>

      {/* White area below — the solution + dashboard */}
      <div className="mt-12">
        <h3 className="text-[32px] md:text-4xl font-medium leading-[1.15] text-[#0E0E0E]">
          A robust tracking module, with KPIs at a glance.
        </h3>
        <div className="relative w-full aspect-[1090/650] rounded-2xl overflow-hidden border border-black/10 shadow-lg mt-8">
          <Image src="/dashboard.png" alt="Live tracking dashboard" fill sizes="(max-width:1000px) 90vw, 900px" className="object-cover object-left-top" />
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <a href="#how" className="inline-flex items-center justify-center gap-2 border-2 border-[#0E0E0E] text-[#0E0E0E] font-semibold uppercase px-7 py-3.5 rounded-full hover:bg-[#0E0E0E] hover:text-white transition-all">
            See Details
          </a>
          <Link href="/booking" className="inline-flex items-center justify-center gap-2 font-semibold uppercase px-7 py-3.5 rounded-full text-[#0E0E0E] hover:opacity-90 transition-all" style={{ backgroundColor: GOLD }}>
            See Live App
          </Link>
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i === 0 ? GOLD : "rgba(14,14,14,0.2)" }} />
          ))}
        </div>
      </div>
    </section>
  );
}
