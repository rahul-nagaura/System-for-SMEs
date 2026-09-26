import Image from "next/image";
import { GOLD } from "./theme";

/* About Us — follows the Figma:
   - heading: Montserrat Medium 36 (same as the other section titles)
   - quote:   Montserrat ExtraLight 28 / line-height 32 / letter-spacing 0, 291px wide,
              bold quote marks
   - copy:    Montserrat Regular 16 / letter-spacing 3% / white, 351px wide, justified
   - sign-off: #535353, right-aligned */
export default function AboutUs() {
  return (
    <section id="about" className="scroll-mt-16 text-white py-16 md:py-24 px-5" style={{ backgroundColor: "#111111" }}>
      <div className="max-w-[900px] mx-auto text-center">
        <h2 className="text-4xl font-medium">About Us</h2>

        <p className="mt-[52px] mx-auto max-w-[291px] md:max-w-3xl text-[28px] md:text-3xl leading-[32px] md:leading-snug font-thin">
          <span className="font-bold">&ldquo;</span> We make your business ready to run without you being there all the time, by creating the essential operational systems. <span className="font-bold">&rdquo;</span>
        </p>

        <Image src="/iit-dhanbad.png" alt="IIT (ISM) Dhanbad" width={92} height={105} className="mx-auto mt-14 object-contain" />

        <div className="mx-auto mt-8 max-w-[351px] text-justify text-base font-light leading-5 tracking-[0.03em] text-white">
          <p>
            We are a team of <b className="font-bold" style={{ color: GOLD }}>IIT Dhanbad</b> graduated engineers with understanding of Indian SME culture. We started this by fixing a family business and realized the need across entire India.
          </p>
          <p className="mt-5">
            <b className="font-bold">Our goal</b> is to make Indian Lala businesses attractive to Global Talent and Investors. <i>All that needs is fixing the core operations systems clubbed with decent marketing.</i>
          </p>
        </div>

        <p className="mx-auto mt-8 max-w-[351px] text-right text-sm font-medium text-[#535353]">- Team, Systems For SME</p>
      </div>
    </section>
  );
}
