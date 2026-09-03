import { GOLD } from "./theme";

export type Review = {
  name: string;
  role: string;
  text: string;
  rating?: number;
};

export default function Testimonials({ reviews }: { reviews: Review[] }) {
  return (
    <section className="max-w-[640px] mx-auto px-5 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-black text-center tracking-tight">Testimonials</h2>
      <div className="mt-10 flex flex-col gap-5">
        {reviews.map((r, i) => (
          <div key={i} className="rounded-2xl border border-black/10 p-6 bg-white shadow-sm text-center">
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center font-black text-lg text-[#0E0E0E]" style={{ backgroundColor: GOLD }}>
              {String(r.name || "?").charAt(0).toUpperCase()}
            </div>
            <div className="mt-3 font-extrabold">{r.name}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0E0E0E]/50">{r.role}</div>
            <div className="mt-2 text-lg" style={{ color: GOLD }}>{"★".repeat(r.rating || 5)}</div>
            <p className="mt-3 text-[15px] leading-relaxed text-[#0E0E0E]/80">&ldquo;{r.text}&rdquo;</p>
          </div>
        ))}
      </div>
    </section>
  );
}
