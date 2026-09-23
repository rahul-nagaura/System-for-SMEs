"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import { categories, revenueBrackets, type CategoryId, type PillarId } from "./bml-data";
import { computeResult, questionsForCategory, formatCostRange, type Answers } from "./bml-scoring";
import { bilText } from "./bml-i18n";
import { LanguageSwitcher, useBmlLanguage } from "./language-switcher";
import ResultsFooter from "./results-footer";

/* Design tokens — the designer's "black" is #111111 (updated 2026-09-23). */
const INK = "#111111";
const GOLD = "#FCD12A";
const GOLD_DEEP = "#EDB605";

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

// The single testimonial shown on the results page (from the final design).
// Kept in English in both languages — a client's quote is not translated.
const TESTIMONIAL = {
  name: "Munish Kumar Kansal",
  role: "M.K. Industries, Bathinda, PB",
  text: "We ran everything on memory and loose registers — stock, replacements, product records, all manual. They built us a replacement tracker, a QR-based product database, a stock module, and proper playbooks for how the work should run. For the first time the business runs on a system instead of on people remembering things. For a manufacturing setup like ours, that's a real shift.",
};

/* ── Small presentational helpers ───────────────────────────── */

/** Renders `**bold**` markers from the copy layer as <strong>. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-bold" style={{ color: INK }}>
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function SectionLabel({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] tracking-[0.22em] uppercase text-[#8A8A8A] font-semibold">
      {icon}
      <span>{children}</span>
    </div>
  );
}

const iconProps = { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

function BarChartIcon() {
  return (
    <svg {...iconProps} stroke={GOLD_DEEP}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  );
}
function TriangleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={INK} aria-hidden="true">
      <path d="M12 3l10 18H2z" />
    </svg>
  );
}
function AlertCircleIcon() {
  return (
    <svg {...iconProps} stroke="#E5484D">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7.5v5.5M12 16.5v.01" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg {...iconProps} stroke={INK}>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.2A9.8 9.8 0 0112 6c5.5 0 9 6 9 6a15.6 15.6 0 01-3.2 3.9M6.3 7.6A15.5 15.5 0 003 12s3.5 6 9 6a9.6 9.6 0 004.1-.9" />
      <path d="M9.9 9.9a3 3 0 004.2 4.2" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={INK} aria-hidden="true">
      <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.1 1.2-6.6L2.5 9.5l6.6-.9z" />
    </svg>
  );
}
function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === "right" ? <path d="M5 12h14M13 6l6 6-6 6" /> : <path d="M19 12H5M11 6l-6 6 6 6" />}
    </svg>
  );
}

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
      <div lang={lang === "hinglish" ? "hi-Latn" : "en"} className="min-h-screen bg-white" style={{ color: INK }}>
        <Nav showLogo languageSwitcher={languageSwitcher} />

        {/* Block 1 — hero: headline + score ring */}
        <section className="bg-white pt-28 pb-10 px-6">
          <div className="max-w-[560px] mx-auto text-center space-y-5">
            <div className="text-[10.5px] tracking-[0.25em] uppercase text-[#9A9A9A] font-semibold">{t.resultEyebrow}</div>
            <h1 className="font-bold text-[28px] sm:text-[34px] leading-[1.2] tracking-tight">{t.heroHeadline(name || "Founder", result.levelName)}</h1>

            <div className="relative w-[150px] h-[150px] mx-auto my-3 flex items-center justify-center">
              <svg viewBox="0 0 120 120" width="150" height="150" className="absolute inset-0" aria-hidden="true">
                <circle cx="60" cy="60" r="55" fill="none" stroke="#EDEDED" strokeWidth="3" />
                <circle
                  cx="60" cy="60" r="55" fill="none" stroke={GOLD_DEEP}
                  strokeWidth="3" transform="rotate(-90 60 60)"
                  strokeDasharray={2 * Math.PI * 55}
                  strokeDashoffset={2 * Math.PI * 55 * (1 - result.totalScore / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-[1100ms] ease-out"
                />
              </svg>
              <div className="relative flex flex-col items-center">
                <span className="font-medium text-[54px] leading-none">{result.totalScore}</span>
                <span className="text-[9.5px] uppercase tracking-[0.2em] text-[#9A9A9A] font-semibold mt-1.5">{t.ringCaption}</span>
              </div>
            </div>

            {/* 4-step level indicator: the current level is gold */}
            <div className="flex items-center justify-center gap-1.5" aria-hidden="true">
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className="h-[3px] w-9 rounded-full" style={{ backgroundColor: n === result.levelIndex ? GOLD_DEEP : "#E5E5E5" }} />
              ))}
            </div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#6B6B6B] font-semibold">{t.levelOfTotal(result.levelIndex, result.levelName)}</div>

            <p className="text-[17px] leading-snug text-[#3A3A3A] font-normal">{tagline}</p>
            <p className="text-[12.5px] text-[#9A9A9A] font-medium pt-1">{t.scrollPrompt}</p>
          </div>
        </section>

        {/* Blocks 2–6 + VSL */}
        <main className="px-6 pb-4 max-w-[560px] mx-auto w-full">
          {/* Block 2 — Benchmark */}
          <section className="py-9 border-t border-[#EFEFEF] space-y-3.5">
            <SectionLabel icon={<BarChartIcon />}>{t.benchmarkHeading}</SectionLabel>
            <div className="flex items-baseline gap-3">
              <span className="font-medium text-[50px] leading-none">{benchmarkStat.value}%</span>
              <span className="text-[12.5px] text-[#6B6B6B] font-medium max-w-[130px] leading-tight">{benchmarkStat.caption}</span>
            </div>
            <p className="text-[14.5px] leading-relaxed text-[#555555]">
              <RichText text={t.benchmarkCopy(result.benchmark, result.percentile, categoryLabel, result.categoryAvg.toFixed(1))} />
            </p>
          </section>

          {/* Block 3 — Four pillars */}
          <section className="py-9 border-t border-[#EFEFEF] space-y-5">
            <SectionLabel icon={<TriangleIcon />}>{t.fourSystemsHeading}</SectionLabel>
            <div className="flex flex-col gap-5">
              {pillarOrder.map((pillar) => {
                const isWeak = pillar === result.weakest;
                const value = result.pillars[pillar].pct;
                return (
                  <div key={pillar} className="grid gap-1.5">
                    <div className="flex items-baseline justify-between gap-2.5">
                      <span className="text-[14px] font-semibold">{text.pillarLabels[pillar]}</span>
                      <span className="text-[13px] text-[#8A8A8A] font-medium">{value}%</span>
                    </div>
                    {isWeak && <div className="text-[9.5px] tracking-[0.2em] uppercase font-bold" style={{ color: GOLD_DEEP }}>{t.weakestCaption}</div>}
                    <div className="h-[3px] bg-[#EDEDED] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: isWeak ? GOLD_DEEP : INK }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Block 4 — Your #1 constraint */}
          <section className="py-9 border-t border-[#EFEFEF] space-y-3.5">
            <SectionLabel>{t.bottleneckHeading}</SectionLabel>
            <h2 className="font-semibold text-[26px] leading-tight">{weakestLabel}</h2>
            <p className="text-[14.5px] leading-relaxed text-[#555555]">{t.answerSentence(clauseA, clauseB)}</p>
            <p className="border-l-[3px] pl-3.5 py-0.5 text-[14.5px] leading-relaxed text-[#555555]" style={{ borderColor: GOLD }}>
              {t.bottleneckFooter}
            </p>
          </section>

          {/* Block 5 — Cost of doing nothing */}
          <section className="py-9 border-t border-[#EFEFEF] space-y-3.5">
            <SectionLabel icon={<AlertCircleIcon />}>{t.costHeading}</SectionLabel>
            <p className="text-[14.5px] leading-relaxed text-[#555555]">{t.costIntro}</p>
            <p className="text-[12.5px] text-[#9A9A9A] font-medium">{t.costLeadIn}</p>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-[40px] leading-none">{formatCostRange(result.cost)}</span>
              <span className="text-[12px] text-[#9A9A9A] font-medium">{t.costStatSuffix}</span>
            </div>
            <p className="text-[14.5px] leading-relaxed text-[#555555]">{t.costFragment}</p>
          </section>

          {/* VSL — dark card. Drop the real file at /public/bil-vsl.mp4 and swap
              this placeholder for a <video> tag (muted autoPlay loop playsInline)
              with burned-in captions when ready. */}
          <section className="pb-9">
            <div className="relative aspect-video w-full rounded-2xl flex flex-col items-center justify-center gap-3" style={{ backgroundColor: INK }}>
              <span className="w-14 h-14 rounded-full border-2 flex items-center justify-center" style={{ borderColor: GOLD_DEEP, color: GOLD_DEEP }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              </span>
              <span className="text-xs uppercase tracking-widest font-semibold text-white/75">{t.vslPlaceholder}</span>
              <span className="text-[11px] text-white/40">{t.vslCaption}</span>
              <span className="text-[11px] text-white/30 italic">{t.vslHint}</span>
            </div>
          </section>

          {/* Block 6 — What this score can't see */}
          <section className="pb-10 space-y-4">
            <SectionLabel icon={<EyeOffIcon />}>{t.openLoopHeading}</SectionLabel>
            <ol className="flex flex-col gap-3.5">
              {t.openLoopItems(weakestLabel).map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="font-semibold text-[12.5px] text-[#B5B5B5] flex-shrink-0 w-5 pt-0.5">0{idx + 1}</span>
                  <p className="text-[14.5px] text-[#555555] leading-[1.55]">{item}</p>
                </li>
              ))}
            </ol>
            <p className="text-[14.5px] font-semibold pt-1">{t.openLoopFooter}</p>
          </section>
        </main>

        {/* Block 7 — dark CTA, full-bleed */}
        <section className="text-white px-6 py-12" style={{ backgroundColor: INK }}>
          <div className="max-w-[560px] mx-auto space-y-5">
            <div className="text-[10.5px] tracking-[0.22em] uppercase font-semibold" style={{ color: GOLD }}>{t.nextStepEyebrow}</div>
            <h2 className="font-bold text-[28px] sm:text-[32px] leading-[1.2]">{t.ctaHeadline}</h2>
            <p className="text-[14.5px] text-white/55 font-medium">{t.ctaSub}</p>
            <ul className="flex flex-col gap-3 pt-1">
              {t.ctaBullets.map((b, idx) => (
                <li key={idx} className="flex gap-2.5 text-[14px] text-white/85 leading-snug">
                  <span className="font-bold flex-shrink-0" style={{ color: GOLD }}>✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-baseline gap-2 pt-3">
              <span className="font-semibold text-[34px] leading-none">{t.ctaPrice(pricingAmount)}</span>
              <span className="text-[12px] text-white/45">{t.perSessionLabel}</span>
            </div>
            <Link
              href="/booking"
              className="w-full font-bold text-[16px] rounded-xl py-4 flex items-center justify-center transition-transform hover:-translate-y-0.5 text-center"
              style={{ backgroundColor: GOLD, color: INK }}
            >
              {t.ctaButton}
            </Link>
            <p className="text-[11px] text-white/40 text-center leading-relaxed">{t.ctaGuarantee}</p>
          </div>
        </section>

        {/* Testimonial */}
        <section className="px-6 py-14 max-w-[560px] mx-auto w-full">
          <h2 className="text-center font-semibold text-[30px] tracking-tight mb-8">{t.testimonialsHeading}</h2>
          <div className="rounded-[20px] border border-[#E8E8E8] p-6">
            <div className="flex items-center gap-4">
              <span className="w-14 h-14 rounded-full flex-shrink-0" style={{ backgroundColor: "#D9D9D9" }} />
              <div>
                <div className="text-[17px] font-bold leading-tight">{TESTIMONIAL.name}</div>
                <div className="mt-0.5 text-[12.5px] font-medium text-[#9A9A9A]">{TESTIMONIAL.role}</div>
              </div>
            </div>
            <p className="mt-5 text-[13.5px] leading-relaxed text-justify text-[#555555]">{TESTIMONIAL.text}</p>
          </div>
        </section>

        <ResultsFooter services={t.footerServices} calculator={t.footerCalculator} session={t.footerSession} connect={t.footerConnect} />
      </div>
    );
  }

  /* ── Intro / Questions / Lead capture (steps 0-9) ─────────── */
  const optionCardClass = (selected: boolean) =>
    `w-full flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all duration-200 active:scale-[0.99] ${
      selected ? "bg-white shadow-sm" : "border-[#E6E6E6] bg-white hover:bg-[#FAFAFA]"
    }`;
  const radioClass = (selected: boolean) =>
    `mt-0.5 w-[20px] h-[20px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center bg-white transition-colors ${selected ? "" : "border-[#BDBDBD]"}`;

  return (
    <div lang={lang === "hinglish" ? "hi-Latn" : "en"} className="min-h-screen bg-white flex flex-col relative overflow-x-hidden" style={{ color: INK }}>
      <Nav showLogo languageSwitcher={languageSwitcher} />

      <main className={`flex-grow pt-24 px-6 ${step < 9 ? "pb-32" : "pb-10"} max-w-3xl mx-auto w-full flex flex-col justify-start`}>
        {step <= TOTAL_QUESTIONS && (
          <div className="w-full space-y-7">
            {step === 0 && (
              <div className="text-center space-y-2.5 pt-2">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD_DEEP }}>{t.introEyebrow}</span>
                <h1 className="text-[28px] md:text-4xl font-bold tracking-tight leading-tight">{t.introTitle}</h1>
                <p className="text-[#6B6B6B] font-medium text-[15px] leading-relaxed">{t.introSub}</p>
              </div>
            )}

            {step > 0 && (
              <div className="space-y-2.5">
                <div className="flex justify-between items-end text-[12px]">
                  <span className="font-bold uppercase tracking-wider" style={{ color: GOLD_DEEP }}>{t.questionProgress(step)}</span>
                  <span className="font-medium text-[#6B6B6B]">{t.percentComplete(Math.round((step / TOTAL_QUESTIONS) * 100))}</span>
                </div>
                <div className="h-[6px] w-full bg-[#F0F0F0] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${(step / TOTAL_QUESTIONS) * 100}%`, backgroundColor: GOLD_DEEP }} />
                </div>
              </div>
            )}

            {step === 0 ? (
              <div className="border border-[#E8E8E8] p-6 md:p-8 rounded-[24px] space-y-6 bg-white">
                <div className="space-y-4">
                  <h3 className="text-[18px] font-bold leading-snug">{t.categoryHeading}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {categories.map((cat) => {
                      const selected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={optionCardClass(selected)}
                          style={selected ? { borderColor: GOLD_DEEP } : undefined}
                        >
                          <div className={radioClass(selected)} style={selected ? { borderColor: GOLD_DEEP } : undefined}>
                            <div className={`w-2.5 h-2.5 rounded-full transition-transform ${selected ? "scale-100" : "scale-0"}`} style={{ backgroundColor: GOLD_DEEP }} />
                          </div>
                          <span className="text-[14.5px] font-medium">{text.categories[cat.id]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4 pt-5 border-t border-[#EFEFEF]">
                  <h3 className="text-[18px] font-bold leading-snug">{t.revenueHeading}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {revenueBrackets.map((r) => {
                      const selected = revenueBracket === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setRevenueBracket(r.id)}
                          className={optionCardClass(selected)}
                          style={selected ? { borderColor: GOLD_DEEP } : undefined}
                        >
                          <div className={radioClass(selected)} style={selected ? { borderColor: GOLD_DEEP } : undefined}>
                            <div className={`w-2.5 h-2.5 rounded-full transition-transform ${selected ? "scale-100" : "scale-0"}`} style={{ backgroundColor: GOLD_DEEP }} />
                          </div>
                          <span className="text-[14.5px] font-medium">{text.revenue[r.id]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 pt-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#E3E3E3] bg-white text-[11px] font-semibold uppercase tracking-wider">
                  <StarIcon />
                  <span>{text.pillarLabels[canonicalQuestions[step - 1].pillar]}</span>
                </div>
                <h2 className="text-[22px] font-semibold leading-snug">{questionText(step).question}</h2>
                <div className="grid grid-cols-1 gap-3.5">
                  {questionText(step).options.map((optText, optIdx) => {
                    const isSelected = answers[step] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => selectAnswer(step, optIdx as 0 | 1 | 2)}
                        className={optionCardClass(isSelected)}
                        style={isSelected ? { borderColor: GOLD_DEEP } : undefined}
                      >
                        <div className={radioClass(isSelected)} style={isSelected ? { borderColor: GOLD_DEEP } : undefined}>
                          <div className={`w-2.5 h-2.5 rounded-full transition-transform ${isSelected ? "scale-100" : "scale-0"}`} style={{ backgroundColor: GOLD_DEEP }} />
                        </div>
                        <p className="text-[15px] font-medium leading-snug">{optText}</p>
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
                <span className="text-[12px] tracking-[0.05em] font-semibold text-[#6B6B6B] uppercase">{t.percentComplete(100)}</span>
                <span className="text-[12px] tracking-[0.05em] font-semibold uppercase" style={{ color: GOLD_DEEP }}>100%</span>
              </div>
              <div className="h-[6px] w-full bg-[#F0F0F0] rounded-full overflow-hidden">
                <div className="h-full w-full rounded-full" style={{ backgroundColor: GOLD_DEEP }} />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-[26px] md:text-[34px] font-bold tracking-tight leading-tight">{t.leadHeading}</h1>
              <p className="text-[#6B6B6B] text-[15px]">{t.leadSub}</p>
            </div>

            <form className="bg-white border border-[#E8E8E8] rounded-2xl p-7 space-y-5" onSubmit={handleSubmit}>
              {[
                { id: "bil-name", label: t.nameLabel, type: "text", placeholder: t.namePlaceholder, value: name, set: setName, hint: "" },
                { id: "bil-business", label: t.businessNameLabel, type: "text", placeholder: t.businessNamePlaceholder, value: businessName, set: setBusinessName, hint: "" },
                { id: "bil-whatsapp", label: t.whatsappLabel, type: "tel", placeholder: "+91 98XXX XXXXX", value: whatsapp, set: setWhatsapp, hint: t.whatsappHint },
                { id: "bil-email", label: t.emailLabel, type: "email", placeholder: "name@company.com", value: email, set: setEmail, hint: t.emailHint },
              ].map((f) => (
                <div key={f.id} className="space-y-2">
                  <label className="text-[11.5px] font-semibold text-[#6B6B6B] block uppercase tracking-wide" htmlFor={f.id}>{f.label}</label>
                  <input
                    id={f.id}
                    type={f.type}
                    className="w-full bg-[#F7F7F7] border border-[#E6E6E6] rounded-xl px-4 py-4 text-[15px] focus:outline-none focus:border-[#EDB605] focus:ring-1 focus:ring-[#EDB605]"
                    placeholder={f.placeholder}
                    value={f.value}
                    onChange={(e) => f.set(e.target.value)}
                  />
                  {f.hint && <p className="text-[11px] text-[#9A9A9A] ml-1">{f.hint}</p>}
                </div>
              ))}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
                style={{ backgroundColor: GOLD_DEEP, color: INK }}
              >
                {isSubmitting ? t.generating : t.showResult}
              </button>
            </form>
          </div>
        )}
      </main>

      {step <= TOTAL_QUESTIONS && (
        <div className="fixed bottom-0 left-0 w-full z-50 px-6 pb-7 pt-4 bg-white/95 backdrop-blur-lg border-t border-[#EDEDED]">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-6">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className={`flex items-center gap-2 font-semibold text-[12.5px] tracking-wider uppercase transition-all py-3 ${step === 0 ? "opacity-35 cursor-not-allowed" : "hover:opacity-70 active:scale-95"}`}
            >
              <ArrowIcon direction="left" />
              {t.back}
            </button>
            <button
              onClick={handleNext}
              className="flex items-center justify-center gap-2 font-bold text-[12.5px] tracking-widest uppercase rounded-full px-8 py-4 shadow-[0_8px_20px_rgba(237,182,5,0.35)] hover:brightness-105 active:scale-95 transition-all"
              style={{ backgroundColor: GOLD_DEEP, color: INK }}
            >
              {step === TOTAL_QUESTIONS ? t.checkScore : t.next}
              <ArrowIcon direction="right" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
