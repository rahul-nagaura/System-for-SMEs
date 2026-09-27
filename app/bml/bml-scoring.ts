/* ─────────────────────────────────────────────────────────────
   Business Independence Level (BIL) Calculator — V2 scoring
   ─────────────────────────────────────────────────────────────
   No React and no DOM here, just math — see bml-data.ts for the
   underlying questions/brackets/tables these functions read.

   Related modules:
     - bml-data.ts    → categories, revenue brackets, questions, tables
     - bml-i18n.ts     → wraps these numbers in English/Hinglish sentences
     - bml-client.tsx → calls computeResult() and renders it
   ──────────────────────────────────────────────────────────── */

import {
  type CategoryId,
  type PillarId,
  PILLAR_ORDER,
  levelBands,
  categoryAverages,
  percentileTable,
  revenueBrackets,
  generalQuestions,
  categoryQuestions,
} from "./bml-data";

/* ── Progress-ring geometry (unchanged shape from V1, reused by the UI) ── */

export const RADIUS = 52;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
export const START_ANGLE = 1.5 * Math.PI;

export type RingGeometry = {
  fraction: number;
  dashArray: number;
  dashOffset: number;
  startAngle: number;
  endAngle: number;
  color: string;
};

export function getRingGeometry(score: number, max = 100): RingGeometry {
  const fraction = Math.max(0, Math.min(1, score / max));
  return {
    fraction,
    dashArray: CIRCUMFERENCE,
    dashOffset: CIRCUMFERENCE * (1 - fraction),
    startAngle: START_ANGLE,
    endAngle: START_ANGLE + fraction * 2 * Math.PI,
    color: fraction <= 0.3 ? "#E5484D" : fraction <= 0.55 ? "#E8A93B" : fraction <= 0.8 ? "#2E9E5B" : "#0E8F4F",
  };
}

export function getBandColor(pct: number): string {
  if (pct <= 25) return "#E5484D";
  if (pct <= 50) return "#E8A93B";
  return "#2E9E5B";
}

/* ── Answers ─────────────────────────────────────────────────── */

/** Question id (1-8) → chosen option index (0, 1 or 2 — which IS the score). */
export type Answers = Partial<Record<number, 0 | 1 | 2>>;

/** All 8 questions for a given category, in spec order (Q1..Q8). */
export function questionsForCategory(category: CategoryId) {
  return [...generalQuestions, ...categoryQuestions[category]];
}

/* ── Pillar scores ───────────────────────────────────────────── */

export type PillarResult = { pillar: PillarId; raw: number; pct: number };

/** Sum the 2 raw (0-2) answers for each pillar → 0-4 raw, and the % (0/25/50/75/100). */
export function computePillars(answers: Answers, category: CategoryId): Record<PillarId, PillarResult> {
  const qs = questionsForCategory(category);
  const rawFor = (pillar: PillarId) =>
    qs.filter((q) => q.pillar === pillar).reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);

  const build = (pillar: PillarId): PillarResult => {
    const raw = rawFor(pillar);
    return { pillar, raw, pct: Math.round((raw / 4) * 100) };
  };

  return {
    operationalEfficiency: build("operationalEfficiency"),
    humanCapital: build("humanCapital"),
    customerAcquisition: build("customerAcquisition"),
    dataVisibility: build("dataVisibility"),
  };
}

/** The weakest pillar: lowest %, ties broken by PILLAR_ORDER (earlier wins). */
export function weakestPillar(pillars: Record<PillarId, PillarResult>): PillarId {
  let best: PillarId = PILLAR_ORDER[0];
  let bestPct = Infinity;
  for (const id of PILLAR_ORDER) {
    const pct = pillars[id].pct;
    if (pct < bestPct) {
      bestPct = pct;
      best = id;
    }
  }
  return best;
}

/** The specific answer (option text index) the user gave for the weakest
 *  pillar's FIRST question that isn't already the top score — falls back to
 *  its first question if both are already maxed (nothing to "name"). Used
 *  by Block 4 ("You answered that you <...>"). */
export function weakestPillarAnswer(
  answers: Answers,
  category: CategoryId,
  pillar: PillarId
): { questionId: number; optionIndex: 0 | 1 | 2 } | null {
  const qs = questionsForCategory(category).filter((q) => q.pillar === pillar);
  const notTop = qs.find((q) => (answers[q.id] ?? 0) < 2);
  const q = notTop ?? qs[0];
  if (!q) return null;
  const optionIndex = (answers[q.id] ?? 0) as 0 | 1 | 2;
  return { questionId: q.id, optionIndex };
}

/* ── Total score + level ─────────────────────────────────────── */

/** Total BIL = round((sum of all 8 raw scores ÷ 16) × 100). */
export function computeTotalBIL(pillars: Record<PillarId, PillarResult>): number {
  const sumRaw = Object.values(pillars).reduce((s, p) => s + p.raw, 0);
  return Math.round((sumRaw / 16) * 100);
}

export function levelForScore(score: number) {
  return levelBands.find((l) => score >= l.min && score <= l.max) ?? levelBands[0];
}

export function levelIndexForScore(score: number): number {
  return levelBands.findIndex((l) => score >= l.min && score <= l.max) + 1;
}

/* ── Benchmark (Block 2) ─────────────────────────────────────── */

export function percentileFor(score: number): { kind: "bottom" | "higher"; value: number } {
  const entry = percentileTable.find((e) => score <= e.maxScore) ?? percentileTable[percentileTable.length - 1];
  return { kind: entry.kind, value: entry.value };
}

export type BenchmarkBranch = "below" | "within" | "above";

/** Which of the 3 Block-2 copy branches applies: below/at/above the
 *  category average, using a ±3-point band as "at average". */
export function benchmarkBranch(score: number, categoryAvg: number): BenchmarkBranch {
  if (score < categoryAvg - 3) return "below";
  if (score > categoryAvg + 3) return "above";
  return "within";
}

export function categoryAverageFor(category: CategoryId) {
  return categoryAverages[category];
}

/* ── Cost of inaction (Block 5) ──────────────────────────────── */

export type CostOfInaction = {
  /** true for the open-ended 100 Cr+ bracket — a single fixed figure, not a range. */
  isFixed: boolean;
  lowerCr: number;
  upperCr: number;
};

/** ~1% of annual revenue, using the bracket's own lower/upper bound (₹ Cr).
 *  The open-ended top bracket has no real upper bound, so the spec's fixed
 *  ₹120 Cr cap is used for both ends, producing a single figure instead of
 *  a range (see the "cap" note on that bracket in bml-data.ts). */
export function costOfInaction(revenueBracketId: string): CostOfInaction {
  const bracket = revenueBrackets.find((b) => b.id === revenueBracketId) ?? revenueBrackets[0];
  if (bracket.upperCr === null) {
    const cap = bracket.capCr ?? bracket.midpointCr;
    return { isFixed: true, lowerCr: cap * 0.01, upperCr: cap * 0.01 };
  }
  return { isFixed: false, lowerCr: bracket.lowerCr * 0.01, upperCr: bracket.upperCr * 0.01 };
}

/** Trim trailing zeros after rounding, e.g. 1.20 -> "1.2", 1.00 -> "1". */
function trimmedNumber(n: number, decimals: number): string {
  return n.toFixed(decimals).replace(/\.?0+$/, "");
}

/** Format a ₹ Crore figure as Lakh (< 1 Cr) or Crore, Indian-style, with
 *  no space before the unit — e.g. "₹1L", "₹1.2Cr" (matches the final design). */
export function formatInrCr(cr: number): string {
  if (cr <= 0) return "₹0";
  if (cr < 1) {
    const lakh = Math.round(cr * 100 * 10) / 10;
    return `₹${trimmedNumber(lakh, 1)}L`;
  }
  const rounded = Math.round(cr * 100) / 100;
  return `₹${trimmedNumber(rounded, 2)}Cr`;
}

/** "₹1L – ₹10L" for a bracket; "~₹1.2Cr" for the open-ended 100 Cr+ bracket. */
export function formatCostRange(cost: CostOfInaction): string {
  if (cost.isFixed) return `~${formatInrCr(cost.upperCr)}`;
  return `${formatInrCr(cost.lowerCr)} – ${formatInrCr(cost.upperCr)}`;
}

/* ── One-shot result ─────────────────────────────────────────── */

export type BILResult = {
  pillars: Record<PillarId, PillarResult>;
  totalScore: number;
  levelIndex: number;
  levelName: string;
  weakest: PillarId;
  weakestAnswer: { questionId: number; optionIndex: 0 | 1 | 2 } | null;
  percentile: { kind: "bottom" | "higher"; value: number };
  categoryAvg: number;
  benchmark: BenchmarkBranch;
  cost: CostOfInaction;
  ringGeometry: RingGeometry;
};

export function computeResult(answers: Answers, category: CategoryId, revenueBracketId: string): BILResult {
  const pillars = computePillars(answers, category);
  const totalScore = computeTotalBIL(pillars);
  const weakest = weakestPillar(pillars);
  const { average } = categoryAverageFor(category);

  return {
    pillars,
    totalScore,
    levelIndex: levelIndexForScore(totalScore),
    levelName: levelForScore(totalScore).name,
    weakest,
    weakestAnswer: weakestPillarAnswer(answers, category, weakest),
    percentile: percentileFor(totalScore),
    categoryAvg: average,
    benchmark: benchmarkBranch(totalScore, average),
    cost: costOfInaction(revenueBracketId),
    ringGeometry: getRingGeometry(totalScore),
  };
}
