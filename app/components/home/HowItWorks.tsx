import { GOLD } from "./theme";

const steps = [
  "You realize\nthe need",
  "You check your\nBML score",
  "Book a detailed\nsystems strategy call",
  "We build the\nsystems for you",
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-16 md:py-24 px-5" style={{ backgroundColor: "#000000" }}>
      <div className="max-w-[560px] mx-auto">
        <h2 className="text-4xl font-medium text-center text-white">How it works?</h2>
        <ol className="mt-12 flex flex-col items-center gap-6">
          {steps.map((s) => (
            <li
              key={s}
              className="text-center whitespace-pre-line rounded-full px-10 py-4 font-bold uppercase leading-tight text-[#0E0E0E]"
              style={{ backgroundColor: GOLD }}
            >
              {s}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
