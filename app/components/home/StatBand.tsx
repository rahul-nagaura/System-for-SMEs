import Image from "next/image";
import { INK } from "./theme";

export default function StatBand() {
  return (
    <section style={{ backgroundColor: INK }} className="overflow-hidden">
      <div className="relative w-full max-w-[1000px] mx-auto aspect-[804/330]">
        {/* Full hologram image as the band background */}
        <Image src="/data-banner.png" alt="Personalized systems & data" fill sizes="(max-width:1000px) 100vw, 1000px" className="object-cover" />
        {/* Text overlaid on the dark left side */}
        <div className="absolute inset-0 flex flex-col justify-center pl-[6%] pr-[45%]">
          <span className="font-black leading-none text-white text-[15vw] sm:text-[64px] md:text-[88px]">50+</span>
          <span className="mt-1 md:mt-3 font-medium leading-tight text-white/90 text-[3.6vw] sm:text-[18px] md:text-[26px]">
            Personalized<br />Systems Designed
          </span>
        </div>
      </div>
    </section>
  );
}
