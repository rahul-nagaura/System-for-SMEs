import { GOLD } from "./theme";

const steps = [
  "You identify the need",
  "You check your BML score",
  "Book a detailed systems strategy call",
  "We build the systems for you",
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-white py-16 md:py-24 px-5">
      <div className="max-w-[560px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-center tracking-tight">How it works?</h2>
        <ol className="mt-10 flex flex-col gap-4">
          {steps.map((s) => (
            <li key={s} className="text-center rounded-full px-6 py-4 font-extrabold uppercase tracking-wide text-[#0E0E0E] shadow-sm" style={{ backgroundColor: GOLD }}>
              {s}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
