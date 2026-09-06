import Image from "next/image";
import Link from "next/link";
import { GOLD } from "./theme";

export default function ProductTracking() {
  return (
    <section className="text-white py-16 md:py-24 px-5" style={{ backgroundColor: "#000000" }}>
      <div className="max-w-[1000px] mx-auto">
        {/* Black card — the problem */}
        <div className="rounded-[28px] bg-[#0E0E0E] border border-white/10 p-6 md:p-10">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-white text-[#0E0E0E] flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/40">Manufacturing</span>
          </div>
          <h3 className="mt-5 text-[32px] md:text-4xl font-medium leading-[1.15]">
            Manual data tracking provides no insights. Also paper slips are often lost.
          </h3>
        </div>

        {/* Solution + dashboard — same black section, white text */}
        <div className="mt-12">
          <h3 className="text-[32px] md:text-4xl font-medium leading-[1.15]">
            A robust tracking module, with KPIs at a glance.
          </h3>
          <div className="relative w-full aspect-[1090/650] rounded-2xl overflow-hidden border border-white/10 mt-8">
            <Image src="/dashboard.png" alt="Live tracking dashboard" fill sizes="(max-width:1000px) 90vw, 900px" className="object-cover object-left-top" />
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <a href="#how" className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold uppercase px-7 py-3.5 rounded-full hover:bg-white hover:text-[#0E0E0E] transition-all">
              See Details
            </a>
            <Link href="/booking" className="inline-flex items-center justify-center gap-2 font-semibold uppercase px-7 py-3.5 rounded-full text-[#0E0E0E] hover:opacity-90 transition-all" style={{ backgroundColor: GOLD }}>
              See Live App
            </Link>
          </div>
          <div className="mt-8 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i === 0 ? GOLD : "rgba(255,255,255,0.3)" }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
