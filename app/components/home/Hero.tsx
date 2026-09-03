import Image from "next/image";
import { GOLD } from "./theme";
import BmlButton from "./BmlButton";

export default function Hero() {
  return (
    <section className="relative bg-[#0E0E0E] text-white overflow-hidden rounded-b-[40px]">
      {/* Owner photo — blended bottom-right */}
      <div className="absolute bottom-0 right-0 w-[72%] sm:w-[54%] md:w-[46%] max-w-[560px] aspect-[9/11] pointer-events-none select-none">
        <Image src="/hero-owner.png" alt="Stressed business owner checking his phone" fill sizes="(max-width:768px) 72vw, 560px" className="object-contain object-bottom" priority />
      </div>
      {/* Gold glow at the bottom (subtle) */}
      <div className="absolute inset-x-0 bottom-0 h-36 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(253,197,33,0.28), rgba(253,197,33,0))" }} />
      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 pt-14 pb-36 md:py-28">
        <div className="max-w-[620px]">
          <h1 className="font-black leading-[0.98] tracking-tight text-[52px] sm:text-[62px] md:text-[74px]">
            <span style={{ color: GOLD }}>Systemize</span><br />
            Your Business For 10X Growth
          </h1>
          <p className="mt-5 text-xl md:text-2xl font-bold">
            Spend More Time On <span style={{ color: GOLD }}>Strategy</span>,<br />
            <span style={{ color: GOLD }}>Health</span> &amp; <span style={{ color: GOLD }}>Family</span>
          </p>
          <p className="mt-4 text-sm md:text-base font-semibold text-white/85">
            <span style={{ color: GOLD }} className="font-extrabold">3000+</span> Owners Checked BML&nbsp;&nbsp;|<br />
            <span style={{ color: GOLD }} className="font-extrabold">50+</span> Strategy Sessions&nbsp;&nbsp;|&nbsp;&nbsp;<span style={{ color: GOLD }} className="font-extrabold">7+</span> Industries
          </p>
          <div className="mt-8">
            <BmlButton variant="gold" className="text-base" />
          </div>
        </div>
      </div>
    </section>
  );
}
