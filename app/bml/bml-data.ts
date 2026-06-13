/* ─────────────────────────────────────────────────────────────
   BML Calculator — static content & configuration
   ─────────────────────────────────────────────────────────────
   This file holds ONLY data (no React, no logic). It is safe to
   import from anywhere. Edit the quiz copy, answer options, scoring
   weights, downloadable-card themes, maturity levels, and the
   per-gap result copy here.

   Related modules:
     - bml-scoring.ts → turns answers into scores/percentages
     - bml-card.ts    → draws the downloadable PNG result card
     - bml-client.tsx → the interactive UI that ties it together
   ──────────────────────────────────────────────────────────── */

/** A single selectable answer for a quiz question. `score` is the
 *  point weight added to the total when this option is chosen. */
export type Option = {
  label: string;
  text: string;
  score: number;
};

/** One step of the 5-question quiz. */
export type QuestionStep = {
  id: number;
  qNum: string;
  qLabel: string;
  question: string;
  options: Option[];
};

/** The 5 quiz questions. Order here is the order shown to the user. */
export const questions: QuestionStep[] = [
  {
    id: 1,
    qNum: "Q1/5:",
    qLabel: "OPERATIONAL MATURITY",
    question: "Agar aapko aaj 10 din family trip par jaana ho - aur phone band rahe 10 din, to aapke business ka kya hoga? *",
    options: [
      { label: "A", text: "Mere bina to kuch nhi chalta", score: 0 },
      { label: "B", text: "thoda bahut kaam ho jayega, par aate hi problems ka dher lag jaata h", score: 1 },
      { label: "C", text: "Smoothly chalta rahega - mere paas proper teams and systems hain", score: 3 },
      { label: "D", text: "Other (Please elaborate)", score: 1 },
    ],
  },
  {
    id: 2,
    qNum: "Q2/5:",
    qLabel: "DATA VISIBILITY",
    question: "Client asks for 1000+ units (ya average order quantity se jyada ka order) urgently. How fast can you check available stock and expected order completion date? *",
    options: [
      { label: "A", text: "Hours / manual counting", score: 0 },
      { label: "B", text: "30–60 mins using Tally + Excel Formulas", score: 1 },
      { label: "C", text: "Instant Inventory and Order Management Dashboards", score: 3 },
      { label: "D", text: "Other (Please specify)", score: 1 },
    ],
  },
  {
    id: 3,
    qNum: "Q3/5.",
    qLabel: "TEAM TRAINING",
    question: "Team Training - naye staff ko train kaise krte hain? *",
    options: [
      { label: "A", text: "I personally train everyone", score: 0 },
      { label: "B", text: "Some standard documents/tutorials but mostly khud hi sikhana", score: 1 },
      { label: "C", text: "Clear SOP & training system", score: 3 },
      { label: "D", text: "Other", score: 1 },
    ],
  },
  {
    id: 4,
    qNum: "Q4/5.",
    qLabel: "INTERNAL COMMUNICATION",
    question: "Internal Communication ya instructions kaise dete ho> *",
    options: [
      { label: "A", text: "Manual guide ya call/whatsapp", score: 0 },
      { label: "B", text: "Structured WhatsApp Groups by teams", score: 1 },
      { label: "C", text: "Automated Task Assignment, Reporting & Deadlines system", score: 3 },
      { label: "D", text: "Other", score: 1 },
    ],
  },
  {
    id: 5,
    qNum: "Q5/5:",
    qLabel: "LEAD GENERATION",
    question: "Lead Generation - naye customers kaise dhundhte hai? *",
    options: [
      { label: "A", text: "Only word of mouth", score: 0 },
      { label: "B", text: "Some ads / website / personal visits", score: 1 },
      { label: "C", text: "Automated lead generation funnel", score: 3 },
      { label: "D", text: "Other", score: 1 },
    ],
  },
];

/** Intro-step "biggest problem" choices. The selected value also drives
 *  which dimension is forced to be the weakest (see bml-scoring.ts). */
export const biggestProblems = [
  { label: "A", text: "Sab kuch mere pe hi depend hai" },
  { label: "B", text: "Staff leaves quickly" },
  { label: "C", text: "Koi data tracking nahi hai, only guesswork" },
  { label: "D", text: "Sales low hain" },
  { label: "E", text: "Marketing aur Branding is missing" },
  { label: "F", text: "No Organizational Structure & Reporting Mechanism" },
];

/** Intro-step monthly-revenue choices. */
export const revenueOptions = [
  { label: "A", text: "Under ₹5L" },
  { label: "B", text: "₹5L - ₹20L" },
  { label: "C", text: "₹20L - ₹50L" },
  { label: "D", text: "₹50L - ₹5Cr" },
  { label: "E", text: "Above ₹5Cr" },
];

/** Lead-capture "Type of Business" choices (single select). */
export const businessTypes = [
  { label: "A", text: "Manufacturing" },
  { label: "B", text: "Digital Service/Product" },
  { label: "C", text: "Retail" },
  { label: "D", text: "Wholesale/Trader" },
  { label: "E", text: "Other" },
];

/** Lead-capture "Are you ready to invest?" choices (single select). */
export const investmentOptions = [
  { label: "A", text: "Yes. Agar sahi solution mile, can invest both" },
  { label: "B", text: "Yes, can invest time, but not money" },
  { label: "C", text: "Yes, can invest money, but not time" },
  { label: "D", text: "No, not serious to scale" },
];

/** Color theme for the downloadable result card. */
export type CardTheme = {
  id: string;
  name: string;
  bg: string;
  text: string;
  accent: string;
  border: string;
  labelBg: string;
  labelText: string;
  trackBg: string;
  dotColor: string;
};

/** Accent themes offered in the "download your result" modal. */
export const cardThemes: CardTheme[] = [
  {
    id: "black",
    name: "Classic Black",
    bg: "#0E0E0E",
    text: "#FFFFFF",
    accent: "#FCD12A",
    border: "#222222",
    labelBg: "#FCD12A",
    labelText: "#0E0E0E",
    trackBg: "#222222",
    dotColor: "#FCD12A"
  },
  {
    id: "coral",
    name: "Brutalist Coral",
    bg: "#1A0A0E",
    text: "#FFFFFF",
    accent: "#F43F5E",
    border: "#35151D",
    labelBg: "#F43F5E",
    labelText: "#1A0A0E",
    trackBg: "#35151D",
    dotColor: "#F43F5E"
  },
  {
    id: "orange",
    name: "Sunset Orange",
    bg: "#1A0F0A",
    text: "#FFFFFF",
    accent: "#F97316",
    border: "#3B2014",
    labelBg: "#F97316",
    labelText: "#1A0F0A",
    trackBg: "#3B2014",
    dotColor: "#F97316"
  },
  {
    id: "teal",
    name: "Modern Teal",
    bg: "#0A1A18",
    text: "#FFFFFF",
    accent: "#14B8A6",
    border: "#15332F",
    labelBg: "#14B8A6",
    labelText: "#0A1A18",
    trackBg: "#15332F",
    dotColor: "#14B8A6"
  },
  {
    id: "green",
    name: "Forest Green",
    bg: "#0A1A0E",
    text: "#FFFFFF",
    accent: "#22C55E",
    border: "#14381F",
    labelBg: "#22C55E",
    labelText: "#0A1A0E",
    trackBg: "#14381F",
    dotColor: "#22C55E"
  },
  {
    id: "blue",
    name: "Midnight Blue",
    bg: "#091124",
    text: "#FFFFFF",
    accent: "#3B82F6",
    border: "#152445",
    labelBg: "#3B82F6",
    labelText: "#091124",
    trackBg: "#152445",
    dotColor: "#3B82F6"
  },
  {
    id: "violet",
    name: "Electric Violet",
    bg: "#120924",
    text: "#FFFFFF",
    accent: "#8B5CF6",
    border: "#28164F",
    labelBg: "#8B5CF6",
    labelText: "#120924",
    trackBg: "#28164F",
    dotColor: "#8B5CF6"
  },
  {
    id: "pink",
    name: "Brutalist Pink",
    bg: "#1A0A15",
    text: "#FFFFFF",
    accent: "#EC4899",
    border: "#3B142F",
    labelBg: "#EC4899",
    labelText: "#1A0A15",
    trackBg: "#3B142F",
    dotColor: "#EC4899"
  }
];

/** A maturity rung. A score (0–15) falls into exactly one band. */
export type Level = {
  min: number;
  max: number;
  name: string;
  line: string;
};

/** The 5 maturity levels (L1–L5), ordered low to high. */
export const levels: Level[] = [
  { min: 0,  max: 3,  name: "Chaotic (Founder-Trapped)", line: "Your business stops the moment you turn off your phone." },
  { min: 4,  max: 7,  name: "Owner-Dependent",           line: "Your business is running you, not the other way around." },
  { min: 8,  max: 10, name: "Organized",                 line: "You have systems — but they still need you to run them." },
  { min: 11, max: 13, name: "Systemized",                line: "Your business runs on processes, not on your presence." },
  { min: 14, max: 15, name: "Self-Running (Scalable)",   line: "Your business runs and grows without you in the room." }
];

/** Result copy shown for the user's weakest dimension. `steps` is a list
 *  of [bold lead word, rest of the sentence] tuples. */
export type GapCopy = {
  cost: string;
  line: string;
  risk: string;
  steps: [string, string][];
};

/** Per-dimension diagnosis: the cost line, the 12-month risk, and the
 *  3 concrete next steps. Keyed by the dimension name produced by
 *  computeDimensions() in bml-scoring.ts. */
export const gapCopy: Record<string, GapCopy> = {
  "Operational Efficiency": {
    cost: "20+ hours a week",
    line: "in repetitive instructions and fire-fighting.",
    risk: "If you stay in Owner-Dependent mode for another 12 months, every process still lives in your head. The day you step away, work stops — and your Operational Efficiency gap only widens as you take on more.",
    steps: [
      ["Audit", "your top 5 recurring tasks — write down everything you repeat weekly."],
      ["Document", "one SOP today for the most repeated task."],
      ["Delegate", "that task to one team member who now owns the SOP."]
    ]
  },
  "Financial Control": {
    cost: "lakhs in cash",
    line: "tied up in untracked flow and invoicing delays.",
    risk: "Without tighter Financial Control, you keep flying blind on margins. In 12 months you'll have grown revenue but not profit — and still won't know which products actually make money.",
    steps: [
      ["Track", "every rupee in and out for 30 days, one simple sheet."],
      ["Tighten", "your invoicing cycle — chase dues weekly, not monthly."],
      ["Review", "product-level margins so you stop selling at a loss."]
    ]
  },
  "Human Capital": {
    cost: "every new hire",
    line: "lost to turnover, constant retraining and role confusion.",
    risk: "With a weak Human Capital system, you keep rehiring and retraining the same roles. A year from now you'll still be the only one who knows how anything works — and good people keep leaving.",
    steps: [
      ["Define", "clear roles — who owns what, on one page."],
      ["Build", "a 1-week onboarding checklist for the next hire."],
      ["Train", "one person to fully own a process end-to-end."]
    ]
  },
  "Digital Maturity": {
    cost: "hours daily",
    line: "lost to manual work that software should be doing.",
    risk: "Staying low on Digital Maturity means manual registers, WhatsApp chaos and no real data. Competitors who systemize move faster while you spend the day copying numbers between books.",
    steps: [
      ["Pick", "one painful manual task to move into a simple tool."],
      ["Centralize", "your data — one source of truth, not 5 notebooks."],
      ["Automate", "one repetitive report so it runs without you."]
    ]
  }
};
