/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Business Independence Level (BIL) Calculator â€” V2 language content
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Data only (no React). Holds every piece of text the user READS.

   IMPORTANT â€” display vs. stored/scored values
   Everything that is *scored* lives in BIL-data.ts / BIL-scoring.ts as
   canonical (English) structural data, addressed by id/index â€” never by
   translated text. This file only controls what is *shown*, so switching
   language can never change scoring or the submitted payload.

   A few things needed a judgment call, flagged inline with "SPEC NOTE":
     - Block 4's answer paragraph combines BOTH of the weakest pillar's
       question answers into one flowing sentence (per the reference design
       shared 2026-09-22), via `answerSentence(clauseA, clauseB)` +
       `answerClauses` below. The clauses are short fragments written to
       slot into that template â€” not verbatim option text, which doesn't
       read naturally when stitched together.
     - Block 7's headline ("Raise your Independence Score in 60 minutes")
       is the literal spec copy, even though the VSL notes two sections
       later explicitly warn against implying a score moves in an hour.
       Kept as specified â€” flagged for Rahul to reconcile.
     - Below the CTA: the FINAL design (shared 2026-09-23) shows a
       Testimonials section + the site footer instead of the earlier
       proof-cards / FAQ / vault-link blocks, so those were removed. The
       testimonial itself is a single real quote taken from that design,
       kept in English in both languages (a quote is not translated).
     - The tie-break RULE (Data Visibility first) is implemented exactly as
       stated, even though both the spec's Block 3 example AND the
       reference design mark Human Capital as weakest in an identical tie
       â€” see BIL-scoring.ts. Only affects which pillar is highlighted when
       two or more are exactly tied for lowest.

   Related modules:
     - BIL-data.ts    â†’ canonical categories/brackets/questions/tables
     - BIL-scoring.ts â†’ the numbers these strings wrap
     - language-switcher.tsx â†’ the En/Hi pill + language hook (imports
       `Lang`/`LANGS` from this file)
     - BIL-client.tsx â†’ picks the right text and renders it
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

import type { CategoryId, PillarId } from "./BIL-data";
import type { BenchmarkBranch } from "./BIL-scoring";

export type Lang = "en" | "hi";

/** `short` is what the navbar pill shows for the CURRENT language. */
export const LANGS: { id: Lang; short: string; label: string }[] = [
  { id: "en", short: "En", label: "English" },
  { id: "hi", short: "à¤¹à¤¿à¤‚", label: "à¤¹à¤¿à¤¨à¥à¤¦à¥€" },
];

export interface QuestionText {
  question: string;
  options: [string, string, string];
}

/** A short fragment per option (0/1/2), written to slot into
 *  `answerSentence(clauseA, clauseB)` â€” NOT full standalone sentences. */
type ClausePair = [[string, string, string], [string, string, string]];

export interface UiText {
  languageToggleLabel: string;

  // Section 1 â€” intro (not scored)
  introEyebrow: string;
  introTitle: string;
  introSub: string;
  categoryHeading: string;
  revenueHeading: string;

  // Question steps
  questionProgress: (n: number) => string;
  percentComplete: (pct: number) => string;
  back: string;
  next: string;
  checkScore: string;

  alerts: {
    category: string;
    revenue: string;
    option: string;
    name: string;
    businessName: string;
    whatsapp: string;
    emailInvalid: string;
  };

  // Section 4 â€” lead capture
  leadHeading: string;
  leadSub: string;
  nameLabel: string;
  namePlaceholder: string;
  businessNameLabel: string;
  businessNamePlaceholder: string;
  whatsappLabel: string;
  whatsappHint: string;
  emailLabel: string;
  emailHint: string;
  generating: string;
  showResult: string;

  // Results â€” Block 1 headline (dark hero + score ring)
  resultEyebrow: string;
  heroHeadline: (name: string, levelName: string) => string;
  ringCaption: string;
  levelOfTotal: (index: number, name: string) => string;
  scrollPrompt: string;

  // Block 2 â€” benchmark
  benchmarkHeading: string;
  /** The big stat number + its caption, framed so it always reads as
   *  "how many are below/above you" regardless of bottom/higher framing. */
  benchmarkStat: (percentile: { kind: "bottom" | "higher"; value: number }) => { value: number; caption: string };
  benchmarkCopy: (branch: BenchmarkBranch, percentile: { kind: "bottom" | "higher"; value: number }, categoryLabel: string, categoryAvg: string) => string;

  // Block 3 â€” four systems
  fourSystemsHeading: string;
  weakestCaption: string;

  // Block 4 â€” bottleneck
  bottleneckHeading: string;
  answerSentence: (clauseA: string, clauseB: string) => string;
  bottleneckFooter: string;

  // Block 5 â€” cost of inaction
  costHeading: string;
  costIntro: string;
  costLeadIn: string;
  costStatSuffix: string;
  costFragment: string;

  // Block 6 â€” open the loop
  openLoopHeading: string;
  openLoopItems: (pillarLabel: string) => [string, string, string];
  openLoopFooter: string;

  // VSL
  vslPlaceholder: string;
  vslCaption: string;
  vslHint: string;

  // Block 7 â€” CTA
  nextStepEyebrow: string;
  ctaHeadline: string;
  ctaSub: string;
  ctaBullets: string[];
  /** Wraps the price pulled from GlobalSettings (see BIL-client.tsx) â€” never a fixed string. */
  ctaPrice: (amount: string) => string;
  perSessionLabel: string;
  ctaGuarantee: string;
  ctaButton: string;

  // Below the CTA â€” testimonials + footer labels
  testimonialsHeading: string;
  footerServices: string;
  footerCalculator: string;
  footerSession: string;
  footerConnect: string;
}

export interface BilText {
  ui: UiText;
  categories: Record<CategoryId, string>;
  revenue: Record<string, string>;
  pillarLabels: Record<PillarId, string>;
  levelNames: Record<string, string>; // canonical level name -> the name shown to the user
  levelTaglines: Record<string, string>; // keyed by canonical level name
  generalQuestions: QuestionText[]; // index-aligned with data.generalQuestions
  categoryQuestions: Record<CategoryId, [QuestionText, QuestionText]>;
  /** Block 4 clause fragments â€” see `answerSentence` above. Keyed by pillar;
   *  Data Visibility varies by category since its questions do. */
  answerClauses: {
    operationalEfficiency: ClausePair;
    humanCapital: ClausePair;
    customerAcquisition: ClausePair;
    dataVisibility: Record<CategoryId, ClausePair>;
  };
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• ENGLISH â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

const en: BilText = {
  ui: {
    languageToggleLabel: "Switch language",

    introEyebrow: "3,000+ SME owners have checked their score",
    introTitle: "Business Independence Level Calculator",
    introSub: "Find out your weakest system, the reason behind it, and what it's costing you â€” under 2 minutes.",
    categoryHeading: "Select your business category *",
    revenueHeading: "Select your annual revenue / turnover range *",

    questionProgress: (n) => `Question 0${n} of 08`,
    percentComplete: (pct) => `${pct}% Complete`,
    back: "Back",
    next: "Next",
    checkScore: "Get my score",

    alerts: {
      category: "Please select your business category",
      revenue: "Please select your annual revenue range",
      option: "Please select an option",
      name: "Please enter your name",
      businessName: "Please enter your business / firm name",
      whatsapp: "Please enter a valid WhatsApp number",
      emailInvalid: "Please enter a valid email address",
    },

    leadHeading: "Your BIL Score is ready",
    leadSub: "Just one last step:",
    nameLabel: "What is your name *",
    namePlaceholder: "e.g. Rajesh Kumar",
    businessNameLabel: "What is your business / firm name *",
    businessNamePlaceholder: "e.g. Apex Manufacturing",
    whatsappLabel: "Your business contact number (WhatsApp) *",
    whatsappHint: "We'll send your detailed breakdown here.",
    emailLabel: "Email ID (optional)",
    emailHint: "Only if you'd like a copy by email too.",
    generating: "Calculating your score...",
    showResult: "Show my result",

    resultEyebrow: "Your Score",
    heroHeadline: (name, levelName) => `${name}, your business is ${levelName}.`,
    ringCaption: "Out of 100",
    levelOfTotal: (index, name) => `Level ${index} of 4 Â· ${name}`,
    scrollPrompt: "There is a 60-second explanation further down this page.",

    benchmarkHeading: "Benchmark",
    benchmarkStat: (percentile) =>
      percentile.kind === "bottom"
        ? { value: 100 - percentile.value, caption: "of businesses score higher than you" }
        : { value: percentile.value, caption: "of businesses score lower than you" },
    benchmarkCopy: (branch, percentile, categoryLabel, categoryAvg) => {
      const opening =
        percentile.kind === "bottom"
          ? `You are in the bottom ${percentile.value}% of the 3,000+ businesses that have taken this.`
          : `You scored higher than ${percentile.value}% of the 3,000+ businesses that have taken this.`;
      if (branch === "below") {
        return `${opening} The average ${categoryLabel} business scores ${categoryAvg}. **You are below your own industry.** Most owners here assume the problem is staff quality. It usually isn't.`;
      }
      if (branch === "within") {
        return `${opening} That puts you right at the industry average. **That is not a compliment.** In our data, **94% of businesses land at Level 2.** The average business in your industry cannot run without its owner.`;
      }
      return `${opening} That's above the average for ${categoryLabel}. The gap between you and Level 4 is smaller than you think, and it is **usually one system, not four.**`;
    },

    fourSystemsHeading: "The four pillars",
    weakestCaption: "Weakest system",

    bottleneckHeading: "Your **#1** constraint",
    answerSentence: (clauseA, clauseB) => `You answered that ${clauseA} â€” and that ${clauseB}.`,
    bottleneckFooter: "This is fixable. See the 60s video below.",

    costHeading: "Cost of doing nothing",
    costIntro: "Across 3,000+ SMEs we found the same pattern: a business without systems quietly loses at least 1% of its revenue every year.",
    costLeadIn: "At your revenue level, that is:",
    costStatSuffix: "every year",
    costFragment: "Dead stock. Manual calculations. Hot leads forgotten â€” because there was no system to catch it.",

    openLoopHeading: "What this score can't see",
    openLoopItems: (pillarLabel) => [
      "Which process to fix first. Fix the wrong one and you lose three months.",
      `Whether your ${pillarLabel} problem is really a ${pillarLabel} problem â€” or a symptom of something upstream.`,
      "What your business specifically needs, versus what a form can infer.",
    ],
    openLoopFooter: "These need someone to look at your actual business.",

    vslPlaceholder: "VSL placeholder",
    vslCaption: "60 sec Â· muted autoplay Â· burned-in captions",
    vslHint: "( real video appears here )",

    nextStepEyebrow: "The next step",
    ctaHeadline: "Raise your Independence Score in 60 minutes.",
    ctaSub: "A live working audit on your business â€” not generic advice.",
    ctaBullets: [
      "A clear understanding of how systems make a business owner-independent",
      "Your real bottleneck identified, with a system to fix it",
      "A one-page 90-day independence roadmap",
      "Two QR-based checkpoints installed in your business â€” your staff starts reporting this week",
      "30 days of daily WhatsApp reports â€” what happened, what looks wrong, what to do",
    ],
    ctaPrice: (amount) => `â‚¹${amount}`,
    perSessionLabel: "one session",
    ctaGuarantee: "Full refund if your first daily report does not reach your WhatsApp within 48 hours of the session.",
    ctaButton: "Book your session",

    testimonialsHeading: "Testimonials",
    footerServices: "Our Services",
    footerCalculator: "Business Independence Level Calculator",
    footerSession: "Systems Strategy Session",
    footerConnect: "Connect with us",
  },

  categories: {
    A: "Manufacturing",
    B: "Wholesale or Trading",
    C: "Showroom Businesses (Jewellery, Clothing Retail, Hardware & Sanitary, etc.)",
    D: "Services / QSR / Retail",
  },
  revenue: {
    a: "Less than 1 Cr",
    b: "1 â€“ 10 Cr",
    c: "10 â€“ 50 Cr",
    d: "50 â€“ 100 Cr",
    e: "100 Cr +",
  },
  pillarLabels: {
    operationalEfficiency: "Operational Efficiency",
    humanCapital: "Human Capital",
    customerAcquisition: "Customer Acquisition",
    dataVisibility: "Data Visibility",
  },
  levelNames: {
    "Owner-Trapped": "Owner-Trapped",
    "Owner-Dependent": "Owner-Dependent",
    "Team-Run": "Team-Run",
    "Owner-Independent": "Owner-Independent",
  },
  levelTaglines: {
    "Owner-Trapped": "The business stops when you stop.",
    "Owner-Dependent": "Your business runs while you watch it. It breaks when you look away.",
    "Team-Run": "Your team handles most of the day. You handle the exceptions.",
    "Owner-Independent": "You are optional to daily operations. It's time to scale.",
  },

  generalQuestions: [
    {
      question: "Imagine you go on a family trip for 10 days and you keep your phone silent. What happens to your business?",
      options: [
        "Nothing runs without me",
        "Some work happens, but problems pile up in my absence",
        "Runs smoothly â€” I have proper teams and procedures, only rare exceptions come to me",
      ],
    },
    {
      question: "You have standards to be followed â€” quality, ethics, values. Who ensures they are followed?",
      options: [
        "I personally notice and tell the staff to correct",
        "I assume the staff follow what I have taught them â€” find out only when something goes wrong",
        "Checked daily â€” I get a summary of what broke, from a manager or a record",
      ],
    },
    {
      question: "You hire a new employee. Who is responsible for training him?",
      options: [
        "He works and learns himself over time",
        "I personally train everyone myself",
        "There is training material and progress tracking, so onboarding runs without me",
      ],
    },
    {
      question: "Your most experienced employee tells you tomorrow that he is leaving in 30 days. What happens?",
      options: [
        "I am in trouble â€” a lot of work exists only in his head",
        "We will manage, but I will have to step back into his work for a few months",
        "His work is documented, and someone can be trained into it on a defined timeline",
      ],
    },
    {
      question: "How did your last 10 new customers find out about your business?",
      options: [
        "I was personally involved â€” calling, following up, closing the sale",
        "Sales team or staff called them using a tested pitch or script",
        "Advertising and marketing â€” digital, social media, website leads",
      ],
    },
    {
      question: "Of the enquiries that came in last month and did not buy â€” how many were followed up?",
      options: [
        "No record exists",
        "Staff follow up sometimes, or I chase the big ones myself",
        "Every enquiry is logged with a follow-up date",
      ],
    },
  ],

  categoryQuestions: {
    A: [
      {
        question: "A customer calls asking for order status. How long do you take to give him an accurate answer?",
        options: [
          "I give him an estimate from memory",
          "I call workers, check registers and the finished goods log",
          "I check the production schedule â€” status and expected completion date are already calculated",
        ],
      },
      {
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
        question: "Of the stock sitting in your godown right now, how much has not moved in 6 months?",
        options: [
          "No idea â€” I would have to physically check",
          "I roughly know which items are slow, from memory",
          "I get an ageing report â€” I know the exact value stuck in slow-moving stock",
        ],
      },
      {
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
        question: "How many people walked in yesterday, and how many bought?",
        options: [
          "No proper idea â€” nothing recorded",
          "I have an estimate in mind",
          "It is properly tracked, with a clear trend I can see",
        ],
      },
      {
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
        question: "You are away from the shop for 3 days. How do you find out today's sales, and your staff's attendance?",
        options: [
          "No idea â€” I have to rely on trust and hope they work properly",
          "I call my manager and he tells me",
          "A proper reporting system â€” I am confident nothing goes off-system without me knowing",
        ],
      },
      {
        question: "Yesterday's closing â€” cash, online, and what was actually sold. Who checks that those three match, and what happens when they do not?",
        options: [
          "Nobody checks it separately",
          "I check it myself when I am around",
          "A daily tally is reported to me and any shortfall is flagged with a reason",
        ],
      },
    ],
  },

  answerClauses: {
    operationalEfficiency: [
      [
        "nothing in your business moves unless you're personally checking on it",
        "some work still happens without you, but problems pile up fast in your absence",
        "your team and procedures keep things running smoothly, with only rare exceptions reaching you",
      ],
      [
        "you personally have to notice and correct staff yourself",
        "you assume staff follow what you've taught them, and find out only when something breaks",
        "you get a daily summary of what broke, from a manager or a record",
      ],
    ],
    humanCapital: [
      [
        "new hires mostly learn by working things out themselves",
        "you personally train every new hire yourself",
        "training material and progress tracking mean onboarding runs without you",
      ],
      [
        "if your most experienced person left, a lot of the business would leave with them",
        "you'd have to step back into their work for a few months if they left",
        "their work is documented, so someone could be trained into it on a set timeline",
      ],
    ],
    customerAcquisition: [
      [
        "you were personally involved in closing your last 10 customers",
        "your sales team closed them using a tested pitch or script",
        "advertising and marketing brought them in on their own",
      ],
      [
        "there's no record of enquiries that didn't convert",
        "follow-up on enquiries happens sometimes, or you chase the big ones yourself",
        "every enquiry is logged with a follow-up date",
      ],
    ],
    dataVisibility: {
      A: [
        [
          "you can only give a customer an estimate from memory on order status",
          "checking order status means calling workers and checking registers",
          "your production schedule already shows status and expected completion",
        ],
        [
          "there's no proper record of your production and rejection percentage",
          "you only know your production and rejection numbers roughly",
          "you see it in a report without asking anyone",
        ],
      ],
      B: [
        [
          "you'd have to physically check to know what stock hasn't moved in 6 months",
          "you only roughly know which items are slow-moving, from memory",
          "an ageing report shows you exactly what's stuck in slow-moving stock",
        ],
        [
          "you only know the rough total of money sitting in the market",
          "your accountant can tell you outstanding dues, if you ask",
          "you see outstanding and ageing amounts without asking anyone",
        ],
      ],
      C: [
        [
          "you have no proper idea how many people walked in or bought yesterday",
          "you only have an estimate of walk-ins and sales in mind",
          "walk-ins and sales are properly tracked, with a clear trend you can see",
        ],
        [
          "a lost sale from missing stock goes unrecorded",
          "staff mention lost sales to you verbally, if it happens often",
          "lost-sale reasons are recorded and you review them",
        ],
      ],
      D: [
        [
          "you'd have to rely on trust to know sales and attendance if you were away",
          "your manager calls to tell you sales and attendance",
          "a proper reporting system means nothing goes off-system without you knowing",
        ],
        [
          "nobody separately checks that cash, online and actual sales match",
          "you check it yourself, when you're around",
          "a daily tally is reported to you, with any shortfall flagged",
        ],
      ],
    },
  },
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• HINDI (à¤¦à¥‡à¤µà¤¨à¤¾à¤—à¤°à¥€) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

const hi: BilText = {
  ui: {
    languageToggleLabel: "à¤­à¤¾à¤·à¤¾ à¤¬à¤¦à¤²à¥‡à¤‚",

    introEyebrow: "3,000+ SME à¤®à¤¾à¤²à¤¿à¤• à¤…à¤ªà¤¨à¤¾ à¤¸à¥à¤•à¥‹à¤° à¤šà¥‡à¤• à¤•à¤° à¤šà¥à¤•à¥‡ à¤¹à¥ˆà¤‚",
    introTitle: "à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤‡à¤‚à¤¡à¤¿à¤ªà¥‡à¤‚à¤¡à¥‡à¤‚à¤¸ à¤²à¥‡à¤µà¤² à¤•à¥ˆà¤²à¤•à¥à¤²à¥‡à¤Ÿà¤°",
    introSub: "à¤œà¤¾à¤¨à¤¿à¤ à¤†à¤ªà¤•à¤¾ à¤¸à¤¬à¤¸à¥‡ à¤•à¤®à¤œà¤¼à¥‹à¤° à¤¸à¤¿à¤¸à¥à¤Ÿà¤® à¤•à¥Œà¤¨-à¤¸à¤¾ à¤¹à¥ˆ, à¤‰à¤¸à¤•à¥€ à¤µà¤œà¤¹ à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ, à¤”à¤° à¤µà¤¹ à¤†à¤ªà¤•à¥‹ à¤•à¤¿à¤¤à¤¨à¤¾ à¤®à¤¹à¤à¤—à¤¾ à¤ªà¤¡à¤¼ à¤°à¤¹à¤¾ à¤¹à¥ˆ â€” 2 à¤®à¤¿à¤¨à¤Ÿ à¤¸à¥‡ à¤­à¥€ à¤•à¤® à¤®à¥‡à¤‚à¥¤",
    categoryHeading: "à¤…à¤ªà¤¨à¥‡ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤•à¥€ à¤•à¥ˆà¤Ÿà¥‡à¤—à¤°à¥€ à¤šà¥à¤¨à¥‡à¤‚ *",
    revenueHeading: "à¤…à¤ªà¤¨à¤¾ à¤¸à¤¾à¤²à¤¾à¤¨à¤¾ à¤°à¥‡à¤µà¥‡à¤¨à¥à¤¯à¥‚ / à¤Ÿà¤°à¥à¤¨à¤“à¤µà¤° à¤°à¥‡à¤‚à¤œ à¤šà¥à¤¨à¥‡à¤‚ *",

    questionProgress: (n) => `à¤¸à¤µà¤¾à¤² 0${n} / 08`,
    percentComplete: (pct) => `${pct}% à¤ªà¥‚à¤°à¤¾`,
    back: "à¤µà¤¾à¤ªà¤¸",
    next: "à¤†à¤—à¥‡",
    checkScore: "à¤®à¥‡à¤°à¤¾ à¤¸à¥à¤•à¥‹à¤° à¤¦à¥‡à¤–à¥‡à¤‚",

    alerts: {
      category: "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤…à¤ªà¤¨à¥‡ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤•à¥€ à¤•à¥ˆà¤Ÿà¥‡à¤—à¤°à¥€ à¤šà¥à¤¨à¥‡à¤‚",
      revenue: "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤…à¤ªà¤¨à¤¾ à¤¸à¤¾à¤²à¤¾à¤¨à¤¾ à¤°à¥‡à¤µà¥‡à¤¨à¥à¤¯à¥‚ à¤°à¥‡à¤‚à¤œ à¤šà¥à¤¨à¥‡à¤‚",
      option: "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤à¤• à¤µà¤¿à¤•à¤²à¥à¤ª à¤šà¥à¤¨à¥‡à¤‚",
      name: "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤…à¤ªà¤¨à¤¾ à¤¨à¤¾à¤® à¤²à¤¿à¤–à¥‡à¤‚",
      businessName: "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤…à¤ªà¤¨à¥‡ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ / à¤«à¤¼à¤°à¥à¤® à¤•à¤¾ à¤¨à¤¾à¤® à¤²à¤¿à¤–à¥‡à¤‚",
      whatsapp: "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤¸à¤¹à¥€ WhatsApp à¤¨à¤‚à¤¬à¤° à¤²à¤¿à¤–à¥‡à¤‚",
      emailInvalid: "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤¸à¤¹à¥€ à¤ˆà¤®à¥‡à¤² à¤ªà¤¤à¤¾ à¤²à¤¿à¤–à¥‡à¤‚",
    },

    leadHeading: "à¤†à¤ªà¤•à¤¾ BIL à¤¸à¥à¤•à¥‹à¤° à¤¤à¥ˆà¤¯à¤¾à¤° à¤¹à¥ˆ",
    leadSub: "à¤¬à¤¸ à¤à¤• à¤†à¤–à¤¼à¤¿à¤°à¥€ à¤•à¤¦à¤®:",
    nameLabel: "à¤†à¤ªà¤•à¤¾ à¤¨à¤¾à¤® à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ *",
    namePlaceholder: "à¤œà¥ˆà¤¸à¥‡: à¤°à¤¾à¤œà¥‡à¤¶ à¤•à¥à¤®à¤¾à¤°",
    businessNameLabel: "à¤†à¤ªà¤•à¥‡ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ / à¤«à¤¼à¤°à¥à¤® à¤•à¤¾ à¤¨à¤¾à¤® à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ *",
    businessNamePlaceholder: "à¤œà¥ˆà¤¸à¥‡: à¤à¤ªà¥‡à¤•à¥à¤¸ à¤®à¥ˆà¤¨à¥à¤¯à¥à¤«à¥ˆà¤•à¥à¤šà¤°à¤¿à¤‚à¤—",
    whatsappLabel: "à¤†à¤ªà¤•à¤¾ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤¸à¤‚à¤ªà¤°à¥à¤• à¤¨à¤‚à¤¬à¤° (WhatsApp) *",
    whatsappHint: "à¤†à¤ªà¤•à¥€ à¤µà¤¿à¤¸à¥à¤¤à¥ƒà¤¤ à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿ à¤¹à¤® à¤¯à¤¹à¥€à¤‚ à¤­à¥‡à¤œà¥‡à¤‚à¤—à¥‡à¥¤",
    emailLabel: "à¤ˆà¤®à¥‡à¤² ID (à¤µà¥ˆà¤•à¤²à¥à¤ªà¤¿à¤•)",
    emailHint: "à¤¸à¤¿à¤°à¥à¤«à¤¼ à¤¤à¤¬ à¤­à¤°à¥‡à¤‚ à¤œà¤¬ à¤†à¤ª à¤ˆà¤®à¥‡à¤² à¤ªà¤° à¤­à¥€ à¤•à¥‰à¤ªà¥€ à¤šà¤¾à¤¹à¤¤à¥‡ à¤¹à¥‹à¤‚à¥¤",
    generating: "à¤†à¤ªà¤•à¤¾ à¤¸à¥à¤•à¥‹à¤° à¤¨à¤¿à¤•à¤¾à¤²à¤¾ à¤œà¤¾ à¤°à¤¹à¤¾ à¤¹à¥ˆ...",
    showResult: "à¤®à¥‡à¤°à¤¾ à¤°à¤¿à¤œà¤¼à¤²à¥à¤Ÿ à¤¦à¤¿à¤–à¤¾à¤à¤",

    resultEyebrow: "à¤†à¤ªà¤•à¤¾ à¤¸à¥à¤•à¥‹à¤°",
    heroHeadline: (name, levelName) => `${name}, à¤†à¤ªà¤•à¤¾ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ ${levelName} à¤¹à¥ˆà¥¤`,
    ringCaption: "100 à¤®à¥‡à¤‚ à¤¸à¥‡",
    levelOfTotal: (index, name) => `à¤²à¥‡à¤µà¤² ${index} / 4 Â· ${name}`,
    scrollPrompt: "à¤‡à¤¸à¤•à¤¾ 60 à¤¸à¥‡à¤•à¤‚à¤¡ à¤•à¤¾ à¤¸à¥à¤ªà¤·à¥à¤Ÿà¥€à¤•à¤°à¤£ à¤‡à¤¸à¥€ à¤ªà¥‡à¤œ à¤ªà¤° à¤¨à¥€à¤šà¥‡ à¤¹à¥ˆà¥¤",

    benchmarkHeading: "à¤¬à¥‡à¤‚à¤šà¤®à¤¾à¤°à¥à¤•",
    benchmarkStat: (percentile) =>
      percentile.kind === "bottom"
        ? { value: 100 - percentile.value, caption: "à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤†à¤ªà¤¸à¥‡ à¤œà¤¼à¥à¤¯à¤¾à¤¦à¤¾ à¤¸à¥à¤•à¥‹à¤° à¤•à¤°à¤¤à¥‡ à¤¹à¥ˆà¤‚" }
        : { value: percentile.value, caption: "à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤†à¤ªà¤¸à¥‡ à¤•à¤® à¤¸à¥à¤•à¥‹à¤° à¤•à¤°à¤¤à¥‡ à¤¹à¥ˆà¤‚" },
    benchmarkCopy: (branch, percentile, categoryLabel, categoryAvg) => {
      const opening =
        percentile.kind === "bottom"
          ? `à¤†à¤ª à¤¯à¤¹ à¤Ÿà¥‡à¤¸à¥à¤Ÿ à¤¦à¥‡à¤¨à¥‡ à¤µà¤¾à¤²à¥‡ 3,000+ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤®à¥‡à¤‚ à¤¸à¥‡ à¤¸à¤¬à¤¸à¥‡ à¤¨à¥€à¤šà¥‡ à¤•à¥‡ ${percentile.value}% à¤®à¥‡à¤‚ à¤¹à¥ˆà¤‚à¥¤`
          : `à¤†à¤ªà¤¨à¥‡ à¤¯à¤¹ à¤Ÿà¥‡à¤¸à¥à¤Ÿ à¤¦à¥‡à¤¨à¥‡ à¤µà¤¾à¤²à¥‡ 3,000+ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤®à¥‡à¤‚ à¤¸à¥‡ ${percentile.value}% à¤¸à¥‡ à¤œà¤¼à¥à¤¯à¤¾à¤¦à¤¾ à¤¸à¥à¤•à¥‹à¤° à¤•à¤¿à¤¯à¤¾ à¤¹à¥ˆà¥¤`;
      if (branch === "below") {
        return `${opening} à¤”à¤¸à¤¤ ${categoryLabel} à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤•à¤¾ à¤¸à¥à¤•à¥‹à¤° ${categoryAvg} à¤¹à¥ˆà¥¤ **à¤†à¤ª à¤…à¤ªà¤¨à¥€ à¤¹à¥€ à¤‡à¤‚à¤¡à¤¸à¥à¤Ÿà¥à¤°à¥€ à¤¸à¥‡ à¤ªà¥€à¤›à¥‡ à¤¹à¥ˆà¤‚à¥¤** à¤¯à¤¹à¤¾à¤ à¤œà¤¼à¥à¤¯à¤¾à¤¦à¤¾à¤¤à¤° à¤®à¤¾à¤²à¤¿à¤• à¤¸à¥‹à¤šà¤¤à¥‡ à¤¹à¥ˆà¤‚ à¤•à¤¿ à¤¸à¤®à¤¸à¥à¤¯à¤¾ à¤¸à¥à¤Ÿà¤¾à¤«à¤¼ à¤•à¥€ à¤•à¥à¤µà¤¾à¤²à¤¿à¤Ÿà¥€ à¤•à¥€ à¤¹à¥ˆà¥¤ à¤…à¤•à¥à¤¸à¤° à¤à¤¸à¤¾ à¤¨à¤¹à¥€à¤‚ à¤¹à¥‹à¤¤à¤¾à¥¤`;
      }
      if (branch === "within") {
        return `${opening} à¤¯à¤¾à¤¨à¥€ à¤†à¤ª à¤ à¥€à¤• à¤‡à¤‚à¤¡à¤¸à¥à¤Ÿà¥à¤°à¥€ à¤•à¥‡ à¤”à¤¸à¤¤ à¤ªà¤° à¤¹à¥ˆà¤‚à¥¤ **à¤¯à¤¹ à¤•à¥‹à¤ˆ à¤¤à¤¾à¤°à¥€à¤«à¤¼ à¤•à¥€ à¤¬à¤¾à¤¤ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆà¥¤** à¤¹à¤®à¤¾à¤°à¥‡ à¤¡à¥‡à¤Ÿà¤¾ à¤®à¥‡à¤‚ **94% à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤²à¥‡à¤µà¤² 2 à¤ªà¤° à¤…à¤Ÿà¤•à¥‡ à¤¹à¥à¤ à¤¹à¥ˆà¤‚à¥¤** à¤†à¤ªà¤•à¥€ à¤‡à¤‚à¤¡à¤¸à¥à¤Ÿà¥à¤°à¥€ à¤•à¤¾ à¤”à¤¸à¤¤ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤…à¤ªà¤¨à¥‡ à¤®à¤¾à¤²à¤¿à¤• à¤•à¥‡ à¤¬à¤¿à¤¨à¤¾ à¤¨à¤¹à¥€à¤‚ à¤šà¤² à¤¸à¤•à¤¤à¤¾à¥¤`;
      }
      return `${opening} à¤¯à¤¹ ${categoryLabel} à¤•à¥‡ à¤”à¤¸à¤¤ à¤¸à¥‡ à¤œà¤¼à¥à¤¯à¤¾à¤¦à¤¾ à¤¹à¥ˆà¥¤ à¤†à¤ªà¤•à¥‡ à¤”à¤° à¤²à¥‡à¤µà¤² 4 à¤•à¥‡ à¤¬à¥€à¤š à¤•à¤¾ à¤«à¤¼à¤¾à¤¸à¤²à¤¾ à¤†à¤ªà¤•à¥€ à¤¸à¥‹à¤š à¤¸à¥‡ à¤›à¥‹à¤Ÿà¤¾ à¤¹à¥ˆ, à¤”à¤° **à¤…à¤•à¥à¤¸à¤° à¤µà¤¹ à¤à¤• à¤¹à¥€ à¤¸à¤¿à¤¸à¥à¤Ÿà¤® à¤¹à¥‹à¤¤à¤¾ à¤¹à¥ˆ, à¤šà¤¾à¤° à¤¨à¤¹à¥€à¤‚à¥¤**`;
    },

    fourSystemsHeading: "à¤šà¤¾à¤° à¤¸à¥à¤¤à¤‚à¤­",
    weakestCaption: "à¤¸à¤¬à¤¸à¥‡ à¤•à¤®à¤œà¤¼à¥‹à¤° à¤¸à¤¿à¤¸à¥à¤Ÿà¤®",

    bottleneckHeading: "à¤†à¤ªà¤•à¥€ **#1** à¤°à¥à¤•à¤¾à¤µà¤Ÿ",
    answerSentence: (clauseA, clauseB) => `à¤†à¤ªà¤¨à¥‡ à¤¬à¤¤à¤¾à¤¯à¤¾ à¤•à¤¿ ${clauseA} â€” à¤”à¤° à¤¯à¤¹ à¤­à¥€ à¤•à¤¿ ${clauseB}à¥¤`,
    bottleneckFooter: "à¤¯à¤¹ à¤ à¥€à¤• à¤¹à¥‹ à¤¸à¤•à¤¤à¤¾ à¤¹à¥ˆà¥¤ à¤¨à¥€à¤šà¥‡ 60 à¤¸à¥‡à¤•à¤‚à¤¡ à¤•à¤¾ à¤µà¥€à¤¡à¤¿à¤¯à¥‹ à¤¦à¥‡à¤–à¥‡à¤‚à¥¤",

    costHeading: "à¤•à¥à¤› à¤¨ à¤•à¤°à¤¨à¥‡ à¤•à¥€ à¤•à¥€à¤®à¤¤",
    costIntro: "3,000+ SME à¤®à¥‡à¤‚ à¤¹à¤®à¥‡à¤‚ à¤à¤• à¤¹à¥€ à¤ªà¥ˆà¤Ÿà¤°à¥à¤¨ à¤®à¤¿à¤²à¤¾: à¤¬à¤¿à¤¨à¤¾ à¤¸à¤¿à¤¸à¥à¤Ÿà¤® à¤•à¥‡ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤šà¥à¤ªà¤šà¤¾à¤ª à¤…à¤ªà¤¨à¥‡ à¤°à¥‡à¤µà¥‡à¤¨à¥à¤¯à¥‚ à¤•à¤¾ à¤•à¤® à¤¸à¥‡ à¤•à¤® 1% à¤¹à¤° à¤¸à¤¾à¤² à¤–à¥‹ à¤¦à¥‡à¤¤à¤¾ à¤¹à¥ˆà¥¤",
    costLeadIn: "à¤†à¤ªà¤•à¥‡ à¤°à¥‡à¤µà¥‡à¤¨à¥à¤¯à¥‚ à¤²à¥‡à¤µà¤² à¤ªà¤°, à¤¯à¤¹ à¤¹à¥ˆ:",
    costStatSuffix: "à¤¹à¤° à¤¸à¤¾à¤²",
    costFragment: "à¤¡à¥‡à¤¡ à¤¸à¥à¤Ÿà¥‰à¤•à¥¤ à¤¹à¤¾à¤¥ à¤¸à¥‡ à¤•à¤¿à¤ à¤—à¤ à¤¹à¤¿à¤¸à¤¾à¤¬à¥¤ à¤­à¥‚à¤²à¥‡ à¤¹à¥à¤ à¤¹à¥‰à¤Ÿ à¤²à¥€à¤¡ â€” à¤•à¥à¤¯à¥‹à¤‚à¤•à¤¿ à¤‡à¤¨à¥à¤¹à¥‡à¤‚ à¤ªà¤•à¤¡à¤¼à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤•à¥‹à¤ˆ à¤¸à¤¿à¤¸à¥à¤Ÿà¤® à¤¥à¤¾ à¤¹à¥€ à¤¨à¤¹à¥€à¤‚à¥¤",

    openLoopHeading: "à¤¯à¤¹ à¤¸à¥à¤•à¥‹à¤° à¤•à¥à¤¯à¤¾ à¤¨à¤¹à¥€à¤‚ à¤¦à¤¿à¤–à¤¾ à¤¸à¤•à¤¤à¤¾",
    openLoopItems: (pillarLabel) => [
      "à¤¸à¤¬à¤¸à¥‡ à¤ªà¤¹à¤²à¥‡ à¤•à¥Œà¤¨-à¤¸à¤¾ à¤ªà¥à¤°à¥‹à¤¸à¥‡à¤¸ à¤ à¥€à¤• à¤•à¤°à¤¨à¤¾ à¤¹à¥ˆà¥¤ à¤—à¤²à¤¤ à¤ªà¥à¤°à¥‹à¤¸à¥‡à¤¸ à¤ à¥€à¤• à¤•à¤¿à¤¯à¤¾ à¤¤à¥‹ à¤¤à¥€à¤¨ à¤®à¤¹à¥€à¤¨à¥‡ à¤¬à¤°à¥à¤¬à¤¾à¤¦ à¤¹à¥‹à¤‚à¤—à¥‡à¥¤",
      `à¤•à¥à¤¯à¤¾ à¤†à¤ªà¤•à¥€ ${pillarLabel} à¤•à¥€ à¤¸à¤®à¤¸à¥à¤¯à¤¾ à¤¸à¤š à¤®à¥‡à¤‚ ${pillarLabel} à¤•à¥€ à¤¹à¥€ à¤¹à¥ˆ â€” à¤¯à¤¾ à¤•à¤¿à¤¸à¥€ à¤”à¤° à¤¬à¤¡à¤¼à¥€ à¤¸à¤®à¤¸à¥à¤¯à¤¾ à¤•à¤¾ à¤²à¤•à¥à¤·à¤£ à¤¹à¥ˆà¥¤`,
      "à¤†à¤ªà¤•à¥‡ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤•à¥‹ à¤…à¤¸à¤² à¤®à¥‡à¤‚ à¤•à¥à¤¯à¤¾ à¤šà¤¾à¤¹à¤¿à¤ â€” à¤¬à¤¨à¤¾à¤® à¤µà¤¹ à¤œà¥‹ à¤à¤• à¤«à¤¼à¥‰à¤°à¥à¤® à¤¸à¥‡ à¤…à¤‚à¤¦à¤¾à¤œà¤¼à¤¾ à¤²à¤—à¤¾à¤¯à¤¾ à¤œà¤¾ à¤¸à¤•à¤¤à¤¾ à¤¹à¥ˆà¥¤",
    ],
    openLoopFooter: "à¤‡à¤¨à¤•à¥‡ à¤²à¤¿à¤ à¤•à¤¿à¤¸à¥€ à¤•à¥‹ à¤†à¤ªà¤•à¥‡ à¤…à¤¸à¤²à¥€ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤•à¥‹ à¤¦à¥‡à¤–à¤¨à¤¾ à¤¹à¥‹à¤—à¤¾à¥¤",

    vslPlaceholder: "VSL à¤ªà¥à¤²à¥‡à¤¸à¤¹à¥‹à¤²à¥à¤¡à¤°",
    vslCaption: "60 à¤¸à¥‡à¤•à¤‚à¤¡ Â· à¤®à¥à¤¯à¥‚à¤Ÿ à¤‘à¤Ÿà¥‹à¤ªà¥à¤²à¥‡ Â· à¤¬à¤°à¥à¤¨-à¤‡à¤¨ à¤•à¥ˆà¤ªà¥à¤¶à¤¨",
    vslHint: "( à¤¯à¤¹à¤¾à¤ à¤…à¤¸à¤²à¥€ à¤µà¥€à¤¡à¤¿à¤¯à¥‹ à¤†à¤à¤—à¤¾ )",

    nextStepEyebrow: "à¤…à¤—à¤²à¤¾ à¤•à¤¦à¤®",
    ctaHeadline: "60 à¤®à¤¿à¤¨à¤Ÿ à¤®à¥‡à¤‚ à¤…à¤ªà¤¨à¤¾ à¤‡à¤‚à¤¡à¤¿à¤ªà¥‡à¤‚à¤¡à¥‡à¤‚à¤¸ à¤¸à¥à¤•à¥‹à¤° à¤¬à¤¢à¤¼à¤¾à¤à¤à¥¤",
    ctaSub: "à¤†à¤ªà¤•à¥‡ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤ªà¤° à¤à¤• à¤²à¤¾à¤‡à¤µ à¤µà¤°à¥à¤•à¤¿à¤‚à¤— à¤‘à¤¡à¤¿à¤Ÿ â€” à¤•à¥‹à¤ˆ à¤¸à¤¾à¤®à¤¾à¤¨à¥à¤¯ à¤¸à¤²à¤¾à¤¹ à¤¨à¤¹à¥€à¤‚à¥¤",
    ctaBullets: [
      "à¤¸à¤¿à¤¸à¥à¤Ÿà¤® à¤•à¥ˆà¤¸à¥‡ à¤•à¤¾à¤® à¤•à¤°à¤¤à¥‡ à¤¹à¥ˆà¤‚, à¤‡à¤¸à¤•à¥€ à¤¸à¤¾à¤«à¤¼ à¤¸à¤®à¤ â€” à¤¤à¤¾à¤•à¤¿ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤®à¤¾à¤²à¤¿à¤• à¤ªà¤° à¤¨à¤¿à¤°à¥à¤­à¤° à¤¨ à¤°à¤¹à¥‡",
      "à¤†à¤ªà¤•à¥€ à¤…à¤¸à¤²à¥€ à¤°à¥à¤•à¤¾à¤µà¤Ÿ à¤•à¥€ à¤ªà¤¹à¤šà¤¾à¤¨, à¤”à¤° à¤‰à¤¸à¥‡ à¤ à¥€à¤• à¤•à¤°à¤¨à¥‡ à¤µà¤¾à¤²à¤¾ à¤¸à¤¿à¤¸à¥à¤Ÿà¤®",
      "à¤à¤• à¤ªà¥‡à¤œ à¤•à¤¾ 90 à¤¦à¤¿à¤¨ à¤•à¤¾ à¤‡à¤‚à¤¡à¤¿à¤ªà¥‡à¤‚à¤¡à¥‡à¤‚à¤¸ à¤°à¥‹à¤¡à¤®à¥ˆà¤ª",
      "à¤†à¤ªà¤•à¥‡ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤®à¥‡à¤‚ à¤²à¤—à¤¾à¤ à¤—à¤ à¤¦à¥‹ QR-à¤†à¤§à¤¾à¤°à¤¿à¤¤ à¤šà¥‡à¤•à¤ªà¥‰à¤‡à¤‚à¤Ÿ â€” à¤†à¤ªà¤•à¤¾ à¤¸à¥à¤Ÿà¤¾à¤«à¤¼ à¤‡à¤¸à¥€ à¤¹à¤«à¤¼à¥à¤¤à¥‡ à¤¸à¥‡ à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿ à¤•à¤°à¤¨à¤¾ à¤¶à¥à¤°à¥‚ à¤•à¤°à¥‡à¤—à¤¾",
      "30 à¤¦à¤¿à¤¨ à¤•à¥€ à¤°à¥‹à¤œà¤¼à¤¾à¤¨à¤¾ WhatsApp à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿ â€” à¤•à¥à¤¯à¤¾ à¤¹à¥à¤†, à¤•à¥à¤¯à¤¾ à¤—à¤¡à¤¼à¤¬à¤¡à¤¼ à¤²à¤— à¤°à¤¹à¤¾ à¤¹à¥ˆ, à¤•à¥à¤¯à¤¾ à¤•à¤°à¤¨à¤¾ à¤¹à¥ˆ",
    ],
    ctaPrice: (amount) => `â‚¹${amount}`,
    perSessionLabel: "à¤à¤• à¤¸à¥‡à¤¶à¤¨",
    ctaGuarantee: "à¤…à¤—à¤° à¤¸à¥‡à¤¶à¤¨ à¤•à¥‡ 48 à¤˜à¤‚à¤Ÿà¥‡ à¤•à¥‡ à¤…à¤‚à¤¦à¤° à¤†à¤ªà¤•à¥€ à¤ªà¤¹à¤²à¥€ à¤°à¥‹à¤œà¤¼à¤¾à¤¨à¤¾ à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿ WhatsApp à¤ªà¤° à¤¨à¤¹à¥€à¤‚ à¤ªà¤¹à¥à¤à¤šà¤¤à¥€, à¤¤à¥‹ à¤ªà¥‚à¤°à¤¾ à¤°à¤¿à¤«à¤¼à¤‚à¤¡ à¤®à¤¿à¤²à¥‡à¤—à¤¾à¥¤",
    ctaButton: "à¤…à¤ªà¤¨à¤¾ à¤¸à¥‡à¤¶à¤¨ à¤¬à¥à¤• à¤•à¤°à¥‡à¤‚",

    testimonialsHeading: "à¤—à¥à¤°à¤¾à¤¹à¤•à¥‹à¤‚ à¤•à¥€ à¤°à¤¾à¤¯",
    footerServices: "à¤¹à¤®à¤¾à¤°à¥€ à¤¸à¥‡à¤µà¤¾à¤à¤",
    footerCalculator: "à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤‡à¤‚à¤¡à¤¿à¤ªà¥‡à¤‚à¤¡à¥‡à¤‚à¤¸ à¤²à¥‡à¤µà¤² à¤•à¥ˆà¤²à¤•à¥à¤²à¥‡à¤Ÿà¤°",
    footerSession: "à¤¸à¤¿à¤¸à¥à¤Ÿà¤®à¥à¤¸ à¤¸à¥à¤Ÿà¥à¤°à¥ˆà¤Ÿà¥‡à¤œà¥€ à¤¸à¥‡à¤¶à¤¨",
    footerConnect: "à¤¹à¤®à¤¸à¥‡ à¤œà¥à¤¡à¤¼à¥‡à¤‚",
  },

  categories: {
    A: "à¤®à¥ˆà¤¨à¥à¤¯à¥à¤«à¥ˆà¤•à¥à¤šà¤°à¤¿à¤‚à¤—",
    B: "à¤¹à¥‹à¤²à¤¸à¥‡à¤² à¤¯à¤¾ à¤Ÿà¥à¤°à¥‡à¤¡à¤¿à¤‚à¤—",
    C: "à¤¶à¥‹à¤°à¥‚à¤® à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ (à¤œà¥à¤µà¥‡à¤²à¤°à¥€, à¤•à¤ªà¤¡à¤¼à¥‹à¤‚ à¤•à¥€ à¤°à¤¿à¤Ÿà¥‡à¤², à¤¹à¤¾à¤°à¥à¤¡à¤µà¥‡à¤¯à¤° à¤”à¤° à¤¸à¥ˆà¤¨à¤¿à¤Ÿà¤°à¥€ à¤†à¤¦à¤¿)",
    D: "à¤¸à¤°à¥à¤µà¤¿à¤¸à¥‡à¤œà¤¼ / QSR / à¤°à¤¿à¤Ÿà¥‡à¤²",
  },
  revenue: {
    a: "1 à¤•à¤°à¥‹à¤¡à¤¼ à¤¸à¥‡ à¤•à¤®",
    b: "1 â€“ 10 à¤•à¤°à¥‹à¤¡à¤¼",
    c: "10 â€“ 50 à¤•à¤°à¥‹à¤¡à¤¼",
    d: "50 â€“ 100 à¤•à¤°à¥‹à¤¡à¤¼",
    e: "100 à¤•à¤°à¥‹à¤¡à¤¼ +",
  },
  pillarLabels: {
    operationalEfficiency: "à¤‘à¤ªà¤°à¥‡à¤¶à¤¨à¤² à¤à¤«à¤¼à¤¿à¤¶à¤¿à¤à¤‚à¤¸à¥€",
    humanCapital: "à¤¹à¥à¤¯à¥‚à¤®à¤¨ à¤•à¥ˆà¤ªà¤¿à¤Ÿà¤²",
    customerAcquisition: "à¤•à¤¸à¥à¤Ÿà¤®à¤° à¤à¤•à¥à¤µà¤¿à¤œà¤¼à¤¿à¤¶à¤¨",
    dataVisibility: "à¤¡à¥‡à¤Ÿà¤¾ à¤µà¤¿à¤œà¤¼à¤¿à¤¬à¤¿à¤²à¤¿à¤Ÿà¥€",
  },
  levelNames: {
    "Owner-Trapped": "à¤®à¤¾à¤²à¤¿à¤• à¤®à¥‡à¤‚ à¤«à¤à¤¸à¤¾ à¤¹à¥à¤†",
    "Owner-Dependent": "à¤®à¤¾à¤²à¤¿à¤• à¤ªà¤° à¤¨à¤¿à¤°à¥à¤­à¤°",
    "Team-Run": "à¤Ÿà¥€à¤®-à¤¸à¤‚à¤šà¤¾à¤²à¤¿à¤¤",
    "Owner-Independent": "à¤®à¤¾à¤²à¤¿à¤• à¤¸à¥‡ à¤¸à¥à¤µà¤¤à¤‚à¤¤à¥à¤°",
  },
  levelTaglines: {
    "Owner-Trapped": "à¤œà¤¬ à¤†à¤ª à¤°à¥à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚, à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤­à¥€ à¤°à¥à¤• à¤œà¤¾à¤¤à¤¾ à¤¹à¥ˆà¥¤",
    "Owner-Dependent": "à¤†à¤ªà¤•à¤¾ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤¤à¤­à¥€ à¤šà¤²à¤¤à¤¾ à¤¹à¥ˆ à¤œà¤¬ à¤†à¤ª à¤¦à¥‡à¤– à¤°à¤¹à¥‡ à¤¹à¥‹à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤ à¤¨à¤œà¤¼à¤° à¤¹à¤Ÿà¥€, à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤°à¥à¤•à¤¾à¥¤",
    "Team-Run": "à¤†à¤ªà¤•à¥€ à¤Ÿà¥€à¤® à¤¦à¤¿à¤¨ à¤•à¤¾ à¤œà¤¼à¥à¤¯à¤¾à¤¦à¤¾à¤¤à¤° à¤•à¤¾à¤® à¤¸à¤‚à¤­à¤¾à¤²à¤¤à¥€ à¤¹à¥ˆà¥¤ à¤†à¤ª à¤¸à¤¿à¤°à¥à¤«à¤¼ à¤…à¤ªà¤µà¤¾à¤¦ à¤µà¤¾à¤²à¥‡ à¤®à¤¾à¤®à¤²à¥‡ à¤¸à¤‚à¤­à¤¾à¤²à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤",
    "Owner-Independent": "à¤°à¥‹à¤œà¤¼à¤®à¤°à¥à¤°à¤¾ à¤•à¥‡ à¤•à¤¾à¤®à¤•à¤¾à¤œ à¤•à¥‡ à¤²à¤¿à¤ à¤†à¤ª à¤œà¤¼à¤°à¥‚à¤°à¥€ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆà¤‚à¥¤ à¤…à¤¬ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤¬à¤¢à¤¼à¤¾à¤¨à¥‡ à¤•à¤¾ à¤¸à¤®à¤¯ à¤¹à¥ˆà¥¤",
  },

  generalQuestions: [
    {
      question: "à¤¸à¥‹à¤šà¤¿à¤ à¤†à¤ª 10 à¤¦à¤¿à¤¨ à¤•à¥‡ à¤«à¤¼à¥ˆà¤®à¤¿à¤²à¥€ à¤Ÿà¥à¤°à¤¿à¤ª à¤ªà¤° à¤œà¤¾à¤¤à¥‡ à¤¹à¥ˆà¤‚ à¤”à¤° à¤«à¤¼à¥‹à¤¨ à¤¸à¤¾à¤‡à¤²à¥‡à¤‚à¤Ÿ à¤°à¤–à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤ à¤†à¤ªà¤•à¥‡ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤•à¤¾ à¤•à¥à¤¯à¤¾ à¤¹à¥‹à¤—à¤¾?",
      options: [
        "à¤®à¥‡à¤°à¥‡ à¤¬à¤¿à¤¨à¤¾ à¤•à¥à¤› à¤¨à¤¹à¥€à¤‚ à¤šà¤²à¤¤à¤¾",
        "à¤•à¥à¤› à¤•à¤¾à¤® à¤¹à¥‹ à¤œà¤¾à¤¤à¤¾ à¤¹à¥ˆ, à¤²à¥‡à¤•à¤¿à¤¨ à¤®à¥‡à¤°à¥€ à¤—à¥ˆà¤°à¤¹à¤¾à¤œà¤¼à¤¿à¤°à¥€ à¤®à¥‡à¤‚ à¤¸à¤®à¤¸à¥à¤¯à¤¾à¤à¤ à¤œà¤®à¤¾ à¤¹à¥‹ à¤œà¤¾à¤¤à¥€ à¤¹à¥ˆà¤‚",
        "à¤¸à¤¬ à¤¬à¤¿à¤¨à¤¾ à¤°à¥à¤•à¤¾à¤µà¤Ÿ à¤šà¤²à¤¤à¤¾ à¤¹à¥ˆ â€” à¤®à¥‡à¤°à¥‡ à¤ªà¤¾à¤¸ à¤¸à¤¹à¥€ à¤Ÿà¥€à¤® à¤”à¤° à¤ªà¥à¤°à¥‹à¤¸à¥€à¤œà¤° à¤¹à¥ˆà¤‚, à¤¬à¤¸ à¤•à¤­à¥€-à¤•à¤­à¤¾à¤° à¤•à¥‹à¤ˆ à¤…à¤ªà¤µà¤¾à¤¦ à¤®à¥‡à¤°à¥‡ à¤ªà¤¾à¤¸ à¤†à¤¤à¤¾ à¤¹à¥ˆ",
      ],
    },
    {
      question: "à¤†à¤ªà¤•à¥‡ à¤•à¥à¤› à¤¸à¥à¤Ÿà¥ˆà¤‚à¤¡à¤°à¥à¤¡ à¤¹à¥ˆà¤‚ à¤œà¤¿à¤¨à¤•à¤¾ à¤ªà¤¾à¤²à¤¨ à¤¹à¥‹à¤¨à¤¾ à¤šà¤¾à¤¹à¤¿à¤ â€” à¤•à¥à¤µà¤¾à¤²à¤¿à¤Ÿà¥€, à¤ˆà¤®à¤¾à¤¨à¤¦à¤¾à¤°à¥€, à¤®à¥‚à¤²à¥à¤¯à¥¤ à¤¯à¤¹ à¤•à¥Œà¤¨ à¤¸à¥à¤¨à¤¿à¤¶à¥à¤šà¤¿à¤¤ à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆ à¤•à¤¿ à¤‡à¤¨à¤•à¤¾ à¤ªà¤¾à¤²à¤¨ à¤¹à¥‹ à¤°à¤¹à¤¾ à¤¹à¥ˆ?",
      options: [
        "à¤®à¥ˆà¤‚ à¤–à¥à¤¦ à¤¦à¥‡à¤–à¤¤à¤¾ à¤¹à¥‚à¤ à¤”à¤° à¤¸à¥à¤Ÿà¤¾à¤«à¤¼ à¤•à¥‹ à¤¸à¥à¤§à¤¾à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤•à¤¹à¤¤à¤¾ à¤¹à¥‚à¤",
        "à¤®à¥ˆà¤‚ à¤®à¤¾à¤¨ à¤²à¥‡à¤¤à¤¾ à¤¹à¥‚à¤ à¤•à¤¿ à¤¸à¥à¤Ÿà¤¾à¤«à¤¼ à¤µà¤¹à¥€ à¤•à¤°à¥‡à¤—à¤¾ à¤œà¥‹ à¤®à¥ˆà¤‚à¤¨à¥‡ à¤¸à¤¿à¤–à¤¾à¤¯à¤¾ à¤¹à¥ˆ â€” à¤ªà¤¤à¤¾ à¤¤à¤¬ à¤šà¤²à¤¤à¤¾ à¤¹à¥ˆ à¤œà¤¬ à¤•à¥à¤› à¤—à¤¡à¤¼à¤¬à¤¡à¤¼ à¤¹à¥‹ à¤œà¤¾à¤¤à¥€ à¤¹à¥ˆ",
        "à¤°à¥‹à¤œà¤¼ à¤œà¤¾à¤à¤š à¤¹à¥‹à¤¤à¥€ à¤¹à¥ˆ â€” à¤®à¥à¤à¥‡ à¤•à¤¿à¤¸à¥€ à¤®à¥ˆà¤¨à¥‡à¤œà¤° à¤¯à¤¾ à¤°à¤¿à¤•à¥‰à¤°à¥à¤¡ à¤¸à¥‡ à¤à¤• à¤¸à¤¾à¤°à¤¾à¤‚à¤¶ à¤®à¤¿à¤²à¤¤à¤¾ à¤¹à¥ˆ à¤•à¤¿ à¤•à¥à¤¯à¤¾ à¤—à¤¡à¤¼à¤¬à¤¡à¤¼ à¤¹à¥à¤ˆ",
      ],
    },
    {
      question: "à¤†à¤ª à¤à¤• à¤¨à¤¯à¤¾ à¤•à¤°à¥à¤®à¤šà¤¾à¤°à¥€ à¤°à¤–à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤ à¤‰à¤¸à¥‡ à¤Ÿà¥à¤°à¥‡à¤¨à¤¿à¤‚à¤— à¤¦à¥‡à¤¨à¥‡ à¤•à¥€ à¤œà¤¼à¤¿à¤®à¥à¤®à¥‡à¤¦à¤¾à¤°à¥€ à¤•à¤¿à¤¸à¤•à¥€ à¤¹à¥ˆ?",
      options: [
        "à¤µà¤¹ à¤•à¤¾à¤® à¤•à¤°à¤¤à¥‡-à¤•à¤°à¤¤à¥‡ à¤–à¥à¤¦ à¤¸à¥€à¤– à¤²à¥‡à¤¤à¤¾ à¤¹à¥ˆ",
        "à¤®à¥ˆà¤‚ à¤¸à¤¬à¤•à¥‹ à¤–à¥à¤¦ à¤Ÿà¥à¤°à¥‡à¤¨à¤¿à¤‚à¤— à¤¦à¥‡à¤¤à¤¾ à¤¹à¥‚à¤",
        "à¤Ÿà¥à¤°à¥‡à¤¨à¤¿à¤‚à¤— à¤®à¤Ÿà¥€à¤°à¤¿à¤¯à¤² à¤”à¤° à¤ªà¥à¤°à¥‹à¤—à¥à¤°à¥‡à¤¸ à¤Ÿà¥à¤°à¥ˆà¤•à¤¿à¤‚à¤— à¤®à¥Œà¤œà¥‚à¤¦ à¤¹à¥ˆ, à¤‡à¤¸à¤²à¤¿à¤ à¤‘à¤¨à¤¬à¥‹à¤°à¥à¤¡à¤¿à¤‚à¤— à¤®à¥‡à¤°à¥‡ à¤¬à¤¿à¤¨à¤¾ à¤­à¥€ à¤šà¤²à¤¤à¥€ à¤¹à¥ˆ",
      ],
    },
    {
      question: "à¤†à¤ªà¤•à¤¾ à¤¸à¤¬à¤¸à¥‡ à¤…à¤¨à¥à¤­à¤µà¥€ à¤•à¤°à¥à¤®à¤šà¤¾à¤°à¥€ à¤•à¤² à¤¬à¤¤à¤¾ à¤¦à¥‡à¤¤à¤¾ à¤¹à¥ˆ à¤•à¤¿ à¤µà¤¹ 30 à¤¦à¤¿à¤¨ à¤®à¥‡à¤‚ à¤¨à¥Œà¤•à¤°à¥€ à¤›à¥‹à¤¡à¤¼ à¤°à¤¹à¤¾ à¤¹à¥ˆà¥¤ à¤•à¥à¤¯à¤¾ à¤¹à¥‹à¤—à¤¾?",
      options: [
        "à¤®à¥ˆà¤‚ à¤®à¥à¤¶à¥à¤•à¤¿à¤² à¤®à¥‡à¤‚ à¤¹à¥‚à¤ â€” à¤¬à¤¹à¥à¤¤ à¤¸à¤¾à¤°à¤¾ à¤•à¤¾à¤® à¤¸à¤¿à¤°à¥à¤«à¤¼ à¤‰à¤¸à¤•à¥‡ à¤¦à¤¿à¤®à¤¾à¤—à¤¼ à¤®à¥‡à¤‚ à¤¹à¥ˆ",
        "à¤¹à¤® à¤¸à¤‚à¤­à¤¾à¤² à¤²à¥‡à¤‚à¤—à¥‡, à¤²à¥‡à¤•à¤¿à¤¨ à¤®à¥à¤à¥‡ à¤•à¥à¤› à¤®à¤¹à¥€à¤¨à¥‹à¤‚ à¤¤à¤• à¤‰à¤¸à¤•à¤¾ à¤•à¤¾à¤® à¤–à¥à¤¦ à¤¸à¤‚à¤­à¤¾à¤²à¤¨à¤¾ à¤ªà¤¡à¤¼à¥‡à¤—à¤¾",
        "à¤‰à¤¸à¤•à¤¾ à¤•à¤¾à¤® à¤²à¤¿à¤–à¤¿à¤¤ à¤°à¥‚à¤ª à¤®à¥‡à¤‚ à¤¦à¤°à¥à¤œ à¤¹à¥ˆ, à¤”à¤° à¤•à¤¿à¤¸à¥€ à¤•à¥‹ à¤¤à¤¯ à¤¸à¤®à¤¯-à¤¸à¥€à¤®à¤¾ à¤®à¥‡à¤‚ à¤‰à¤¸ à¤•à¤¾à¤® à¤•à¥‡ à¤²à¤¿à¤ à¤¤à¥ˆà¤¯à¤¾à¤° à¤•à¤¿à¤¯à¤¾ à¤œà¤¾ à¤¸à¤•à¤¤à¤¾ à¤¹à¥ˆ",
      ],
    },
    {
      question: "à¤†à¤ªà¤•à¥‡ à¤ªà¤¿à¤›à¤²à¥‡ 10 à¤¨à¤ à¤—à¥à¤°à¤¾à¤¹à¤•à¥‹à¤‚ à¤•à¥‹ à¤†à¤ªà¤•à¥‡ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤•à¥‡ à¤¬à¤¾à¤°à¥‡ à¤®à¥‡à¤‚ à¤•à¥ˆà¤¸à¥‡ à¤ªà¤¤à¤¾ à¤šà¤²à¤¾?",
      options: [
        "à¤®à¥ˆà¤‚ à¤–à¥à¤¦ à¤¶à¤¾à¤®à¤¿à¤² à¤¥à¤¾ â€” à¤•à¥‰à¤² à¤•à¤°à¤¨à¤¾, à¤«à¤¼à¥‰à¤²à¥‹-à¤…à¤ª à¤•à¤°à¤¨à¤¾, à¤¬à¤¿à¤•à¥à¤°à¥€ à¤ªà¤•à¥à¤•à¥€ à¤•à¤°à¤¨à¤¾",
        "à¤¸à¥‡à¤²à¥à¤¸ à¤Ÿà¥€à¤® à¤¯à¤¾ à¤¸à¥à¤Ÿà¤¾à¤«à¤¼ à¤¨à¥‡ à¤à¤• à¤†à¤œà¤¼à¤®à¤¾à¤ à¤¹à¥à¤ à¤ªà¤¿à¤š à¤¯à¤¾ à¤¸à¥à¤•à¥à¤°à¤¿à¤ªà¥à¤Ÿ à¤¸à¥‡ à¤‰à¤¨à¥à¤¹à¥‡à¤‚ à¤•à¥‰à¤² à¤•à¤¿à¤¯à¤¾",
        "à¤µà¤¿à¤œà¥à¤žà¤¾à¤ªà¤¨ à¤”à¤° à¤®à¤¾à¤°à¥à¤•à¥‡à¤Ÿà¤¿à¤‚à¤— à¤¸à¥‡ â€” à¤¡à¤¿à¤œà¤¿à¤Ÿà¤², à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾, à¤µà¥‡à¤¬à¤¸à¤¾à¤‡à¤Ÿ à¤²à¥€à¤¡",
      ],
    },
    {
      question: "à¤ªà¤¿à¤›à¤²à¥‡ à¤®à¤¹à¥€à¤¨à¥‡ à¤œà¥‹ à¤‡à¤¨à¥à¤•à¥à¤µà¤¾à¤¯à¤°à¥€ à¤†à¤ˆà¤‚ à¤”à¤° à¤œà¤¿à¤¨à¥à¤¹à¥‹à¤‚à¤¨à¥‡ à¤–à¤°à¥€à¤¦à¤¾ à¤¨à¤¹à¥€à¤‚ â€” à¤‰à¤¨à¤®à¥‡à¤‚ à¤¸à¥‡ à¤•à¤¿à¤¤à¤¨à¥‹à¤‚ à¤•à¤¾ à¤«à¤¼à¥‰à¤²à¥‹-à¤…à¤ª à¤¹à¥à¤†?",
      options: [
        "à¤•à¥‹à¤ˆ à¤°à¤¿à¤•à¥‰à¤°à¥à¤¡ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆ",
        "à¤¸à¥à¤Ÿà¤¾à¤«à¤¼ à¤•à¤­à¥€-à¤•à¤­à¥€ à¤«à¤¼à¥‰à¤²à¥‹-à¤…à¤ª à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆ, à¤¯à¤¾ à¤¬à¤¡à¤¼à¥€ à¤µà¤¾à¤²à¥€ à¤‡à¤¨à¥à¤•à¥à¤µà¤¾à¤¯à¤°à¥€ à¤•à¥‹ à¤®à¥ˆà¤‚ à¤–à¥à¤¦ à¤ªà¤•à¤¡à¤¼à¤¤à¤¾ à¤¹à¥‚à¤",
        "à¤¹à¤° à¤‡à¤¨à¥à¤•à¥à¤µà¤¾à¤¯à¤°à¥€ à¤«à¤¼à¥‰à¤²à¥‹-à¤…à¤ª à¤•à¥€ à¤¤à¤¾à¤°à¥€à¤–à¤¼ à¤•à¥‡ à¤¸à¤¾à¤¥ à¤¦à¤°à¥à¤œ à¤¹à¥‹à¤¤à¥€ à¤¹à¥ˆ",
      ],
    },
  ],

  categoryQuestions: {
    A: [
      {
        question: "à¤à¤• à¤—à¥à¤°à¤¾à¤¹à¤• à¤«à¤¼à¥‹à¤¨ à¤•à¤°à¤•à¥‡ à¤‘à¤°à¥à¤¡à¤° à¤•à¤¾ à¤¸à¥à¤Ÿà¥‡à¤Ÿà¤¸ à¤ªà¥‚à¤›à¤¤à¤¾ à¤¹à¥ˆà¥¤ à¤‰à¤¸à¥‡ à¤¸à¤¹à¥€ à¤œà¤µà¤¾à¤¬ à¤¦à¥‡à¤¨à¥‡ à¤®à¥‡à¤‚ à¤†à¤ªà¤•à¥‹ à¤•à¤¿à¤¤à¤¨à¤¾ à¤¸à¤®à¤¯ à¤²à¤—à¤¤à¤¾ à¤¹à¥ˆ?",
        options: [
          "à¤®à¥ˆà¤‚ à¤¯à¤¾à¤¦à¤¦à¤¾à¤¶à¥à¤¤ à¤¸à¥‡ à¤…à¤‚à¤¦à¤¾à¤œà¤¼à¤¾ à¤¬à¤¤à¤¾ à¤¦à¥‡à¤¤à¤¾ à¤¹à¥‚à¤",
          "à¤®à¥ˆà¤‚ à¤µà¤°à¥à¤•à¤°à¥‹à¤‚ à¤•à¥‹ à¤«à¤¼à¥‹à¤¨ à¤•à¤°à¤¤à¤¾ à¤¹à¥‚à¤, à¤°à¤œà¤¿à¤¸à¥à¤Ÿà¤° à¤”à¤° à¤¤à¥ˆà¤¯à¤¾à¤° à¤®à¤¾à¤² à¤•à¤¾ à¤²à¥‰à¤— à¤¦à¥‡à¤–à¤¤à¤¾ à¤¹à¥‚à¤",
          "à¤®à¥ˆà¤‚ à¤ªà¥à¤°à¥‹à¤¡à¤•à¥à¤¶à¤¨ à¤¶à¥‡à¤¡à¥à¤¯à¥‚à¤² à¤¦à¥‡à¤–à¤¤à¤¾ à¤¹à¥‚à¤ â€” à¤¸à¥à¤Ÿà¥‡à¤Ÿà¤¸ à¤”à¤° à¤ªà¥‚à¤°à¤¾ à¤¹à¥‹à¤¨à¥‡ à¤•à¥€ à¤¸à¤‚à¤­à¤¾à¤µà¤¿à¤¤ à¤¤à¤¾à¤°à¥€à¤–à¤¼ à¤ªà¤¹à¤²à¥‡ à¤¸à¥‡ à¤¨à¤¿à¤•à¤²à¥€ à¤¹à¥à¤ˆ à¤¹à¥ˆ",
        ],
      },
      {
        question: "à¤ªà¤¿à¤›à¤²à¥‡ 3 à¤®à¤¹à¥€à¤¨à¥‡ à¤•à¤¾ à¤ªà¥à¤°à¥‹à¤¡à¤•à¥à¤¶à¤¨ à¤”à¤° à¤°à¤¿à¤œà¥‡à¤•à¥à¤¶à¤¨ à¤ªà¥à¤°à¤¤à¤¿à¤¶à¤¤ â€” à¤•à¥à¤¯à¤¾ à¤†à¤ª à¤…à¤­à¥€ à¤¬à¤¤à¤¾ à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚?",
        options: [
          "à¤•à¥‹à¤ˆ à¤¸à¤¹à¥€ à¤°à¤¿à¤•à¥‰à¤°à¥à¤¡ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆ",
          "à¤®à¥à¤à¥‡ à¤®à¥‹à¤Ÿà¤¾-à¤®à¥‹à¤Ÿà¤¾ à¤ªà¤¤à¤¾ à¤¹à¥ˆ, à¤¸à¤Ÿà¥€à¤• à¤¨à¤¹à¥€à¤‚",
          "à¤¹à¤¾à¤ â€” à¤®à¥ˆà¤‚ à¤•à¤¿à¤¸à¥€ à¤¸à¥‡ à¤ªà¥‚à¤›à¥‡ à¤¬à¤¿à¤¨à¤¾ à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿ à¤®à¥‡à¤‚ à¤¦à¥‡à¤– à¤²à¥‡à¤¤à¤¾ à¤¹à¥‚à¤",
        ],
      },
    ],
    B: [
      {
        question: "à¤…à¤­à¥€ à¤†à¤ªà¤•à¥‡ à¤—à¥‹à¤¦à¤¾à¤® à¤®à¥‡à¤‚ à¤œà¥‹ à¤¸à¥à¤Ÿà¥‰à¤• à¤ªà¤¡à¤¼à¤¾ à¤¹à¥ˆ, à¤‰à¤¸à¤®à¥‡à¤‚ à¤¸à¥‡ à¤•à¤¿à¤¤à¤¨à¤¾ 6 à¤®à¤¹à¥€à¤¨à¥‡ à¤¸à¥‡ à¤¹à¤¿à¤²à¤¾ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆ?",
        options: [
          "à¤•à¥‹à¤ˆ à¤…à¤‚à¤¦à¤¾à¤œà¤¼à¤¾ à¤¨à¤¹à¥€à¤‚ â€” à¤–à¥à¤¦ à¤œà¤¾à¤•à¤° à¤¦à¥‡à¤–à¤¨à¤¾ à¤ªà¤¡à¤¼à¥‡à¤—à¤¾",
          "à¤®à¥à¤à¥‡ à¤¯à¤¾à¤¦à¤¦à¤¾à¤¶à¥à¤¤ à¤¸à¥‡ à¤®à¥‹à¤Ÿà¤¾-à¤®à¥‹à¤Ÿà¤¾ à¤ªà¤¤à¤¾ à¤¹à¥ˆ à¤•à¤¿ à¤•à¥Œà¤¨-à¤¸à¥‡ à¤†à¤‡à¤Ÿà¤® à¤§à¥€à¤®à¥‡ à¤¬à¤¿à¤• à¤°à¤¹à¥‡ à¤¹à¥ˆà¤‚",
          "à¤®à¥à¤à¥‡ à¤à¤œà¤¿à¤‚à¤— à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿ à¤®à¤¿à¤²à¤¤à¥€ à¤¹à¥ˆ â€” à¤®à¥à¤à¥‡ à¤ à¥€à¤•-à¤ à¥€à¤• à¤ªà¤¤à¤¾ à¤¹à¥ˆ à¤•à¤¿ à¤§à¥€à¤®à¥‡ à¤¬à¤¿à¤•à¤¨à¥‡ à¤µà¤¾à¤²à¥‡ à¤¸à¥à¤Ÿà¥‰à¤• à¤®à¥‡à¤‚ à¤•à¤¿à¤¤à¤¨à¥€ à¤°à¤•à¤® à¤«à¤à¤¸à¥€ à¤¹à¥ˆ",
        ],
      },
      {
        question: "à¤…à¤­à¥€ à¤†à¤ªà¤•à¤¾ à¤•à¤¿à¤¤à¤¨à¤¾ à¤ªà¥ˆà¤¸à¤¾ à¤®à¤¾à¤°à¥à¤•à¥‡à¤Ÿ à¤®à¥‡à¤‚ à¤ªà¤¡à¤¼à¤¾ à¤¹à¥ˆ, à¤”à¤° à¤‰à¤¸à¤®à¥‡à¤‚ à¤¸à¥‡ à¤•à¤¿à¤¤à¤¨à¤¾ à¤†à¤ªà¤•à¥€ à¤•à¥à¤°à¥‡à¤¡à¤¿à¤Ÿ à¤¶à¤°à¥à¤¤à¥‹à¤‚ à¤¸à¥‡ à¤œà¤¼à¥à¤¯à¤¾à¤¦à¤¾ à¤²à¥‡à¤Ÿ à¤¹à¥‹ à¤šà¥à¤•à¤¾ à¤¹à¥ˆ?",
        options: [
          "à¤®à¥à¤à¥‡ à¤®à¥‹à¤Ÿà¤¾ à¤•à¥à¤² à¤†à¤à¤•à¤¡à¤¼à¤¾ à¤ªà¤¤à¤¾ à¤¹à¥ˆ",
          "à¤…à¤—à¤° à¤®à¥ˆà¤‚ à¤•à¤¹à¥‚à¤ à¤¤à¥‹ à¤®à¥‡à¤°à¤¾ à¤…à¤•à¤¾à¤‰à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤¬à¤¤à¤¾ à¤¸à¤•à¤¤à¤¾ à¤¹à¥ˆ",
          "à¤®à¥ˆà¤‚ à¤•à¤¿à¤¸à¥€ à¤¸à¥‡ à¤ªà¥‚à¤›à¥‡ à¤¬à¤¿à¤¨à¤¾ à¤†à¤‰à¤Ÿà¤¸à¥à¤Ÿà¥ˆà¤‚à¤¡à¤¿à¤‚à¤— à¤”à¤° à¤à¤œà¤¿à¤‚à¤— à¤¦à¥‡à¤– à¤²à¥‡à¤¤à¤¾ à¤¹à¥‚à¤",
        ],
      },
    ],
    C: [
      {
        question: "à¤•à¤² à¤•à¤¿à¤¤à¤¨à¥‡ à¤²à¥‹à¤— à¤¶à¥‹à¤°à¥‚à¤® à¤®à¥‡à¤‚ à¤†à¤, à¤”à¤° à¤•à¤¿à¤¤à¤¨à¥‹à¤‚ à¤¨à¥‡ à¤–à¤°à¥€à¤¦à¤¾à¤°à¥€ à¤•à¥€?",
        options: [
          "à¤•à¥‹à¤ˆ à¤¸à¤¹à¥€ à¤…à¤‚à¤¦à¤¾à¤œà¤¼à¤¾ à¤¨à¤¹à¥€à¤‚ â€” à¤•à¥à¤› à¤¦à¤°à¥à¤œ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆ",
          "à¤®à¥‡à¤°à¥‡ à¤¦à¤¿à¤®à¤¾à¤—à¤¼ à¤®à¥‡à¤‚ à¤à¤• à¤…à¤‚à¤¦à¤¾à¤œà¤¼à¤¾ à¤¹à¥ˆ",
          "à¤¯à¤¹ à¤ à¥€à¤• à¤¸à¥‡ à¤Ÿà¥à¤°à¥ˆà¤• à¤¹à¥‹à¤¤à¤¾ à¤¹à¥ˆ, à¤”à¤° à¤®à¥à¤à¥‡ à¤à¤• à¤¸à¤¾à¤«à¤¼ à¤Ÿà¥à¤°à¥‡à¤‚à¤¡ à¤¦à¤¿à¤–à¤¤à¤¾ à¤¹à¥ˆ",
        ],
      },
      {
        question: "à¤•à¤² à¤à¤• à¤—à¥à¤°à¤¾à¤¹à¤• à¤¨à¥‡ à¤•à¥à¤› à¤®à¤¾à¤à¤—à¤¾ à¤œà¥‹ à¤†à¤ªà¤•à¥‡ à¤ªà¤¾à¤¸ à¤¸à¥à¤Ÿà¥‰à¤• à¤®à¥‡à¤‚ à¤¨à¤¹à¥€à¤‚ à¤¥à¤¾à¥¤ à¤¯à¤¹ à¤•à¤¹à¤¾à¤ à¤¦à¤°à¥à¤œ à¤¹à¥‹à¤¤à¤¾ à¤¹à¥ˆ?",
        options: [
          "à¤•à¤¹à¥€à¤‚ à¤¨à¤¹à¥€à¤‚ â€” à¤‰à¤¸à¥‡ à¤®à¤¨à¤¾ à¤•à¤° à¤¦à¤¿à¤¯à¤¾ à¤”à¤° à¤µà¤¹ à¤šà¤²à¤¾ à¤—à¤¯à¤¾",
          "à¤…à¤—à¤° à¤à¤¸à¤¾ à¤¬à¤¾à¤°-à¤¬à¤¾à¤° à¤¹à¥‹ à¤¤à¥‹ à¤¸à¥à¤Ÿà¤¾à¤«à¤¼ à¤®à¥à¤à¥‡ à¤œà¤¼à¥à¤¬à¤¾à¤¨à¥€ à¤¬à¤¤à¤¾ à¤¦à¥‡à¤¤à¤¾ à¤¹à¥ˆ",
          "à¤¬à¤¿à¤•à¥à¤°à¥€ à¤–à¥‹à¤¨à¥‡ à¤•à¥‡ à¤•à¤¾à¤°à¤£ à¤¦à¤°à¥à¤œ à¤¹à¥‹à¤¤à¥‡ à¤¹à¥ˆà¤‚ à¤”à¤° à¤®à¥ˆà¤‚ à¤‰à¤¨à¤•à¥€ à¤¸à¤®à¥€à¤•à¥à¤·à¤¾ à¤•à¤°à¤¤à¤¾ à¤¹à¥‚à¤",
        ],
      },
    ],
    D: [
      {
        question: "à¤†à¤ª 3 à¤¦à¤¿à¤¨ à¤•à¥‡ à¤²à¤¿à¤ à¤¦à¥à¤•à¤¾à¤¨ à¤¸à¥‡ à¤¦à¥‚à¤° à¤¹à¥ˆà¤‚à¥¤ à¤†à¤œ à¤•à¥€ à¤¬à¤¿à¤•à¥à¤°à¥€ à¤”à¤° à¤¸à¥à¤Ÿà¤¾à¤«à¤¼ à¤•à¥€ à¤¹à¤¾à¤œà¤¼à¤¿à¤°à¥€ à¤•à¤¾ à¤ªà¤¤à¤¾ à¤†à¤ªà¤•à¥‹ à¤•à¥ˆà¤¸à¥‡ à¤šà¤²à¤¤à¤¾ à¤¹à¥ˆ?",
        options: [
          "à¤•à¥‹à¤ˆ à¤…à¤‚à¤¦à¤¾à¤œà¤¼à¤¾ à¤¨à¤¹à¥€à¤‚ â€” à¤­à¤°à¥‹à¤¸à¤¾ à¤•à¤°à¤¨à¤¾ à¤ªà¤¡à¤¼à¤¤à¤¾ à¤¹à¥ˆ à¤•à¤¿ à¤µà¥‡ à¤ à¥€à¤• à¤¸à¥‡ à¤•à¤¾à¤® à¤•à¤° à¤°à¤¹à¥‡ à¤¹à¥‹à¤‚à¤—à¥‡",
          "à¤®à¥ˆà¤‚ à¤…à¤ªà¤¨à¥‡ à¤®à¥ˆà¤¨à¥‡à¤œà¤° à¤•à¥‹ à¤«à¤¼à¥‹à¤¨ à¤•à¤°à¤¤à¤¾ à¤¹à¥‚à¤ à¤”à¤° à¤µà¤¹ à¤¬à¤¤à¤¾ à¤¦à¥‡à¤¤à¤¾ à¤¹à¥ˆ",
          "à¤à¤• à¤¸à¤¹à¥€ à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿà¤¿à¤‚à¤— à¤¸à¤¿à¤¸à¥à¤Ÿà¤® à¤¹à¥ˆ â€” à¤®à¥à¤à¥‡ à¤­à¤°à¥‹à¤¸à¤¾ à¤¹à¥ˆ à¤•à¤¿ à¤®à¥‡à¤°à¥€ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€ à¤•à¥‡ à¤¬à¤¿à¤¨à¤¾ à¤•à¥à¤› à¤­à¥€ à¤¸à¤¿à¤¸à¥à¤Ÿà¤® à¤¸à¥‡ à¤¬à¤¾à¤¹à¤° à¤¨à¤¹à¥€à¤‚ à¤œà¤¾à¤¤à¤¾",
        ],
      },
      {
        question: "à¤•à¤² à¤•à¥€ à¤•à¥à¤²à¥‹à¤œà¤¼à¤¿à¤‚à¤— â€” à¤•à¥ˆà¤¶, à¤‘à¤¨à¤²à¤¾à¤‡à¤¨, à¤”à¤° à¤œà¥‹ à¤…à¤¸à¤² à¤®à¥‡à¤‚ à¤¬à¤¿à¤•à¤¾à¥¤ à¤¯à¥‡ à¤¤à¥€à¤¨à¥‹à¤‚ à¤†à¤ªà¤¸ à¤®à¥‡à¤‚ à¤®à¤¿à¤²à¤¤à¥‡ à¤¹à¥ˆà¤‚, à¤¯à¤¹ à¤•à¥Œà¤¨ à¤œà¤¾à¤à¤šà¤¤à¤¾ à¤¹à¥ˆ, à¤”à¤° à¤…à¤—à¤° à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤²à¤¤à¥‡ à¤¤à¥‹ à¤•à¥à¤¯à¤¾ à¤¹à¥‹à¤¤à¤¾ à¤¹à¥ˆ?",
        options: [
          "à¤…à¤²à¤— à¤¸à¥‡ à¤•à¥‹à¤ˆ à¤¨à¤¹à¥€à¤‚ à¤œà¤¾à¤à¤šà¤¤à¤¾",
          "à¤œà¤¬ à¤®à¥ˆà¤‚ à¤®à¥Œà¤œà¥‚à¤¦ à¤¹à¥‹à¤¤à¤¾ à¤¹à¥‚à¤, à¤¤à¤¬ à¤®à¥ˆà¤‚ à¤–à¥à¤¦ à¤œà¤¾à¤à¤šà¤¤à¤¾ à¤¹à¥‚à¤",
          "à¤®à¥à¤à¥‡ à¤°à¥‹à¤œà¤¼à¤¾à¤¨à¤¾ à¤•à¤¾ à¤Ÿà¥ˆà¤²à¥€ à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿ à¤®à¤¿à¤²à¤¤à¤¾ à¤¹à¥ˆ à¤”à¤° à¤•à¤¿à¤¸à¥€ à¤­à¥€ à¤•à¤®à¥€ à¤•à¥‹ à¤•à¤¾à¤°à¤£ à¤•à¥‡ à¤¸à¤¾à¤¥ à¤šà¤¿à¤¹à¥à¤¨à¤¿à¤¤ à¤•à¤¿à¤¯à¤¾ à¤œà¤¾à¤¤à¤¾ à¤¹à¥ˆ",
        ],
      },
    ],
  },

  answerClauses: {
    operationalEfficiency: [
      [
        "à¤†à¤ªà¤•à¥‡ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤®à¥‡à¤‚ à¤¤à¤¬ à¤¤à¤• à¤•à¥à¤› à¤¨à¤¹à¥€à¤‚ à¤¹à¤¿à¤²à¤¤à¤¾ à¤œà¤¬ à¤¤à¤• à¤†à¤ª à¤–à¥à¤¦ à¤‰à¤¸à¥‡ à¤¨ à¤¦à¥‡à¤–à¥‡à¤‚",
        "à¤†à¤ªà¤•à¥‡ à¤¬à¤¿à¤¨à¤¾ à¤•à¥à¤› à¤•à¤¾à¤® à¤¤à¥‹ à¤¹à¥‹ à¤œà¤¾à¤¤à¤¾ à¤¹à¥ˆ, à¤²à¥‡à¤•à¤¿à¤¨ à¤†à¤ªà¤•à¥€ à¤—à¥ˆà¤°à¤¹à¤¾à¤œà¤¼à¤¿à¤°à¥€ à¤®à¥‡à¤‚ à¤¸à¤®à¤¸à¥à¤¯à¤¾à¤à¤ à¤¤à¥‡à¤œà¤¼à¥€ à¤¸à¥‡ à¤œà¤®à¤¾ à¤¹à¥‹ à¤œà¤¾à¤¤à¥€ à¤¹à¥ˆà¤‚",
        "à¤†à¤ªà¤•à¥€ à¤Ÿà¥€à¤® à¤”à¤° à¤ªà¥à¤°à¥‹à¤¸à¥€à¤œà¤° à¤¸à¤¬ à¤•à¥à¤› à¤¬à¤¿à¤¨à¤¾ à¤°à¥à¤•à¤¾à¤µà¤Ÿ à¤šà¤²à¤¾à¤¤à¥‡ à¤¹à¥ˆà¤‚, à¤”à¤° à¤¬à¤¸ à¤•à¤­à¥€-à¤•à¤­à¤¾à¤° à¤•à¥‹à¤ˆ à¤…à¤ªà¤µà¤¾à¤¦ à¤†à¤ª à¤¤à¤• à¤ªà¤¹à¥à¤à¤šà¤¤à¤¾ à¤¹à¥ˆ",
      ],
      [
        "à¤†à¤ªà¤•à¥‹ à¤–à¥à¤¦ à¤¸à¥à¤Ÿà¤¾à¤«à¤¼ à¤•à¥€ à¤—à¤²à¤¤à¤¿à¤¯à¤¾à¤ à¤ªà¤•à¤¡à¤¼à¤¨à¥€ à¤”à¤° à¤¸à¥à¤§à¤°à¤µà¤¾à¤¨à¥€ à¤ªà¤¡à¤¼à¤¤à¥€ à¤¹à¥ˆà¤‚",
        "à¤†à¤ª à¤®à¤¾à¤¨ à¤²à¥‡à¤¤à¥‡ à¤¹à¥ˆà¤‚ à¤•à¤¿ à¤¸à¥à¤Ÿà¤¾à¤«à¤¼ à¤µà¤¹à¥€ à¤•à¤°à¥‡à¤—à¤¾ à¤œà¥‹ à¤†à¤ªà¤¨à¥‡ à¤¸à¤¿à¤–à¤¾à¤¯à¤¾ à¤¹à¥ˆ, à¤”à¤° à¤ªà¤¤à¤¾ à¤¤à¤­à¥€ à¤šà¤²à¤¤à¤¾ à¤¹à¥ˆ à¤œà¤¬ à¤•à¥à¤› à¤—à¤¡à¤¼à¤¬à¤¡à¤¼ à¤¹à¥‹ à¤œà¤¾à¤¤à¥€ à¤¹à¥ˆ",
        "à¤†à¤ªà¤•à¥‹ à¤°à¥‹à¤œà¤¼ à¤•à¤¿à¤¸à¥€ à¤®à¥ˆà¤¨à¥‡à¤œà¤° à¤¯à¤¾ à¤°à¤¿à¤•à¥‰à¤°à¥à¤¡ à¤¸à¥‡ à¤à¤• à¤¸à¤¾à¤°à¤¾à¤‚à¤¶ à¤®à¤¿à¤²à¤¤à¤¾ à¤¹à¥ˆ à¤•à¤¿ à¤•à¥à¤¯à¤¾ à¤—à¤¡à¤¼à¤¬à¤¡à¤¼ à¤¹à¥à¤ˆ",
      ],
    ],
    humanCapital: [
      [
        "à¤¨à¤ à¤²à¥‹à¤— à¤œà¤¼à¥à¤¯à¤¾à¤¦à¤¾à¤¤à¤° à¤•à¤¾à¤® à¤•à¤°à¤¤à¥‡-à¤•à¤°à¤¤à¥‡ à¤–à¥à¤¦ à¤¹à¥€ à¤¸à¥€à¤–à¤¤à¥‡ à¤¹à¥ˆà¤‚",
        "à¤¹à¤° à¤¨à¤ à¤•à¤°à¥à¤®à¤šà¤¾à¤°à¥€ à¤•à¥‹ à¤†à¤ª à¤–à¥à¤¦ à¤Ÿà¥à¤°à¥‡à¤¨à¤¿à¤‚à¤— à¤¦à¥‡à¤¤à¥‡ à¤¹à¥ˆà¤‚",
        "à¤Ÿà¥à¤°à¥‡à¤¨à¤¿à¤‚à¤— à¤®à¤Ÿà¥€à¤°à¤¿à¤¯à¤² à¤”à¤° à¤ªà¥à¤°à¥‹à¤—à¥à¤°à¥‡à¤¸ à¤Ÿà¥à¤°à¥ˆà¤•à¤¿à¤‚à¤— à¤•à¥€ à¤µà¤œà¤¹ à¤¸à¥‡ à¤‘à¤¨à¤¬à¥‹à¤°à¥à¤¡à¤¿à¤‚à¤— à¤†à¤ªà¤•à¥‡ à¤¬à¤¿à¤¨à¤¾ à¤­à¥€ à¤šà¤²à¤¤à¥€ à¤¹à¥ˆ",
      ],
      [
        "à¤…à¤—à¤° à¤†à¤ªà¤•à¤¾ à¤¸à¤¬à¤¸à¥‡ à¤…à¤¨à¥à¤­à¤µà¥€ à¤µà¥à¤¯à¤•à¥à¤¤à¤¿ à¤šà¤²à¤¾ à¤œà¤¾à¤, à¤¤à¥‹ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤•à¤¾ à¤¬à¤¹à¥à¤¤ à¤¬à¤¡à¤¼à¤¾ à¤¹à¤¿à¤¸à¥à¤¸à¤¾ à¤‰à¤¸à¤•à¥‡ à¤¸à¤¾à¤¥ à¤šà¤²à¤¾ à¤œà¤¾à¤à¤—à¤¾",
        "à¤…à¤—à¤° à¤µà¤¹ à¤šà¤²à¤¾ à¤œà¤¾à¤ à¤¤à¥‹ à¤†à¤ªà¤•à¥‹ à¤•à¥à¤› à¤®à¤¹à¥€à¤¨à¥‹à¤‚ à¤¤à¤• à¤‰à¤¸à¤•à¤¾ à¤•à¤¾à¤® à¤–à¥à¤¦ à¤¸à¤‚à¤­à¤¾à¤²à¤¨à¤¾ à¤ªà¤¡à¤¼à¥‡à¤—à¤¾",
        "à¤‰à¤¸à¤•à¤¾ à¤•à¤¾à¤® à¤²à¤¿à¤–à¤¿à¤¤ à¤°à¥‚à¤ª à¤®à¥‡à¤‚ à¤¦à¤°à¥à¤œ à¤¹à¥ˆ, à¤‡à¤¸à¤²à¤¿à¤ à¤•à¤¿à¤¸à¥€ à¤•à¥‹ à¤¤à¤¯ à¤¸à¤®à¤¯-à¤¸à¥€à¤®à¤¾ à¤®à¥‡à¤‚ à¤‰à¤¸ à¤•à¤¾à¤® à¤•à¥‡ à¤²à¤¿à¤ à¤¤à¥ˆà¤¯à¤¾à¤° à¤•à¤¿à¤¯à¤¾ à¤œà¤¾ à¤¸à¤•à¤¤à¤¾ à¤¹à¥ˆ",
      ],
    ],
    customerAcquisition: [
      [
        "à¤†à¤ª à¤…à¤ªà¤¨à¥‡ à¤ªà¤¿à¤›à¤²à¥‡ 10 à¤—à¥à¤°à¤¾à¤¹à¤•à¥‹à¤‚ à¤•à¥€ à¤¬à¤¿à¤•à¥à¤°à¥€ à¤ªà¤•à¥à¤•à¥€ à¤•à¤°à¤¨à¥‡ à¤®à¥‡à¤‚ à¤–à¥à¤¦ à¤¶à¤¾à¤®à¤¿à¤² à¤¥à¥‡",
        "à¤†à¤ªà¤•à¥€ à¤¸à¥‡à¤²à¥à¤¸ à¤Ÿà¥€à¤® à¤¨à¥‡ à¤‰à¤¨à¥à¤¹à¥‡à¤‚ à¤à¤• à¤†à¤œà¤¼à¤®à¤¾à¤ à¤¹à¥à¤ à¤ªà¤¿à¤š à¤¯à¤¾ à¤¸à¥à¤•à¥à¤°à¤¿à¤ªà¥à¤Ÿ à¤¸à¥‡ à¤œà¥‹à¤¡à¤¼à¤¾",
        "à¤µà¤¿à¤œà¥à¤žà¤¾à¤ªà¤¨ à¤”à¤° à¤®à¤¾à¤°à¥à¤•à¥‡à¤Ÿà¤¿à¤‚à¤— à¤–à¥à¤¦ à¤¹à¥€ à¤‰à¤¨à¥à¤¹à¥‡à¤‚ à¤²à¥‡ à¤†à¤ˆ",
      ],
      [
        "à¤œà¤¿à¤¨ à¤‡à¤¨à¥à¤•à¥à¤µà¤¾à¤¯à¤°à¥€ à¤¸à¥‡ à¤¬à¤¿à¤•à¥à¤°à¥€ à¤¨à¤¹à¥€à¤‚ à¤¹à¥à¤ˆ, à¤‰à¤¨à¤•à¤¾ à¤•à¥‹à¤ˆ à¤°à¤¿à¤•à¥‰à¤°à¥à¤¡ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆ",
        "à¤‡à¤¨à¥à¤•à¥à¤µà¤¾à¤¯à¤°à¥€ à¤•à¤¾ à¤«à¤¼à¥‰à¤²à¥‹-à¤…à¤ª à¤•à¤­à¥€-à¤•à¤­à¥€ à¤¹à¥‹à¤¤à¤¾ à¤¹à¥ˆ, à¤¯à¤¾ à¤†à¤ª à¤¬à¤¡à¤¼à¥€ à¤µà¤¾à¤²à¥€ à¤•à¥‹ à¤–à¥à¤¦ à¤ªà¤•à¤¡à¤¼à¤¤à¥‡ à¤¹à¥ˆà¤‚",
        "à¤¹à¤° à¤‡à¤¨à¥à¤•à¥à¤µà¤¾à¤¯à¤°à¥€ à¤«à¤¼à¥‰à¤²à¥‹-à¤…à¤ª à¤•à¥€ à¤¤à¤¾à¤°à¥€à¤–à¤¼ à¤•à¥‡ à¤¸à¤¾à¤¥ à¤¦à¤°à¥à¤œ à¤¹à¥‹à¤¤à¥€ à¤¹à¥ˆ",
      ],
    ],
    dataVisibility: {
      A: [
        [
          "à¤‘à¤°à¥à¤¡à¤° à¤•à¥‡ à¤¸à¥à¤Ÿà¥‡à¤Ÿà¤¸ à¤•à¥‡ à¤²à¤¿à¤ à¤†à¤ª à¤—à¥à¤°à¤¾à¤¹à¤• à¤•à¥‹ à¤¸à¤¿à¤°à¥à¤«à¤¼ à¤¯à¤¾à¤¦à¤¦à¤¾à¤¶à¥à¤¤ à¤¸à¥‡ à¤…à¤‚à¤¦à¤¾à¤œà¤¼à¤¾ à¤¬à¤¤à¤¾ à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚",
          "à¤‘à¤°à¥à¤¡à¤° à¤•à¤¾ à¤¸à¥à¤Ÿà¥‡à¤Ÿà¤¸ à¤œà¤¾à¤¨à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤µà¤°à¥à¤•à¤°à¥‹à¤‚ à¤•à¥‹ à¤«à¤¼à¥‹à¤¨ à¤•à¤°à¤¨à¤¾ à¤”à¤° à¤°à¤œà¤¿à¤¸à¥à¤Ÿà¤° à¤¦à¥‡à¤–à¤¨à¤¾ à¤ªà¤¡à¤¼à¤¤à¤¾ à¤¹à¥ˆ",
          "à¤†à¤ªà¤•à¤¾ à¤ªà¥à¤°à¥‹à¤¡à¤•à¥à¤¶à¤¨ à¤¶à¥‡à¤¡à¥à¤¯à¥‚à¤² à¤¸à¥à¤Ÿà¥‡à¤Ÿà¤¸ à¤”à¤° à¤ªà¥‚à¤°à¤¾ à¤¹à¥‹à¤¨à¥‡ à¤•à¥€ à¤¸à¤‚à¤­à¤¾à¤µà¤¿à¤¤ à¤¤à¤¾à¤°à¥€à¤–à¤¼ à¤ªà¤¹à¤²à¥‡ à¤¸à¥‡ à¤¦à¤¿à¤–à¤¾à¤¤à¤¾ à¤¹à¥ˆ",
        ],
        [
          "à¤ªà¥à¤°à¥‹à¤¡à¤•à¥à¤¶à¤¨ à¤”à¤° à¤°à¤¿à¤œà¥‡à¤•à¥à¤¶à¤¨ à¤ªà¥à¤°à¤¤à¤¿à¤¶à¤¤ à¤•à¤¾ à¤•à¥‹à¤ˆ à¤¸à¤¹à¥€ à¤°à¤¿à¤•à¥‰à¤°à¥à¤¡ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆ",
          "à¤†à¤ªà¤•à¥‹ à¤ªà¥à¤°à¥‹à¤¡à¤•à¥à¤¶à¤¨ à¤”à¤° à¤°à¤¿à¤œà¥‡à¤•à¥à¤¶à¤¨ à¤•à¥‡ à¤†à¤à¤•à¤¡à¤¼à¥‡ à¤¸à¤¿à¤°à¥à¤«à¤¼ à¤®à¥‹à¤Ÿà¥‡ à¤¤à¥Œà¤° à¤ªà¤° à¤ªà¤¤à¤¾ à¤¹à¥ˆà¤‚",
          "à¤†à¤ª à¤•à¤¿à¤¸à¥€ à¤¸à¥‡ à¤ªà¥‚à¤›à¥‡ à¤¬à¤¿à¤¨à¤¾ à¤‡à¤¸à¥‡ à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿ à¤®à¥‡à¤‚ à¤¦à¥‡à¤– à¤²à¥‡à¤¤à¥‡ à¤¹à¥ˆà¤‚",
        ],
      ],
      B: [
        [
          "6 à¤®à¤¹à¥€à¤¨à¥‡ à¤¸à¥‡ à¤¨ à¤¹à¤¿à¤²à¥‡ à¤¸à¥à¤Ÿà¥‰à¤• à¤•à¤¾ à¤ªà¤¤à¤¾ à¤²à¤—à¤¾à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤†à¤ªà¤•à¥‹ à¤–à¥à¤¦ à¤œà¤¾à¤•à¤° à¤¦à¥‡à¤–à¤¨à¤¾ à¤ªà¤¡à¤¼à¥‡à¤—à¤¾",
          "à¤†à¤ªà¤•à¥‹ à¤¯à¤¾à¤¦à¤¦à¤¾à¤¶à¥à¤¤ à¤¸à¥‡ à¤¬à¤¸ à¤®à¥‹à¤Ÿà¤¾-à¤®à¥‹à¤Ÿà¤¾ à¤ªà¤¤à¤¾ à¤¹à¥ˆ à¤•à¤¿ à¤•à¥Œà¤¨-à¤¸à¥‡ à¤†à¤‡à¤Ÿà¤® à¤§à¥€à¤®à¥‡ à¤¬à¤¿à¤• à¤°à¤¹à¥‡ à¤¹à¥ˆà¤‚",
          "à¤à¤œà¤¿à¤‚à¤— à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿ à¤†à¤ªà¤•à¥‹ à¤ à¥€à¤•-à¤ à¥€à¤• à¤¦à¤¿à¤–à¤¾à¤¤à¥€ à¤¹à¥ˆ à¤•à¤¿ à¤§à¥€à¤®à¥‡ à¤¬à¤¿à¤•à¤¨à¥‡ à¤µà¤¾à¤²à¥‡ à¤¸à¥à¤Ÿà¥‰à¤• à¤®à¥‡à¤‚ à¤•à¤¿à¤¤à¤¨à¥€ à¤°à¤•à¤® à¤«à¤à¤¸à¥€ à¤¹à¥ˆ",
        ],
        [
          "à¤®à¤¾à¤°à¥à¤•à¥‡à¤Ÿ à¤®à¥‡à¤‚ à¤ªà¤¡à¤¼à¥‡ à¤ªà¥ˆà¤¸à¥‡ à¤•à¤¾ à¤†à¤ªà¤•à¥‹ à¤¸à¤¿à¤°à¥à¤«à¤¼ à¤®à¥‹à¤Ÿà¤¾ à¤•à¥à¤² à¤†à¤à¤•à¤¡à¤¼à¤¾ à¤ªà¤¤à¤¾ à¤¹à¥ˆ",
          "à¤…à¤—à¤° à¤†à¤ª à¤ªà¥‚à¤›à¥‡à¤‚ à¤¤à¥‹ à¤†à¤ªà¤•à¤¾ à¤…à¤•à¤¾à¤‰à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤¬à¤•à¤¾à¤¯à¤¾ à¤°à¤•à¤® à¤¬à¤¤à¤¾ à¤¸à¤•à¤¤à¤¾ à¤¹à¥ˆ",
          "à¤†à¤ª à¤•à¤¿à¤¸à¥€ à¤¸à¥‡ à¤ªà¥‚à¤›à¥‡ à¤¬à¤¿à¤¨à¤¾ à¤†à¤‰à¤Ÿà¤¸à¥à¤Ÿà¥ˆà¤‚à¤¡à¤¿à¤‚à¤— à¤”à¤° à¤à¤œà¤¿à¤‚à¤— à¤¦à¥‹à¤¨à¥‹à¤‚ à¤¦à¥‡à¤– à¤²à¥‡à¤¤à¥‡ à¤¹à¥ˆà¤‚",
        ],
      ],
      C: [
        [
          "à¤•à¤² à¤•à¤¿à¤¤à¤¨à¥‡ à¤²à¥‹à¤— à¤†à¤ à¤¯à¤¾ à¤•à¤¿à¤¤à¤¨à¥‹à¤‚ à¤¨à¥‡ à¤–à¤°à¥€à¤¦à¤¾, à¤‡à¤¸à¤•à¤¾ à¤†à¤ªà¤•à¥‹ à¤•à¥‹à¤ˆ à¤¸à¤¹à¥€ à¤…à¤‚à¤¦à¤¾à¤œà¤¼à¤¾ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆ",
          "à¤†à¤ªà¤•à¥‡ à¤ªà¤¾à¤¸ à¤†à¤¨à¥‡ à¤µà¤¾à¤²à¥‡ à¤—à¥à¤°à¤¾à¤¹à¤•à¥‹à¤‚ à¤”à¤° à¤¬à¤¿à¤•à¥à¤°à¥€ à¤•à¤¾ à¤¬à¤¸ à¤à¤• à¤…à¤‚à¤¦à¤¾à¤œà¤¼à¤¾ à¤¹à¥ˆ",
          "à¤†à¤¨à¥‡ à¤µà¤¾à¤²à¥‡ à¤—à¥à¤°à¤¾à¤¹à¤• à¤”à¤° à¤¬à¤¿à¤•à¥à¤°à¥€ à¤ à¥€à¤• à¤¸à¥‡ à¤Ÿà¥à¤°à¥ˆà¤• à¤¹à¥‹à¤¤à¥‡ à¤¹à¥ˆà¤‚, à¤”à¤° à¤†à¤ªà¤•à¥‹ à¤à¤• à¤¸à¤¾à¤«à¤¼ à¤Ÿà¥à¤°à¥‡à¤‚à¤¡ à¤¦à¤¿à¤–à¤¤à¤¾ à¤¹à¥ˆ",
        ],
        [
          "à¤¸à¥à¤Ÿà¥‰à¤• à¤¨ à¤¹à¥‹à¤¨à¥‡ à¤¸à¥‡ à¤–à¥‹à¤ˆ à¤¹à¥à¤ˆ à¤¬à¤¿à¤•à¥à¤°à¥€ à¤•à¤¹à¥€à¤‚ à¤¦à¤°à¥à¤œ à¤¨à¤¹à¥€à¤‚ à¤¹à¥‹à¤¤à¥€",
          "à¤…à¤—à¤° à¤à¤¸à¤¾ à¤¬à¤¾à¤°-à¤¬à¤¾à¤° à¤¹à¥‹ à¤¤à¥‹ à¤¸à¥à¤Ÿà¤¾à¤«à¤¼ à¤†à¤ªà¤•à¥‹ à¤œà¤¼à¥à¤¬à¤¾à¤¨à¥€ à¤¬à¤¤à¤¾ à¤¦à¥‡à¤¤à¤¾ à¤¹à¥ˆ",
          "à¤¬à¤¿à¤•à¥à¤°à¥€ à¤–à¥‹à¤¨à¥‡ à¤•à¥‡ à¤•à¤¾à¤°à¤£ à¤¦à¤°à¥à¤œ à¤¹à¥‹à¤¤à¥‡ à¤¹à¥ˆà¤‚ à¤”à¤° à¤†à¤ª à¤‰à¤¨à¤•à¥€ à¤¸à¤®à¥€à¤•à¥à¤·à¤¾ à¤•à¤°à¤¤à¥‡ à¤¹à¥ˆà¤‚",
        ],
      ],
      D: [
        [
          "à¤…à¤—à¤° à¤†à¤ª à¤¦à¥‚à¤° à¤¹à¥‹à¤‚, à¤¤à¥‹ à¤¬à¤¿à¤•à¥à¤°à¥€ à¤”à¤° à¤¹à¤¾à¤œà¤¼à¤¿à¤°à¥€ à¤œà¤¾à¤¨à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤†à¤ªà¤•à¥‹ à¤­à¤°à¥‹à¤¸à¥‡ à¤ªà¤° à¤°à¤¹à¤¨à¤¾ à¤ªà¤¡à¤¼à¤¤à¤¾ à¤¹à¥ˆ",
          "à¤†à¤ªà¤•à¤¾ à¤®à¥ˆà¤¨à¥‡à¤œà¤° à¤«à¤¼à¥‹à¤¨ à¤•à¤°à¤•à¥‡ à¤¬à¤¿à¤•à¥à¤°à¥€ à¤”à¤° à¤¹à¤¾à¤œà¤¼à¤¿à¤°à¥€ à¤¬à¤¤à¤¾ à¤¦à¥‡à¤¤à¤¾ à¤¹à¥ˆ",
          "à¤à¤• à¤¸à¤¹à¥€ à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿà¤¿à¤‚à¤— à¤¸à¤¿à¤¸à¥à¤Ÿà¤® à¤¹à¥ˆ, à¤‡à¤¸à¤²à¤¿à¤ à¤†à¤ªà¤•à¥€ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€ à¤•à¥‡ à¤¬à¤¿à¤¨à¤¾ à¤•à¥à¤› à¤­à¥€ à¤¸à¤¿à¤¸à¥à¤Ÿà¤® à¤¸à¥‡ à¤¬à¤¾à¤¹à¤° à¤¨à¤¹à¥€à¤‚ à¤œà¤¾à¤¤à¤¾",
        ],
        [
          "à¤•à¥ˆà¤¶, à¤‘à¤¨à¤²à¤¾à¤‡à¤¨ à¤”à¤° à¤…à¤¸à¤²à¥€ à¤¬à¤¿à¤•à¥à¤°à¥€ à¤†à¤ªà¤¸ à¤®à¥‡à¤‚ à¤®à¤¿à¤²à¤¤à¥‡ à¤¹à¥ˆà¤‚ à¤¯à¤¾ à¤¨à¤¹à¥€à¤‚, à¤¯à¤¹ à¤•à¥‹à¤ˆ à¤…à¤²à¤— à¤¸à¥‡ à¤¨à¤¹à¥€à¤‚ à¤œà¤¾à¤à¤šà¤¤à¤¾",
          "à¤œà¤¬ à¤†à¤ª à¤®à¥Œà¤œà¥‚à¤¦ à¤¹à¥‹à¤¤à¥‡ à¤¹à¥ˆà¤‚, à¤¤à¤¬ à¤†à¤ª à¤–à¥à¤¦ à¤œà¤¾à¤à¤šà¤¤à¥‡ à¤¹à¥ˆà¤‚",
          "à¤†à¤ªà¤•à¥‹ à¤°à¥‹à¤œà¤¼à¤¾à¤¨à¤¾ à¤•à¤¾ à¤Ÿà¥ˆà¤²à¥€ à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿ à¤®à¤¿à¤²à¤¤à¤¾ à¤¹à¥ˆ, à¤”à¤° à¤•à¤¿à¤¸à¥€ à¤­à¥€ à¤•à¤®à¥€ à¤•à¥‹ à¤•à¤¾à¤°à¤£ à¤•à¥‡ à¤¸à¤¾à¤¥ à¤šà¤¿à¤¹à¥à¤¨à¤¿à¤¤ à¤•à¤¿à¤¯à¤¾ à¤œà¤¾à¤¤à¤¾ à¤¹à¥ˆ",
        ],
      ],
    },
  },
};

/** All BIL content, keyed by language. */
export const bilText: Record<Lang, BilText> = { en, hi };
