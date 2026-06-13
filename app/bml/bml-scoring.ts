/* ─────────────────────────────────────────────────────────────
   BML Calculator — scoring logic (pure functions)
   ─────────────────────────────────────────────────────────────
   No React and no DOM here, just math. These functions take the
   user's answers and produce the numbers the UI renders. Keeping
   them pure makes the scoring easy to read and unit-test.

   Related modules:
     - bml-data.ts    → the questions/options these scores are based on
     - bml-client.tsx → calls computeDimensions() + getRingGeometry()
   ──────────────────────────────────────────────────────────── */

import { questions } from "./bml-data";

/* ── Progress-ring geometry ──────────────────────────────────── */

export const RADIUS = 52;                       // must match the SVG circle r
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
export const START_ANGLE = 1.5 * Math.PI;       // top (12 o'clock)

/** Everything needed to draw the score ring, in both SVG (dash) and
 *  Canvas (arc angles) form, plus the shared threshold color. */
export type RingGeometry = {
  fraction: number;
  dashArray: number;
  dashOffset: number;
  startAngle: number;
  endAngle: number;
  color: string;
};

/** Convert a 0–`max` score into ring geometry for the SVG + Canvas. */
export function getRingGeometry(score: number, max = 15): RingGeometry {
  const fraction = Math.max(0, Math.min(1, score / max)); // clamp 0–1

  return {
    fraction,
    // for SVG <circle>
    dashArray: CIRCUMFERENCE,
    dashOffset: CIRCUMFERENCE * (1 - fraction),
    // for Canvas arc()
    startAngle: START_ANGLE,
    endAngle: START_ANGLE + fraction * 2 * Math.PI,
    // shared color — same thresholds both paths use
    color: fraction <= 0.4 ? "#E5484D" : fraction <= 0.7 ? "#E8A93B" : "#2E9E5B",
  };
}

/** Red / amber / green band for a 0–100 percentage value. */
export function getBandColor(val: number): string {
  if (val <= 40) return "#E5484D"; // Red
  if (val <= 70) return "#E8A93B"; // Amber
  return "#2E9E5B";                // Green
}

/* ── Dimension scoring ───────────────────────────────────────── */

/** The computed result of the quiz: four dimension percentages plus
 *  the derived weakest dimension, overall percentage and 0–15 score. */
export type DimensionResult = {
  opEff: number;
  finCtrl: number;
  humCap: number;
  digMat: number;
  weakestDim: string;
  averagePercentage: number;
  displayScore: number;
};

/** Map a single "biggest problem" answer to the dimension it weakens.
 *  Returns null if the text doesn't match a known problem. */
function problemToDimension(problem: string): string | null {
  if (problem === "Staff leaves quickly" || problem === "No Organizational Structure & Reporting Mechanism") {
    return "Human Capital";
  }
  if (problem === "Koi data tracking nahi hai, only guesswork") {
    return "Financial Control";
  }
  if (problem === "Sales low hain" || problem === "Marketing aur Branding is missing") {
    return "Digital Maturity";
  }
  if (problem === "Sab kuch mere pe hi depend hai") {
    return "Operational Efficiency";
  }
  return null;
}

// Fixed dimension order — also used as the tie-breaker for the weakest gap.
const DIMENSION_ORDER = ["Operational Efficiency", "Financial Control", "Human Capital", "Digital Maturity"];

/**
 * Turn the raw answers + the user's selected biggest problems into the
 * four dimension percentages and overall score.
 *
 * Mapping of questions → dimensions:
 *   - Operational Efficiency: Q1 + Q4
 *   - Financial Control:      Q2
 *   - Human Capital:          Q3
 *   - Digital Maturity:       Q5
 *
 * The user can select MULTIPLE biggest problems. Every selected problem
 * forces its matching dimension down (below 40 and below the un-selected
 * dimensions), so selecting more problems lowers the overall score. The
 * single lowest of those forced dimensions becomes the highlighted
 * "weakest gap" — which is always one the user actually flagged.
 */
export function computeDimensions(
  answers: { [key: number]: number },
  biggestProblems: string[]
): DimensionResult {
  // Per-question scores (default to 1 when unanswered)
  const s1 = answers[1] !== undefined ? questions[0].options[answers[1]].score : 1;
  const s2 = answers[2] !== undefined ? questions[1].options[answers[2]].score : 1;
  const s3 = answers[3] !== undefined ? questions[2].options[answers[3]].score : 1;
  const s4 = answers[4] !== undefined ? questions[3].options[answers[4]].score : 1;
  const s5 = answers[5] !== undefined ? questions[4].options[answers[5]].score : 1;

  // Base scores per dimension.
  const values: Record<string, number> = {
    "Operational Efficiency": Math.round(((s1 + s4) / 6) * 50 + 35),
    "Financial Control": Math.round((s2 / 3) * 50 + 35),
    "Human Capital": Math.round((s3 / 3) * 50 + 35),
    "Digital Maturity": Math.round((s5 / 3) * 50 + 35),
  };

  // Which dimensions did the selected problems flag as weak?
  const weakDims = new Set<string>();
  for (const problem of biggestProblems) {
    const dim = problemToDimension(problem);
    if (dim) weakDims.add(dim);
  }
  // Fall back to Operational Efficiency if nothing mapped.
  if (weakDims.size === 0) weakDims.add("Operational Efficiency");

  // The lowest of the dimensions the user did NOT flag — weak dimensions
  // are pushed below this so a flagged gap always reads as the weakest.
  const nonWeak = DIMENSION_ORDER.filter(d => !weakDims.has(d));
  const nonWeakMin = nonWeak.length ? Math.min(...nonWeak.map(d => values[d])) : 100;

  // Force every flagged dimension down: below 40 and below the others.
  for (const dim of weakDims) {
    values[dim] = Math.min(values[dim], 40, nonWeakMin - 5);
  }

  // Keep every dimension within a sane 15–100 range.
  for (const dim of DIMENSION_ORDER) {
    values[dim] = Math.max(15, Math.min(100, values[dim]));
  }

  // Highlight the single lowest dimension (ties broken by DIMENSION_ORDER).
  let weakestDim = DIMENSION_ORDER[0];
  let minVal = Infinity;
  for (const dim of DIMENSION_ORDER) {
    if (values[dim] < minVal) {
      minVal = values[dim];
      weakestDim = dim;
    }
  }

  const opEff = values["Operational Efficiency"];
  const finCtrl = values["Financial Control"];
  const humCap = values["Human Capital"];
  const digMat = values["Digital Maturity"];

  const averagePercentage = Math.round((opEff + finCtrl + humCap + digMat) / 4);
  const displayScore = Math.round((averagePercentage / 100) * 15);

  return { opEff, finCtrl, humCap, digMat, weakestDim, averagePercentage, displayScore };
}
