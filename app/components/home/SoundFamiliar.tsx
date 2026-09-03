import Image from "next/image";

const familiarCards = [
  { img: "/familiar-muneem.png", label: "Everything depends on you." },
  { img: "/familiar-chhuti.png", label: "You can't take any family vacations." },
  { img: "/familiar-cashflow.png", label: "No clear visibility & reporting of your data." },
];

export default function SoundFamiliar() {
  return (
    <section className="max-w-[720px] mx-auto px-5 py-16 md:py-24">
      <h2 className="text-4xl font-medium text-center leading-[1.2]">Does this sound familiar?</h2>
      <div className="mt-10 flex flex-col gap-4">
        {familiarCards.map((c) => (
          <div key={c.img} className="flex items-center gap-5 rounded-2xl bg-[#FBF6EA] shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-3">
            <div className="relative w-[108px] h-[108px] flex-shrink-0 rounded-xl overflow-hidden">
              <Image src={c.img} alt={c.label} fill sizes="108px" className="object-cover" />
            </div>
            <p className="font-medium text-[25px] leading-tight text-[#0E0E0E]">{c.label}</p>
          </div>
        ))}
      </div>
      <blockquote className="mt-12 max-w-md mx-auto text-center">
        <p className="text-[28px] font-medium leading-tight text-[#0E0E0E]/40">
          &ldquo;If your business can&apos;t run for <span className="font-bold text-[#0E0E0E]">two weeks</span> without you, you don&apos;t own a business, <span className="font-bold text-[#0E0E0E]">you own a job</span>&rdquo;
        </p>
      </blockquote>
    </section>
  );
}
