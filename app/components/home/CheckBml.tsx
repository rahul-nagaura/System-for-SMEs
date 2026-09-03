import { GOLD } from "./theme";
import TrustRow from "./TrustRow";
import BmlButton from "./BmlButton";

export default function CheckBml() {
  return (
    <section style={{ backgroundColor: GOLD }} className="text-center py-16 md:py-24 px-5">
      <h2 className="max-w-xl mx-auto tracking-tight leading-[1.1] text-[#0E0E0E] font-bold text-4xl md:text-5xl">
        Check your Business Maturity Level (BML)
      </h2>
      <div className="mt-10"><TrustRow /></div>
      <div className="mt-10"><BmlButton variant="dark" /></div>
    </section>
  );
}
