import Image from "next/image";
import { GOLD } from "./theme";
import BmlButton from "./BmlButton";

export default function Hero() {
  return (
    <section className="relative bg-[#111111] text-white overflow-hidden rounded-b-[40px]">
      {/* Owner photo — blended bottom-right */}
      <div className="absolute bottom-0 right-0 w-[72%] sm:w-[54%] md:w-[46%] max-w-[560px] aspect-[9/11] pointer-events-none select-none">
        <Image src="/hero-owner.png" alt="Stressed business owner checking his phone" fill sizes="(max-width:768px) 72vw, 560px" className="object-contain object-bottom" priority />
      </div>
      {/* Gold glow at the bottom (subtle) */}
      <div className="absolute inset-x-0 bottom-0 h-36 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(253,197,33,0.28), rgba(253,197,33,0))" }} />
      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 pt-14 pb-36 md:py-28">
        <div className="max-w-[620px]">
          <h1 className="font-semibold leading-[0.98] tracking-tight text-[52px] sm:text-[62px] md:text-[74px]">
            <span style={{ color: GOLD }}>Systemize</span><br />
            Your Business For 10X Growth
          </h1>
          {/* Tagline + stats follow the Figma: regular body weight, semibold gold
              highlights; only the middle stat ("50+ Strategy Sessions") is gold. */}
          <p className="mt-5 text-xl md:text-2xl font-normal">
            Spend More Time On <span style={{ color: GOLD }} className="font-semibold">Strategy</span>,<br />
            <span style={{ color: GOLD }} className="font-semibold">Health</span> &amp; <span style={{ color: GOLD }} className="font-semibold">Family</span>
          </p>
          <p className="mt-4 text-xs md:text-sm font-normal">
            <span className="font-bold">3000+</span> Owners Checked BIL |<br />
            <span style={{ color: GOLD }}><span className="font-bold">50+</span> Strategy Sessions</span> | <span className="font-bold">7+</span> Industries
          </p>
          <div className="mt-8">
            <BmlButton variant="gold" className="text-base" />
          </div>
        </div>
      </div>
    </section>
  );
}
