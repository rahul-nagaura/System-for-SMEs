import Image from "next/image";
import { GOLD } from "./theme";

export default function AboutUs() {
  return (
    <section id="about" className="text-white py-16 md:py-24 px-5" style={{ backgroundColor: "#000000" }}>
      <div className="max-w-[900px] mx-auto text-center">
        <p className="text-2xl md:text-3xl font-black leading-snug">
          &ldquo;We make your business ready to run <span style={{ backgroundColor: GOLD }} className="px-1 text-[#0E0E0E]">without you</span> being there all the time — by creating the essential operational systems.&rdquo;
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <span className="inline-flex items-center justify-center bg-white rounded-2xl p-3">
            <Image src="/iit-dhanbad.png" alt="IIT (ISM) Dhanbad" width={64} height={73} className="object-contain" />
          </span>
          <p className="text-base md:text-lg font-semibold text-white/70 max-w-xl">
            We are a team of <b>IIT (ISM) Dhanbad</b> graduated engineers with a deep understanding of Indian SME &amp; family-business culture. Our goal is to make Indian SME businesses attractive to global talent and investors — by fixing the core operational systems they run on.
          </p>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-white/50">— Team, Systems for SME</p>
        </div>
      </div>
    </section>
  );
}
