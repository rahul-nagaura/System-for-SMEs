import { GOLD } from "./theme";
import TrustRow from "./TrustRow";
import BmlButton from "./BmlButton";

export default function ReadyCta() {
  return (
    <section style={{ backgroundColor: GOLD }} className="text-center py-16 md:py-20 px-5">
      <h2 className="text-[32px] md:text-5xl font-medium leading-[1.15] max-w-md mx-auto text-[#0E0E0E]">Ready to Systemize your business?</h2>
      <div className="mt-6"><TrustRow /></div>
      <div className="mt-8"><BmlButton variant="dark" className="text-base" /></div>
    </section>
  );
}
