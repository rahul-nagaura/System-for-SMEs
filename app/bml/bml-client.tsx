"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import { categories, revenueBrackets, type CategoryId, type PillarId } from "./bml-data";
import {
  computeResult,
  questionsForCategory,
  formatCostRange,
  getBandColor,
  type Answers,
} from "./bml-scoring";
import { bilText } from "./bml-i18n";
import { LanguageSwitcher, useBmlLanguage } from "./language-switcher";

const TOTAL_QUESTIONS = 8;

// Question ids (1-8) are fixed regardless of category — only the TEXT of
// Q7/Q8 varies by branch. Used to pull both of the weakest pillar's raw
// answers for the Block 4 composite sentence.
const PILLAR_QIDS: Record<PillarId, [number, number]> = {
  operationalEfficiency: [1, 2],
  humanCapital: [3, 4],
  customerAcquisition: [5, 6],
  dataVisibility: [7, 8],
};

export default function BILCalculator({ pricingAmount = "4,999" }: { pricingAmount?: string }) {
  // 0 = Intro (category + revenue), 1-8 = Q1-Q8, 9 = Lead Capture, 10 = Results
  const [step, setStep] = useState<number>(0);
  const [category, setCategory] = useState<CategoryId | "">("");
  const [revenueBracket, setRevenueBracket] = useState<string>("");
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [lang, setLang] = useBmlLanguage();
  const text = bilText[lang];
  const t = text.ui;

  const activeCategory: CategoryId = category || "A";
  const canonicalQuestions = questionsForCategory(activeCategory);

  // Translated text for question `step` (1-8). Steps 1-6 are general;
  // 7-8 come from the category selected in step 0.
  const questionText = (s: number) => (s <= 6 ? text.generalQuestions[s - 1] : text.categoryQuestions[activeCategory][s - 7]);

  const selectAnswer = (qId: number, optionIndex: 0 | 1 | 2) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  const handleNext = () => {
    if (step === 0) {
      if (!category) return alert(t.alerts.category);
      if (!revenueBracket) return alert(t.alerts.revenue);
      setStep(1);
      return;
    }
    if (step >= 1 && step <= TOTAL_QUESTIONS) {
      if (answers[step] === undefined) return alert(t.alerts.option);
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert(t.alerts.name);
    if (!businessName.trim()) return alert(t.alerts.businessName);
    if (!whatsapp.trim() || whatsapp.replace(/[\s\-+]/g, "").length < 10) return alert(t.alerts.whatsapp);
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert(t.alerts.emailInvalid);

    setIsSubmitting(true);

    const result = computeResult(answers, activeCategory, revenueBracket);

    // Canonical (English) answer text per question — stored/submitted value
    // stays language-independent regardless of what the user is viewing.
    const qEnglishText = (qId: number) => {
      const q = canonicalQuestions.find((cq) => cq.id === qId);
      const idx = answers[qId];
      if (!q || idx === undefined) return "";
      return `${["A", "B", "C"][idx]} - ${q.options[idx]}`;
    };

    const payload = {
      name,
      businessName,
      whatsapp,
      email,
      category: activeCategory,
      categoryLabel: categories.find((c) => c.id === activeCategory)?.label ?? "",
      revenueBracket,
      revenueLabel: revenueBrackets.find((r) => r.id === revenueBracket)?.label ?? "",
      totalScore: result.totalScore,
      levelIndex: result.levelIndex,
      levelName: result.levelName,
      weakestPillar: result.weakest,
      operationalEfficiencyPct: result.pillars.operationalEfficiency.pct,
      humanCapitalPct: result.pillars.humanCapital.pct,
      customerAcquisitionPct: result.pillars.customerAcquisition.pct,
      dataVisibilityPct: result.pillars.dataVisibility.pct,
      q1: qEnglishText(1),
      q2: qEnglishText(2),
      q3: qEnglishText(3),
      q4: qEnglishText(4),
      q5: qEnglishText(5),
      q6: qEnglishText(6),
      q7: qEnglishText(7),
      q8: qEnglishText(8),
    };

    try {
      await fetch("/api/bil-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Failed to submit BIL lead:", err);
    } finally {
      setIsSubmitting(false);
      setStep(10);
    }
  };

  const languageSwitcher = <LanguageSwitcher lang={lang} onChange={setLang} label={t.languageToggleLabel} />;

  /* ── Results (step 10) ────────────────────────────────────── */
  if (step === 10) {
    const result = computeResult(answers, activeCategory, revenueBracket);
    const categoryLabel = text.categories[activeCategory];
    const tagline = text.levelTaglines[result.levelName] ?? "";
    const weakestLabel = text.pillarLabels[result.weakest];
    const pillarOrder = ["operationalEfficiency", "humanCapital", "dataVisibility", "customerAcquisition"] as const;
    const benchmarkStat = t.benchmarkStat(result.percentile);

    // Block 4: weave both of the weakest pillar's answers into one sentence.
    const [q1id, q2id] = PILLAR_QIDS[result.weakest];
    const clausePair = result.weakest === "dataVisibility" ? text.answerClauses.dataVisibility[activeCategory] : text.answerClauses[result.weakest];
    const clauseA = clausePair[0][answers[q1id] ?? 0];
    const clauseB = clausePair[1][answers[q2id] ?? 0];

    return (
      <div lang={lang === "hinglish" ? "hi-Latn" : "en"} className="min-h-screen bg-white text-[#0E0E0E] font-sans">
        <Nav showLogo languageSwitcher={languageSwitcher} />

        {/* Block 1 — dark hero: headline + score ring */}
        <section className="bg-[#0E0E0E] text-white pt-28 pb-14 px-6">
          <div className="max-w-[560px] mx-auto text-center space-y-5">
            <div className="text-[11px] tracking-[0.2em] uppercase text-white/45 font-semibold">{t.resultEyebrow}</div>
            <h1 className="font-['Archivo'] font-extrabold text-[28px] sm:text-[34px] leading-[1.15] tracking-tight">
              {t.heroHeadline(name || "Founder", result.levelName)}
            </h1>

            <div className="relative w-[140px] h-[140px] rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] flex items-center justify-center mx-auto my-2">
              <svg viewBox="0 0 120 120" width="140" height="140" className="absolute inset-0">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#ECECE6" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke={result.ringGeometry.color}
                  strokeWidth="10" transform="rotate(-90 60 60)"
                  strokeDasharray={result.ringGeometry.dashArray}
                  strokeDashoffset={result.ringGeometry.dashOffset}
                  strokeLinecap="round"
                  className="transition-all duration-[1100ms] ease-out"
                />
              </svg>
              <div className="relative flex flex-col items-center">
                <span className="font-['Archivo'] font-black text-[40px] leading-none text-[#0E0E0E]">{result.totalScore}</span>
                <span className="text-[10px] uppercase tracking-widest text-[#9A9A93] font-bold mt-1">{t.ringCaption}</span>
              </div>
            </div>

            <div className="text-[12px] tracking-[0.15em] uppercase text-white/55 font-semibold">
              {t.levelOfTotal(result.levelIndex, result.levelName)}
            </div>
            <p className="font-['Archivo'] font-bold text-xl leading-snug">{tagline}</p>
            <p className="text-sm text-white/45 font-medium pt-1">{t.scrollPrompt}</p>
          </div>
        </section>

        {/* White body: Blocks 2–6 + VSL */}
        <main className="px-6 pb-4 max-w-[560px] mx-auto w-full">
          {/* Block 2 — Benchmark */}
          <section className="py-9 border-b border-[#ECECE6] space-y-3">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#9A9A93] font-semibold">{t.benchmarkHeading}</div>
            <div className="flex items-baseline gap-3">
              <span className="font-['Archivo'] font-black text-[52px] leading-none">{benchmarkStat.value}%</span>
              <span className="text-[13px] text-[#6B6B66] font-medium max-w-[140px] leading-tight">{benchmarkStat.caption}</span>
            </div>
            <p className="text-[15px] leading-relaxed text-[#3A3A36]">
              {t.benchmarkCopy(result.benchmark, result.percentile, categoryLabel, result.categoryAvg.toFixed(1))}
            </p>
          </section>

          {/* Block 3 — Four systems */}
          <section className="py-9 border-b border-[#ECECE6]">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#9A9A93] font-semibold mb-4">{t.fourSystemsHeading}</div>
            <div className="flex flex-col gap-5">
              {pillarOrder.map((pillar) => {
                const isWeak = pillar === result.weakest;
                const value = result.pillars[pillar].pct;
                return (
                  <div key={pillar} className="grid gap-1.5">
                    <div className="flex items-baseline justify-between gap-2.5">
                      <span className="text-[14px] font-semibold">{text.pillarLabels[pillar]}</span>
                      <span className="font-['Archivo'] font-bold text-[14px] text-[#6B6B66]">{value}%</span>
                    </div>
                    {isWeak && <div className="text-[10px] tracking-[0.15em] uppercase text-[#E5484D] font-bold -mt-1">{t.weakestCaption}</div>}
                    <div className="h-[8px] bg-[#ECECE6] relative overflow-hidden rounded-full">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: getBandColor(value) }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Block 4 — Your #1 constraint */}
          <section className="py-9 border-b border-[#ECECE6] space-y-3">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#9A9A93] font-semibold">{t.bottleneckHeading}</div>
            <h2 className="font-['Archivo'] font-bold text-[28px] leading-tight">{weakestLabel}</h2>
            <p className="text-[15px] leading-relaxed text-[#3A3A36]">{t.answerSentence(clauseA, clauseB)}</p>
            <p className="text-[15px] leading-relaxed text-[#6B6B66]">{t.bottleneckFooter}</p>
          </section>

          {/* Block 5 — Cost of inaction */}
          <section className="py-9 border-b border-[#ECECE6] space-y-3">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#9A9A93] font-semibold">{t.costHeading}</div>
            <p className="text-[15px] leading-relaxed text-[#3A3A36]">{t.costIntro}</p>
            <p className="text-sm text-[#6B6B66] font-medium">{t.costLeadIn}</p>
            <div className="flex items-baseline gap-2">
              <span className="font-['Archivo'] font-black text-[38px] leading-none">{formatCostRange(result.cost)}</span>
              <span className="text-[13px] text-[#6B6B66] font-medium">{t.costStatSuffix}</span>
            </div>
            <p className="text-[15px] leading-relaxed text-[#6B6B66]">{t.costFragment}</p>
          </section>

          {/* Block 6 — Open the loop */}
          <section className="py-9 space-y-4">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#9A9A93] font-semibold">{t.openLoopHeading}</div>
            <ol className="flex flex-col gap-3.5">
              {t.openLoopItems(weakestLabel).map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="font-['Archivo'] font-bold text-[13px] text-[#FCD12A] flex-shrink-0 w-5">0{idx + 1}</span>
                  <p className="text-[14.5px] text-[#3A3A36] leading-[1.5]">{item}</p>
                </li>
              ))}
            </ol>
            <p className="text-sm font-semibold">{t.openLoopFooter}</p>
          </section>

          {/* VSL — a dark card inside the white section, deliberately placed here
              (between Block 6 and 7), not at the top: a skipped video does not get
              re-found once the user has already scrolled past it. Drop the real
              file at /public/bil-vsl.mp4 and swap this placeholder for a <video>
              tag (muted autoPlay loop playsInline) when ready. */}
          <section className="pb-9">
            <div className="relative aspect-video w-full rounded-2xl bg-[#141414] flex flex-col items-center justify-center gap-3">
              <span className="w-14 h-14 rounded-full border-2 border-white/40 flex items-center justify-center text-white/70">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </span>
              <span className="text-xs uppercase tracking-widest font-semibold text-white/70">{t.vslPlaceholder}</span>
              <span className="text-[11px] text-white/40">{t.vslCaption}</span>
              <span className="text-[11px] text-white/30 italic">{t.vslHint}</span>
            </div>
          </section>
        </main>

        {/* Block 7 — dark CTA, full-bleed */}
        <section className="bg-[#0E0E0E] text-white px-6 py-12">
          <div className="max-w-[560px] mx-auto space-y-5">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#FCD12A] font-semibold">{t.nextStepEyebrow}</div>
            <h2 className="font-['Archivo'] font-black text-[28px] sm:text-[32px] leading-[1.15]">{t.ctaHeadline}</h2>
            <p className="text-[15px] text-white/60 font-medium">{t.ctaSub}</p>
            <ul className="flex flex-col gap-2.5 pt-1">
              {t.ctaBullets.map((b, idx) => (
                <li key={idx} className="flex gap-2.5 text-sm text-white/85">
                  <span className="text-[#2E9E5B] font-bold flex-shrink-0">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-baseline gap-2 pt-3">
              <span className="font-['Archivo'] font-black text-4xl">{t.ctaPrice(pricingAmount)}</span>
              <span className="text-sm text-white/45">{t.perSessionLabel}</span>
            </div>
            <Link
              href="/booking"
              className="w-full bg-[#FCD12A] text-[#0E0E0E] font-['Archivo'] font-black text-lg rounded-full py-4 flex items-center justify-center gap-3 transition-transform hover:-translate-y-0.5 text-center mt-2"
            >
              {t.ctaButton}
            </Link>
            <p className="text-xs text-white/40 text-center">{t.ctaGuarantee}</p>
          </div>
        </section>

        {/* Block 8 — white footer: proof + FAQ + vault link */}
        <section className="px-6 py-12 max-w-[560px] mx-auto w-full space-y-12">
          <div className="space-y-3">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#9A9A93] font-semibold">{t.proofHeading}</div>
            {/* TODO(rahul): real client names, companies + before/after scores go
                here once confirmed real and cleared to publish — not fabricated. */}
            <p className="text-sm text-[#6B6B66] italic">{t.proofPlaceholder}</p>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#9A9A93] font-semibold mb-2">{t.faqHeading}</div>
            {t.faqItems.map((item, idx) => {
              const open = openFaq === idx;
              return (
                <div key={idx} className="border-b border-[#ECECE6]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 py-4 text-left"
                  >
                    <span className="text-[15px] font-semibold">{item.q}</span>
                    <span className={`flex-shrink-0 text-[#9A9A93] transition-transform ${open ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {open && <p className="text-sm text-[#6B6B66] leading-relaxed pb-4 pr-6">{item.a}</p>}
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link href="/vault" className="text-xs text-[#6B6B66] underline hover:text-[#0E0E0E] transition-colors">
              {t.vaultLink}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  /* ── Intro / Questions / Lead capture (steps 0-9) ─────────── */
  return (
    <div lang={lang === "hinglish" ? "hi-Latn" : "en"} className="min-h-screen bg-[#fff8f2] text-[#2b3040] font-sans flex flex-col relative overflow-x-hidden">
      <Nav showLogo languageSwitcher={languageSwitcher} />

      <main className={`flex-grow pt-24 px-6 ${step < 9 ? "pb-32" : "pb-10"} max-w-3xl mx-auto w-full flex flex-col justify-start`}>
        {step <= TOTAL_QUESTIONS && (
          <div className="w-full space-y-8">
            {step === 0 && (
              <div className="text-center space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#edb605]">{t.introEyebrow}</span>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t.introTitle}</h1>
                <p className="text-[#2b3040]/70 font-medium">{t.introSub}</p>
              </div>
            )}

            {step > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-end text-xs font-bold uppercase tracking-wider text-[#2b3040]/60">
                  <span>{t.questionProgress(step)}</span>
                  <span>{t.percentComplete(Math.round((step / TOTAL_QUESTIONS) * 100))}</span>
                </div>
                <div className="h-2 w-full bg-[#2b3040]/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#edb605] transition-all duration-500 ease-out" style={{ width: `${(step / TOTAL_QUESTIONS) * 100}%` }} />
                </div>
              </div>
            )}

            {step === 0 ? (
              <div className="bg-white border border-[#2b3040]/10 p-6 md:p-8 rounded-[24px] shadow-sm space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">{t.categoryHeading}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex items-start gap-3 p-3.5 rounded-lg border text-left transition-all duration-200 ${
                          category === cat.id ? "border-[#edb605] bg-[#edb605]/5 font-semibold" : "border-[#2b3040]/10 bg-[#fff8f2]/30 hover:bg-[#2b3040]/5"
                        }`}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${category === cat.id ? "border-[#edb605]" : "border-[#2b3040]/30"}`}>
                          <div className={`w-2.5 h-2.5 rounded-full bg-[#edb605] transition-transform ${category === cat.id ? "scale-100" : "scale-0"}`} />
                        </div>
                        <span className="text-sm">{text.categories[cat.id]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#2b3040]/10">
                  <h3 className="text-xl font-bold">{t.revenueHeading}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {revenueBrackets.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRevenueBracket(r.id)}
                        className={`flex items-start gap-3 p-3.5 rounded-lg border text-left transition-all duration-200 ${
                          revenueBracket === r.id ? "border-[#edb605] bg-[#edb605]/5 font-semibold" : "border-[#2b3040]/10 bg-[#fff8f2]/30 hover:bg-[#2b3040]/5"
                        }`}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${revenueBracket === r.id ? "border-[#edb605]" : "border-[#2b3040]/30"}`}>
                          <div className={`w-2.5 h-2.5 rounded-full bg-[#edb605] transition-transform ${revenueBracket === r.id ? "scale-100" : "scale-0"}`} />
                        </div>
                        <span className="text-sm">{text.revenue[r.id]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold leading-snug">{questionText(step).question}</h2>
                <div className="grid grid-cols-1 gap-4">
                  {questionText(step).options.map((optText, optIdx) => {
                    const isSelected = answers[step] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => selectAnswer(step, optIdx as 0 | 1 | 2)}
                        className={`w-full flex items-start gap-3 md:gap-4 p-3.5 md:p-4 rounded-xl border text-left transition-all duration-200 active:scale-[0.98] ${
                          isSelected ? "border-[#edb605] bg-white shadow-md font-semibold ring-1 ring-[#edb605]/20" : "border-[#2b3040]/10 bg-white hover:bg-[#2b3040]/5"
                        }`}
                      >
                        <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center bg-white transition-colors ${isSelected ? "border-[#edb605]" : "border-[#2b3040]/30"}`}>
                          <div className={`w-3 h-3 rounded-full bg-[#edb605] transition-transform ${isSelected ? "scale-100" : "scale-0"}`} />
                        </div>
                        <p className="text-[15px] font-medium">{optText}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 9 && (
          <div className="w-full pt-6 space-y-6 max-w-lg mx-auto">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[12px] tracking-[0.05em] font-semibold text-[#666666] uppercase">{t.percentComplete(100)}</span>
                <span className="text-[12px] tracking-[0.05em] font-semibold text-[#edb605] uppercase">100%</span>
              </div>
              <div className="h-1.5 w-full bg-[#f4ede6] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#edb605] to-[#d4a304] w-full" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-[28px] md:text-[36px] font-bold tracking-tight leading-tight">{t.leadHeading}</h1>
              <p className="text-[#666666]">{t.leadSub}</p>
            </div>

            <form className="bg-white border border-black/5 rounded-2xl p-8 space-y-5 shadow-sm" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-[#666666] block uppercase" htmlFor="bil-name">{t.nameLabel}</label>
                <input
                  id="bil-name"
                  type="text"
                  className="w-full bg-[#f4ede6] border border-[#e0d8d0] rounded-xl px-4 py-4 focus:outline-none focus:border-[#edb605] focus:ring-1 focus:ring-[#edb605]"
                  placeholder={t.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-[#666666] block uppercase" htmlFor="bil-business">{t.businessNameLabel}</label>
                <input
                  id="bil-business"
                  type="text"
                  className="w-full bg-[#f4ede6] border border-[#e0d8d0] rounded-xl px-4 py-4 focus:outline-none focus:border-[#edb605] focus:ring-1 focus:ring-[#edb605]"
                  placeholder={t.businessNamePlaceholder}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-[#666666] block uppercase" htmlFor="bil-whatsapp">{t.whatsappLabel}</label>
                <input
                  id="bil-whatsapp"
                  type="tel"
                  className="w-full bg-[#f4ede6] border border-[#e0d8d0] rounded-xl px-4 py-4 focus:outline-none focus:border-[#edb605] focus:ring-1 focus:ring-[#edb605]"
                  placeholder="+91 98XXX XXXXX"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
                <p className="text-[11px] text-[#666666]/70 ml-1">{t.whatsappHint}</p>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-[#666666] block uppercase" htmlFor="bil-email">{t.emailLabel}</label>
                <input
                  id="bil-email"
                  type="email"
                  className="w-full bg-[#f4ede6] border border-[#e0d8d0] rounded-xl px-4 py-4 focus:outline-none focus:border-[#edb605] focus:ring-1 focus:ring-[#edb605]"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-[11px] text-[#666666]/70 ml-1">{t.emailHint}</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#edb605] text-black font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
              >
                {isSubmitting ? t.generating : t.showResult}
              </button>
            </form>
          </div>
        )}
      </main>

      {step <= TOTAL_QUESTIONS && (
        <div className="fixed bottom-0 left-0 w-full z-50 px-6 pb-8 pt-4 bg-[#fff8f2]/90 backdrop-blur-lg border-t border-[#2b3040]/10">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-6">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className={`flex items-center gap-1.5 font-bold text-[13px] tracking-wider uppercase transition-all py-3 ${step === 0 ? "opacity-35 cursor-not-allowed" : "hover:text-[#edb605] active:scale-90"}`}
            >
              ← {t.back}
            </button>
            <button
              onClick={handleNext}
              className="flex items-center justify-center gap-2 bg-[#edb605] text-[#2b3040] font-extrabold text-[13px] tracking-widest uppercase rounded-full px-8 py-4 shadow-md hover:brightness-105 active:scale-95 transition-all"
            >
              {step === TOTAL_QUESTIONS ? t.checkScore : t.next} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
