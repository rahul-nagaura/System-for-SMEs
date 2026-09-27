import { GOLD } from "./theme";
import TrustRow from "./TrustRow";
import BmlButton from "./BmlButton";

export default function CheckBml() {
  return (
    <section style={{ backgroundColor: GOLD }} className="text-center py-16 md:py-24 px-5">
      {/* Four fixed lines, as in the Figma — mixed weights: light "Check your" and
          "(BIL)", bold name. Each line is its own block so the break never depends
          on screen width. */}
      <h2 className="mx-auto leading-[1.15] text-[#111111] text-[30px] md:text-5xl">
        <span className="block font-medium">Check your</span>
        <span className="block font-bold">Business</span>
        <span className="block font-bold">Independence</span>
        <span className="block">
          <span className="font-bold">Level</span> <span className="font-medium">(BIL)</span>
        </span>
      </h2>
      <div className="mt-10"><TrustRow /></div>
      <div className="mt-10"><BmlButton variant="dark" /></div>
    </section>
  );
}
