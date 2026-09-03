import { GOLD } from "./theme";
import TrustRow from "./TrustRow";
import BmlButton from "./BmlButton";

export default function ReadyCta() {
  return (
    <section style={{ backgroundColor: GOLD }} className="text-center py-16 md:py-20 px-5">
      <h2 className="text-3xl md:text-5xl font-black tracking-tight max-w-2xl mx-auto">Ready to systemize your business?</h2>
      <div className="mt-6"><TrustRow /></div>
      <div className="mt-8"><BmlButton variant="dark" className="text-base" /></div>
    </section>
  );
}
