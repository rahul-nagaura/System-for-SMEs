import Image from "next/image";
import { GOLD } from "./theme";

export default function WhatWeDo() {
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
        {/* Big statement — with a clear gap from the pyramid above */}
        <p className="mt-24 md:mt-32 text-center text-[28px] font-semibold max-w-xl mx-auto leading-[32px] text-white/35">
          <span className="text-white">You can NOT build a 1000Cr business on a broken foundation. We solidify</span> that foundation by building the first 3 layers for your business - so you can finally operate at the top
        </p>
        {/* Caption below the big statement */}
        <p className="mt-10 text-center text-sm font-medium max-w-md mx-auto text-white/40">
          Layer <span className="font-bold text-white">1, 2 and 3</span> are the <span className="font-bold text-white">foundation</span>.<br />
          We <span className="font-bold" style={{ color: GOLD }}>fix</span> these in your business.
        </p>
      </div>
    </section>
  );
}
