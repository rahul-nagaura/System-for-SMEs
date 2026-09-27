/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Business Independence Level (BIL) Calculator â€” V2
   Static content & configuration (no React, no logic)
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Source spec: Business_Independence_Level_v2.docx (shared 2026-09-22).
   This replaces the old 5-question BIL model entirely. Key changes
   from V1: category branches the two Data-Visibility questions,
   every option scores a fixed 0/1/2 (option index === score, no
   "Other" choice), and the weakest pillar is derived purely from
   scores â€” there is no separate "biggest problem" picker anymore.

   Related modules:
     - BIL-scoring.ts â†’ turns answers into pillar %, total BIL, level,
                         percentile, benchmark branch, cost of inaction
     - BIL-i18n.ts     â†’ English + Hinglish display text for everything
                         here (this file holds only canonical/structural
                         data â€” ids, scores, numeric ranges)
     - BIL-client.tsx  â†’ the interactive UI
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export type CategoryId = "A" | "B" | "C" | "D";
export type PillarId = "operationalEfficiency" | "humanCapital" | "customerAcquisition" | "dataVisibility";

/** The 4 business-category branches from Section 1, question i.
 *  The category picked here selects which Q7/Q8 pair (Section 3) is shown. */
export const categories: { id: CategoryId; label: string }[] = [
  { id: "A", label: "Manufacturing" },
  { id: "B", label: "Wholesale or Trading" },
  { id: "C", label: "Showroom Businesses (Jewellery, Clothing Retail, Hardware & Sanitary, etc.)" },
  { id: "D", label: "Services / QSR / Retail" },
];

/** Annual revenue / turnover brackets from Section 1, question ii.
 *  `lowerCr`/`upperCr` are in â‚¹ Crore and feed the Block 5 cost-of-inaction
 *  range. The top bracket is open-ended, so the spec fixes a â‚¹120 Cr cap
 *  to use in its place (see BIL-scoring.ts costOfInaction()). */
export type RevenueBracket = {
  id: "a" | "b" | "c" | "d" | "e";
  label: string;
  midpointCr: number;
  lowerCr: number;
  /** null = open-ended bracket (100 Cr+); use `capCr` instead. */
  upperCr: number | null;
  capCr?: number;
};

export const revenueBrackets: RevenueBracket[] = [
  { id: "a", label: "Less than 1 Cr", midpointCr: 0.5, lowerCr: 0, upperCr: 1 },
  { id: "b", label: "1 â€“ 10 Cr", midpointCr: 5.5, lowerCr: 1, upperCr: 10 },
  { id: "c", label: "10 â€“ 50 Cr", midpointCr: 30, lowerCr: 10, upperCr: 50 },
  { id: "d", label: "50 â€“ 100 Cr", midpointCr: 75, lowerCr: 50, upperCr: 100 },
  { id: "e", label: "100 Cr +", midpointCr: 120, lowerCr: 100, upperCr: null, capCr: 120 },
];

/** One scored question. `options` is always exactly 3 entries â€” the
 *  option's array INDEX is its score (0, 1 or 2), so no separate score
 *  field is needed anywhere in the app. */
export type ScoredQuestion = {
  id: number; // 1-8, matches the spec's numbering
  pillar: PillarId;
  question: string;
  options: [string, string, string];
};

/** Section 2 â€” general questions, shown to every category. 2 per pillar
 *  (Operational Efficiency, Human Capital, Customer Acquisition). Data
 *  Visibility (Q7/Q8) is category-specific â€” see `categoryQuestions`. */
export const generalQuestions: ScoredQuestion[] = [
  {
    id: 1,
    pillar: "operationalEfficiency",
    question: "Imagine you go on a family trip for 10 days and you keep your phone silent. What happens to your business?",
    options: [
      "Nothing runs without me",
      "Some work happens, but problems pile up in my absence",
      "Runs smoothly â€” I have proper teams and procedures, only rare exceptions come to me",
    ],
  },
  {
    id: 2,
    pillar: "operationalEfficiency",
    question: "You have standards to be followed â€” quality, ethics, values. Who ensures they are followed?",
    options: [
      "I personally notice and tell the staff to correct",
      "I assume the staff follow what I have taught them â€” find out only when something goes wrong",
      "Checked daily â€” I get a summary of what broke, from a manager or a record",
    ],
  },
  {
    id: 3,
    pillar: "humanCapital",
    question: "You hire a new employee. Who is responsible for training him?",
    options: [
      "He works and learns himself over time",
      "I personally train everyone myself",
      "There is training material and progress tracking, so onboarding runs without me",
    ],
  },
  {
    id: 4,
    pillar: "humanCapital",
    question: "Your most experienced employee tells you tomorrow that he is leaving in 30 days. What happens?",
    options: [
      "I am in trouble â€” a lot of work exists only in his head",
      "We will manage, but I will have to step back into his work for a few months",
      "His work is documented, and someone can be trained into it on a defined timeline",
    ],
  },
  {
    id: 5,
    pillar: "customerAcquisition",
    question: "How did your last 10 new customers find out about your business?",
    options: [
      "I was personally involved â€” calling, following up, closing the sale",
      "Sales team or staff called them using a tested pitch or script",
      "Advertising and marketing â€” digital, social media, website leads",
    ],
  },
  {
    id: 6,
    pillar: "customerAcquisition",
    question: "Of the enquiries that came in last month and did not buy â€” how many were followed up?",
    options: [
      "No record exists",
      "Staff follow up sometimes, or I chase the big ones myself",
      "Every enquiry is logged with a follow-up date",
    ],
  },
];

/** Section 3 â€” category-specific questions (Q7 & Q8), keyed by category.
 *  Both always score into Data Visibility regardless of branch. */
export const categoryQuestions: Record<CategoryId, [ScoredQuestion, ScoredQuestion]> = {
  A: [
    {
      id: 7,
      pillar: "dataVisibility",
      question: "A customer calls asking for order status. How long do you take to give him an accurate answer?",
      options: [
        "I give him an estimate from memory",
        "I call workers, check registers and the finished goods log",
        "I check the production schedule â€” status and expected completion date are already calculated",
      ],
    },
    {
      id: 8,
      pillar: "dataVisibility",
      question: "Last 3 months' production and rejection percentage â€” can you tell it right now?",
      options: [
        "No proper record exists",
        "I know it roughly, not accurate",
        "Yes â€” I see it in a report without asking anyone",
      ],
    },
  ],
  B: [
    {
      id: 7,
      pillar: "dataVisibility",
      question: "Of the stock sitting in your godown right now, how much has not moved in 6 months?",
      options: [
        "No idea â€” I would have to physically check",
        "I roughly know which items are slow, from memory",
        "I get an ageing report â€” I know the exact value stuck in slow-moving stock",
      ],
    },
    {
      id: 8,
      pillar: "dataVisibility",
      question: "How much of your money is sitting in the market right now, and how much of it is overdue past your credit terms?",
      options: [
        "I know the rough total",
        "My accountant can tell me if I ask him to prepare it",
        "I see outstanding and ageing without asking anyone",
      ],
    },
  ],
  C: [
    {
      id: 7,
      pillar: "dataVisibility",
      question: "How many people walked in yesterday, and how many bought?",
      options: [
        "No proper idea â€” nothing recorded",
        "I have an estimate in mind",
        "It is properly tracked, with a clear trend I can see",
      ],
    },
    {
      id: 8,
      pillar: "dataVisibility",
      question: "Yesterday a customer asked for something you did not have in stock. Where is that recorded?",
      options: [
        "Nowhere â€” told him no and he left",
        "Staff mention it to me verbally if it happens often",
        "Lost-sale reasons are recorded and I review them",
      ],
    },
  ],
  D: [
    {
      id: 7,
      pillar: "dataVisibility",
      question: "You are away from the shop for 3 days. How do you find out today's sales, and your staff's attendance?",
      options: [
        "No idea â€” I have to rely on trust and hope they work properly",
        "I call my manager and he tells me",
        "A proper reporting system â€” I am confident nothing goes off-system without me knowing",
      ],
    },
    {
      id: 8,
      pillar: "dataVisibility",
      question: "Yesterday's closing â€” cash, online, and what was actually sold. Who checks that those three match, and what happens when they do not?",
      options: [
        "Nobody checks it separately",
        "I check it myself when I am around",
        "A daily tally is reported to me and any shortfall is flagged with a reason",
      ],
    },
  ],
};

/** Fixed pillar order â€” also the tie-break priority when two or more
 *  pillars land on the same lowest percentage (first in this list wins). */
export const PILLAR_ORDER: PillarId[] = ["dataVisibility", "operationalEfficiency", "humanCapital", "customerAcquisition"];

export const PILLAR_LABELS: Record<PillarId, string> = {
  operationalEfficiency: "Operational Efficiency",
  humanCapital: "Human Capital",
  customerAcquisition: "Customer Acquisition",
  dataVisibility: "Data Visibility",
};

/** The 4 maturity bands. `name` is the canonical (English) key used to look
 *  up level-specific copy in BIL-i18n.ts â€” translate the copy, not this key. */
export type LevelBand = { min: number; max: number; name: string };

export const levelBands: LevelBand[] = [
  { min: 0, max: 30, name: "Owner-Trapped" },
  { min: 31, max: 55, name: "Owner-Dependent" },
  { min: 56, max: 80, name: "Team-Run" },
  { min: 81, max: 100, name: "Owner-Independent" },
];

/** Category averages from the 467-response dataset (Block 2). All four are
 *  statistically indistinguishable (~38), so they drive the benchmark
 *  branch + are shown in the copy, but are NOT the percentile headline. */
export const categoryAverages: Record<CategoryId, { average: number; n: number }> = {
  A: { average: 38.0, n: 120 },
  B: { average: 38.3, n: 144 },
  C: { average: 38.4, n: 131 },
  D: { average: 38.5, n: 203 },
};

/** Percentile lookup for the Block 2 headline. Score buckets are inclusive;
 *  the first two use a deliberately blunt "bottom X%" framing, the rest a
 *  positive "higher than X%" framing â€” this split is intentional copy from
 *  the spec, not an inconsistency, so keep both kinds distinct. */
export type PercentileEntry = { maxScore: number; kind: "bottom" | "higher"; value: number };

export const percentileTable: PercentileEntry[] = [
  { maxScore: 32, kind: "bottom", value: 11 },
  { maxScore: 34, kind: "bottom", value: 20 },
  { maxScore: 36, kind: "higher", value: 21 },
  { maxScore: 37, kind: "higher", value: 46 },
  { maxScore: 39, kind: "higher", value: 52 },
  { maxScore: 41, kind: "higher", value: 71 },
  { maxScore: 44, kind: "higher", value: 77 },
  { maxScore: 47, kind: "higher", value: 87 },
  { maxScore: 49, kind: "higher", value: 93 },
  { maxScore: 54, kind: "higher", value: 94 },
  { maxScore: Infinity, kind: "higher", value: 99 },
];
