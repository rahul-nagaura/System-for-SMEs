/* ─────────────────────────────────────────────────────────────
   Business Independence Level (BIL) Calculator — V2 language content
   ─────────────────────────────────────────────────────────────
   Data only (no React). Holds every piece of text the user READS.

   IMPORTANT — display vs. stored/scored values
   Everything that is *scored* lives in bml-data.ts / bml-scoring.ts as
   canonical (English) structural data, addressed by id/index — never by
   translated text. This file only controls what is *shown*, so switching
   language can never change scoring or the submitted payload.

   A few things needed a judgment call, flagged inline with "SPEC NOTE":
     - Block 4's answer paragraph combines BOTH of the weakest pillar's
       question answers into one flowing sentence (per the reference design
       shared 2026-09-22), via `answerSentence(clauseA, clauseB)` +
       `answerClauses` below. The clauses are short fragments written to
       slot into that template — not verbatim option text, which doesn't
       read naturally when stitched together.
     - Block 7's headline ("Raise your Independence Score in 60 minutes")
       is the literal spec copy, even though the VSL notes two sections
       later explicitly warn against implying a score moves in an hour.
       Kept as specified — flagged for Rahul to reconcile.
     - Below the CTA: the FINAL design (shared 2026-09-23) shows a
       Testimonials section + the site footer instead of the earlier
       proof-cards / FAQ / vault-link blocks, so those were removed. The
       testimonial itself is a single real quote taken from that design,
       kept in English in both languages (a quote is not translated).
     - The tie-break RULE (Data Visibility first) is implemented exactly as
       stated, even though both the spec's Block 3 example AND the
       reference design mark Human Capital as weakest in an identical tie
       — see bml-scoring.ts. Only affects which pillar is highlighted when
       two or more are exactly tied for lowest.

   Related modules:
     - bml-data.ts    → canonical categories/brackets/questions/tables
     - bml-scoring.ts → the numbers these strings wrap
     - language-switcher.tsx → the En/Hi pill + language hook (imports
       `Lang`/`LANGS` from this file)
     - bml-client.tsx → picks the right text and renders it
   ──────────────────────────────────────────────────────────── */

import type { CategoryId, PillarId } from "./bml-data";
import type { BenchmarkBranch } from "./bml-scoring";

export type Lang = "en" | "hinglish";

export const LANGS: { id: Lang; short: string; label: string }[] = [
  { id: "en", short: "En", label: "English" },
  { id: "hinglish", short: "Hi", label: "Hinglish" },
];

export interface QuestionText {
  question: string;
  options: [string, string, string];
}

/** A short fragment per option (0/1/2), written to slot into
 *  `answerSentence(clauseA, clauseB)` — NOT full standalone sentences. */
type ClausePair = [[string, string, string], [string, string, string]];

export interface UiText {
  languageToggleLabel: string;

  // Section 1 — intro (not scored)
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

  // Section 4 — lead capture
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

  // Results — Block 1 headline (dark hero + score ring)
  resultEyebrow: string;
  heroHeadline: (name: string, levelName: string) => string;
  ringCaption: string;
  levelOfTotal: (index: number, name: string) => string;
  scrollPrompt: string;

  // Block 2 — benchmark
  benchmarkHeading: string;
  /** The big stat number + its caption, framed so it always reads as
   *  "how many are below/above you" regardless of bottom/higher framing. */
  benchmarkStat: (percentile: { kind: "bottom" | "higher"; value: number }) => { value: number; caption: string };
  benchmarkCopy: (branch: BenchmarkBranch, percentile: { kind: "bottom" | "higher"; value: number }, categoryLabel: string, categoryAvg: string) => string;

  // Block 3 — four systems
  fourSystemsHeading: string;
  weakestCaption: string;

  // Block 4 — bottleneck
  bottleneckHeading: string;
  answerSentence: (clauseA: string, clauseB: string) => string;
  bottleneckFooter: string;

  // Block 5 — cost of inaction
  costHeading: string;
  costIntro: string;
  costLeadIn: string;
  costStatSuffix: string;
  costFragment: string;

  // Block 6 — open the loop
  openLoopHeading: string;
  openLoopItems: (pillarLabel: string) => [string, string, string];
  openLoopFooter: string;

  // VSL
  vslPlaceholder: string;
  vslCaption: string;
  vslHint: string;

  // Block 7 — CTA
  nextStepEyebrow: string;
  ctaHeadline: string;
  ctaSub: string;
  ctaBullets: string[];
  /** Wraps the price pulled from GlobalSettings (see bml-client.tsx) — never a fixed string. */
  ctaPrice: (amount: string) => string;
  perSessionLabel: string;
  ctaGuarantee: string;
  ctaButton: string;

  // Below the CTA — testimonials + footer labels
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
  levelTaglines: Record<string, string>; // keyed by canonical level name
  generalQuestions: QuestionText[]; // index-aligned with data.generalQuestions
  categoryQuestions: Record<CategoryId, [QuestionText, QuestionText]>;
  /** Block 4 clause fragments — see `answerSentence` above. Keyed by pillar;
   *  Data Visibility varies by category since its questions do. */
  answerClauses: {
    operationalEfficiency: ClausePair;
    humanCapital: ClausePair;
    customerAcquisition: ClausePair;
    dataVisibility: Record<CategoryId, ClausePair>;
  };
}

/* ══════════════════════════ ENGLISH ══════════════════════════ */

const en: BilText = {
  ui: {
    languageToggleLabel: "Switch language",

    introEyebrow: "3,000+ SME owners have checked their score",
    introTitle: "Business Independence Level Calculator",
    introSub: "Find out your weakest system, the reason behind it, and what it's costing you — under 2 minutes.",
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

    leadHeading: "Your result is almost ready",
    leadSub: "Just a few more details:",
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

    resultEyebrow: "Your Result",
    heroHeadline: (name, levelName) => `${name}, your business is ${levelName}.`,
    ringCaption: "Out of 100",
    levelOfTotal: (index, name) => `Level ${index} of 4 · ${name}`,
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

    bottleneckHeading: "Your #1 constraint",
    answerSentence: (clauseA, clauseB) => `You answered that ${clauseA} — and that ${clauseB}.`,
    bottleneckFooter: "This is fixable. See the 60s video below.",

    costHeading: "Cost of doing nothing",
    costIntro: "Across 3,000+ SMEs we found the same pattern: a business without systems quietly loses at least 1% of its revenue every year.",
    costLeadIn: "At your revenue level, that is:",
    costStatSuffix: "every year",
    costFragment: "Dead stock. Manual calculations. Hot leads forgotten — because there was no system to catch it.",

    openLoopHeading: "What this score can't see",
    openLoopItems: (pillarLabel) => [
      "Which process to fix first. Fix the wrong one and you lose three months.",
      `Whether your ${pillarLabel} problem is really a ${pillarLabel} problem — or a symptom of something upstream.`,
      "What your business specifically needs, versus what a form can infer.",
    ],
    openLoopFooter: "These need someone to look at your actual business.",

    vslPlaceholder: "VSL placeholder",
    vslCaption: "60 sec · muted autoplay · burned-in captions",
    vslHint: "( real video appears here )",

    nextStepEyebrow: "The next step",
    ctaHeadline: "Raise your Independence Score in 60 minutes.",
    ctaSub: "A live working audit on your business — not generic advice.",
    ctaBullets: [
      "A clear understanding of how systems make a business owner-independent",
      "Your real bottleneck identified, with a system to fix it",
      "A one-page 90-day independence roadmap",
      "Two QR-based checkpoints installed in your business — your staff starts reporting this week",
      "30 days of daily WhatsApp reports — what happened, what looks wrong, what to do",
    ],
    ctaPrice: (amount) => `₹${amount}`,
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
    b: "1 – 10 Cr",
    c: "10 – 50 Cr",
    d: "50 – 100 Cr",
    e: "100 Cr +",
  },
  pillarLabels: {
    operationalEfficiency: "Operational Efficiency",
    humanCapital: "Human Capital",
    customerAcquisition: "Customer Acquisition",
    dataVisibility: "Data Visibility",
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
        "Runs smoothly — I have proper teams and procedures, only rare exceptions come to me",
      ],
    },
    {
      question: "You have standards to be followed — quality, ethics, values. Who ensures they are followed?",
      options: [
        "I personally notice and tell the staff to correct",
        "I assume the staff follow what I have taught them — find out only when something goes wrong",
        "Checked daily — I get a summary of what broke, from a manager or a record",
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
        "I am in trouble — a lot of work exists only in his head",
        "We will manage, but I will have to step back into his work for a few months",
        "His work is documented, and someone can be trained into it on a defined timeline",
      ],
    },
    {
      question: "How did your last 10 new customers find out about your business?",
      options: [
        "I was personally involved — calling, following up, closing the sale",
        "Sales team or staff called them using a tested pitch or script",
        "Advertising and marketing — digital, social media, website leads",
      ],
    },
    {
      question: "Of the enquiries that came in last month and did not buy — how many were followed up?",
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
          "I check the production schedule — status and expected completion date are already calculated",
        ],
      },
      {
        question: "Last 3 months' production and rejection percentage — can you tell it right now?",
        options: [
          "No proper record exists",
          "I know it roughly, not accurate",
          "Yes — I see it in a report without asking anyone",
        ],
      },
    ],
    B: [
      {
        question: "Of the stock sitting in your godown right now, how much has not moved in 6 months?",
        options: [
          "No idea — I would have to physically check",
          "I roughly know which items are slow, from memory",
          "I get an ageing report — I know the exact value stuck in slow-moving stock",
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
          "No proper idea — nothing recorded",
          "I have an estimate in mind",
          "It is properly tracked, with a clear trend I can see",
        ],
      },
      {
        question: "Yesterday a customer asked for something you did not have in stock. Where is that recorded?",
        options: [
          "Nowhere — told him no and he left",
          "Staff mention it to me verbally if it happens often",
          "Lost-sale reasons are recorded and I review them",
        ],
      },
    ],
    D: [
      {
        question: "You are away from the shop for 3 days. How do you find out today's sales, and your staff's attendance?",
        options: [
          "No idea — I have to rely on trust and hope they work properly",
          "I call my manager and he tells me",
          "A proper reporting system — I am confident nothing goes off-system without me knowing",
        ],
      },
      {
        question: "Yesterday's closing — cash, online, and what was actually sold. Who checks that those three match, and what happens when they do not?",
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

/* ══════════════════════════ HINGLISH ═════════════════════════ */

const hinglish: BilText = {
  ui: {
    languageToggleLabel: "Bhasha badlein",

    introEyebrow: "3,000+ SME owners apna score check kar chuke hain",
    introTitle: "Business Independence Level Calculator",
    introSub: "Apna sabse kamzor system, uski wajah, aur uski cost jaaniye — 2 minute se kam mein.",
    categoryHeading: "Apna business category select karein *",
    revenueHeading: "Apna annual revenue / turnover range select karein *",

    questionProgress: (n) => `Sawaal 0${n} / 08`,
    percentComplete: (pct) => `${pct}% Poora`,
    back: "Wapas",
    next: "Aage",
    checkScore: "Mera score dekhein",

    alerts: {
      category: "Please apna business category select karein",
      revenue: "Please apna annual revenue range select karein",
      option: "Please ek option select karein",
      name: "Please apna naam likhein",
      businessName: "Please apne business / firm ka naam likhein",
      whatsapp: "Please sahi WhatsApp number likhein",
      emailInvalid: "Please sahi email address likhein",
    },

    leadHeading: "Aapka result bas ready hone wala hai",
    leadSub: "Bas kuch aur details chahiye:",
    nameLabel: "Aapka naam kya hai *",
    namePlaceholder: "jaise: Rajesh Kumar",
    businessNameLabel: "Aapke business / firm ka naam kya hai *",
    businessNamePlaceholder: "jaise: Apex Manufacturing",
    whatsappLabel: "Aapka business contact number (WhatsApp) *",
    whatsappHint: "Aapki detailed breakdown yahan bhejenge.",
    emailLabel: "Email ID (optional)",
    emailHint: "Sirf tab bharein agar email par bhi copy chahiye.",
    generating: "Aapka score calculate ho raha hai...",
    showResult: "Mera result dikhayein",

    resultEyebrow: "Aapka Result",
    heroHeadline: (name, levelName) => `${name}, aapka business ${levelName} hai.`,
    ringCaption: "100 mein se",
    levelOfTotal: (index, name) => `Level ${index} / 4 · ${name}`,
    scrollPrompt: "Iska 60-second explanation is page mein neeche hai.",

    benchmarkHeading: "Benchmark",
    benchmarkStat: (percentile) =>
      percentile.kind === "bottom"
        ? { value: 100 - percentile.value, caption: "businesses aapse zyada score karte hain" }
        : { value: percentile.value, caption: "businesses aapse kam score karte hain" },
    benchmarkCopy: (branch, percentile, categoryLabel, categoryAvg) => {
      const opening =
        percentile.kind === "bottom"
          ? `Aap 3,000+ businesses mein se bottom ${percentile.value}% mein hain, jinhone yeh test diya hai.`
          : `Aapne 3,000+ businesses mein se ${percentile.value}% se zyada score kiya hai, jinhone yeh test diya hai.`;
      if (branch === "below") {
        return `${opening} Average ${categoryLabel} business ka score hai ${categoryAvg}. **Aap apni hi industry se peeche hain.** Zyadatar owners yahan sochte hain ki problem staff ki quality hai. Aksar aisa nahi hota.`;
      }
      if (branch === "within") {
        return `${opening} Isse aap seedha industry average par aa jate hain. **Yeh koi tareef nahi hai.** Hamare data mein, **94% businesses Level 2 par atke hue hain.** Is industry ka average business apne owner ke bina nahi chal sakta.`;
      }
      return `${opening} Yeh ${categoryLabel} ke average se zyada hai. Aapke aur Level 4 ke beech ka gap jitna aap sochte hain usse chhota hai, aur **aksar ek hi system hota hai, chaar nahi.**`;
    },

    fourSystemsHeading: "Chaar pillars",
    weakestCaption: "Sabse kamzor system",

    bottleneckHeading: "Aapki #1 rukawat",
    answerSentence: (clauseA, clauseB) => `Aapne bataya ki ${clauseA} — aur ki ${clauseB}.`,
    bottleneckFooter: "Yeh theek ho sakta hai. Neeche 60 second ka video dekhein.",

    costHeading: "Kuch na karne ki keemat",
    costIntro: "3,000+ SMEs mein humein ek hi pattern mila: bina system ke business chupchap apni revenue ka kam se kam 1% har saal khota hai.",
    costLeadIn: "Aapke revenue level par, yeh hai:",
    costStatSuffix: "har saal",
    costFragment: "Dead stock. Manual calculations. Bhoole hue hot leads — kyunki inhe pakadne ke liye koi system nahi tha.",

    openLoopHeading: "Yeh score kya nahi dikha sakta",
    openLoopItems: (pillarLabel) => [
      "Sabse pehle kaunsa process fix karna hai. Galat process fix kiya to teen mahine barbaad honge.",
      `Kya aapki ${pillarLabel} ki problem sach mein ${pillarLabel} ki hai — ya kisi aur badi problem ka lakshan hai.`,
      "Aapke business ko exactly kya chahiye, uske muqaable mein jo ek form bata sakta hai.",
    ],
    openLoopFooter: "Inke liye kisi ko aapke asli business ko dekhna hoga.",

    vslPlaceholder: "VSL placeholder",
    vslCaption: "60 sec · muted autoplay · burned-in captions",
    vslHint: "( yahan asli video aayega )",

    nextStepEyebrow: "Agla step",
    ctaHeadline: "60 minute mein apna Independence Score badhayein.",
    ctaSub: "Aapke business par ek live working audit — koi generic advice nahi.",
    ctaBullets: [
      "Systems kaise kaam karte hain iski clear samajh, taaki business owner-independent bane",
      "Aapki asli rukawat identify hogi, usse fix karne ke system ke saath",
      "Ek page ka 90-din ka independence roadmap",
      "Aapke business mein install kiye gaye do QR-based checkpoints — staff isi hafte se report karna shuru karega",
      "30 din ke daily WhatsApp reports — kya hua, kya galat lag raha hai, kya karna hai",
    ],
    ctaPrice: (amount) => `₹${amount}`,
    perSessionLabel: "ek session",
    ctaGuarantee: "Agar session ke 48 ghante ke andar aapka pehla daily report WhatsApp par nahi aata, to poora refund milega.",
    ctaButton: "Apna session book karein",

    testimonialsHeading: "Testimonials",
    footerServices: "Hamari Services",
    footerCalculator: "Business Independence Level Calculator",
    footerSession: "Systems Strategy Session",
    footerConnect: "Humse judein",
  },

  categories: {
    A: "Manufacturing",
    B: "Wholesale ya Trading",
    C: "Showroom Businesses (Jewellery, Clothing Retail, Hardware & Sanitary, etc.)",
    D: "Services / QSR / Retail",
  },
  revenue: {
    a: "1 Cr se kam",
    b: "1 – 10 Cr",
    c: "10 – 50 Cr",
    d: "50 – 100 Cr",
    e: "100 Cr +",
  },
  pillarLabels: {
    operationalEfficiency: "Operational Efficiency",
    humanCapital: "Human Capital",
    customerAcquisition: "Customer Acquisition",
    dataVisibility: "Data Visibility",
  },
  levelTaglines: {
    "Owner-Trapped": "Jab aap rukte hain, business bhi ruk jaata hai.",
    "Owner-Dependent": "Aapka business tabhi chalta hai jab aap dekh rahe hote hain. Nazar hati, business ruka.",
    "Team-Run": "Aapki team din ka zyada kaam sambhalti hai. Aap sirf exceptions handle karte hain.",
    "Owner-Independent": "Daily operations ke liye aap optional hain. Ab scale karne ka time hai.",
  },

  generalQuestions: [
    {
      question: "Socho aap 10 din ke liye family trip par jaate hain aur phone silent rakhte hain. Aapke business ka kya hoga?",
      options: [
        "Mere bina kuch nahi chalta",
        "Kuch kaam ho jaata hai, lekin mere na hone par problems jama ho jaati hain",
        "Sab smoothly chalta hai — mere paas proper team aur procedures hain, sirf kabhi-kabhi koi exception mere paas aata hai",
      ],
    },
    {
      question: "Aapke kuch standards hain jo follow karne hote hain — quality, ethics, values. Yeh follow ho rahe hain, kaise pata chalta hai?",
      options: [
        "Main khud dekhta hoon aur staff ko theek karne ko kehta hoon",
        "Main maan leta hoon ki staff wahi karega jo maine sikhaya — pata tab chalta hai jab kuch galat ho jaata hai",
        "Roz check hota hai — mujhe ek summary milti hai ki kya galat hua, kisi manager ya record se",
      ],
    },
    {
      question: "Aap ek naya employee hire karte hain. Usse train karne ki zimmedari kiski hai?",
      options: [
        "Woh khud kaam karte-karte seekh leta hai",
        "Main khud sabko train karta hoon",
        "Training material aur progress tracking hai, isliye onboarding mere bina bhi chalta hai",
      ],
    },
    {
      question: "Aapka sabse experienced employee kal bata deta hai ki woh 30 din mein chhod raha hai. Kya hoga?",
      options: [
        "Main mushkil mein hoon — bahut sara kaam sirf uske dimaag mein hai",
        "Hum manage kar lenge, lekin mujhe kuch mahine ke liye uska kaam sambhalna padega",
        "Uska kaam documented hai, aur kisi ko ek tay time-frame mein us kaam ke liye train kiya ja sakta hai",
      ],
    },
    {
      question: "Aapke last 10 naye customers ko aapke business ke baare mein kaise pata chala?",
      options: [
        "Main khud involved tha — call karna, follow-up karna, sale close karna",
        "Sales team ya staff ne ek tested pitch ya script use karke unhe call kiya",
        "Advertising aur marketing se — digital, social media, website leads",
      ],
    },
    {
      question: "Pichle mahine jo enquiries aayi thi aur nahi khareeda — unmein se kitno ka follow-up hua?",
      options: [
        "Koi record nahi hai",
        "Staff kabhi-kabhi follow-up karte hain, ya main khud bade wale chase karta hoon",
        "Har enquiry ek follow-up date ke saath log hoti hai",
      ],
    },
  ],

  categoryQuestions: {
    A: [
      {
        question: "Ek customer call karke order status poochta hai. Sahi jawab dene mein aapko kitna time lagta hai?",
        options: [
          "Main memory se ek estimate deta hoon",
          "Main workers ko call karta hoon, registers aur finished goods log check karta hoon",
          "Main production schedule check karta hoon — status aur expected completion date pehle se calculate hai",
        ],
      },
      {
        question: "Pichle 3 mahine ka production aur rejection percentage — abhi bata sakte hain?",
        options: [
          "Koi proper record nahi hai",
          "Mujhe roughly pata hai, accurate nahi",
          "Haan — bina kisi se poochhe, ek report mein dekh leta hoon",
        ],
      },
    ],
    B: [
      {
        question: "Abhi aapke godown mein jo stock pada hai, usmein se kitna 6 mahine se move nahi hua?",
        options: [
          "Koi idea nahi — physically check karna padega",
          "Mujhe roughly pata hai kaunse items slow hain, memory se",
          "Mujhe ek ageing report milti hai — mujhe exact pata hai kitni value slow-moving stock mein phansi hai",
        ],
      },
      {
        question: "Abhi aapka kitna paisa market mein pada hai, aur usmein se kitna aapke credit terms se overdue hai?",
        options: [
          "Mujhe rough total pata hai",
          "Agar main kahoon to accountant bata sakta hai",
          "Bina kisi se poochhe, outstanding aur ageing dekh leta hoon",
        ],
      },
    ],
    C: [
      {
        question: "Kal kitne log walk-in hue, aur kitno ne khareeda?",
        options: [
          "Koi proper idea nahi — kuch record nahi hai",
          "Mere paas ek estimate hai dimaag mein",
          "Yeh properly track hota hai, mujhe ek clear trend dikhta hai",
        ],
      },
      {
        question: "Kal ek customer ne kuch maanga jo aapke paas stock mein nahi tha. Yeh kahan record hota hai?",
        options: [
          "Kahin nahi — usse mana kar diya aur woh chala gaya",
          "Agar aisa baar-baar ho to staff mujhe verbally bata dete hain",
          "Lost-sale ki wajahein record hoti hain aur main unhe review karta hoon",
        ],
      },
    ],
    D: [
      {
        question: "Aap 3 din ke liye shop se door hain. Aaj ki sales aur staff ki attendance ka pata kaise chalta hai?",
        options: [
          "Koi idea nahi — bharosa karna padta hai ki woh sahi se kaam kar rahe honge",
          "Main apne manager ko call karta hoon aur woh bata deta hai",
          "Ek proper reporting system hai — mujhe bharosa hai ki mere bina kuch bhi off-system nahi jaata",
        ],
      },
      {
        question: "Kal ki closing — cash, online, aur jo actually becha gaya. Yeh teeno match karte hain, yeh kaun check karta hai, aur agar nahi match karte to kya hota hai?",
        options: [
          "Koi alag se check nahi karta",
          "Jab main hota hoon, main khud check karta hoon",
          "Mujhe ek daily tally report milti hai aur koi kami ho to wajah ke saath flag hoti hai",
        ],
      },
    ],
  },

  answerClauses: {
    operationalEfficiency: [
      [
        "aapke bina business mein kuch nahi hilta, sab aapki nazar se guzarta hai",
        "aapke bina kuch kaam to hota hai, lekin aapki absence mein problems jaldi jama ho jati hain",
        "aapki team aur procedures sab smoothly chalate hain, sirf kabhi-kabhi koi exception aap tak pahunchta hai",
      ],
      [
        "aapko khud dekhna aur staff ko theek karne ko kehna padta hai",
        "aap maan lete hain ki staff wahi karega jo sikhaya gaya — pata tab chalta hai jab kuch galat ho jaata hai",
        "aapko roz ek summary milti hai ki kya galat hua, manager ya record se",
      ],
    ],
    humanCapital: [
      [
        "naye log zyadatar khud kaam karte-karte seekhte hain",
        "aap khud har naye hire ko train karte hain",
        "training material aur progress tracking ki wajah se onboarding aapke bina bhi chalta hai",
      ],
      [
        "agar aapka sabse experienced banda chhod de, to business ka bahut sara hissa uske saath chala jayega",
        "agar woh chhod de to aapko kuch mahine ke liye uska kaam khud sambhalna padega",
        "uska kaam documented hai, isliye kisi ko ek tay timeline par us kaam ke liye train kiya ja sakta hai",
      ],
    ],
    customerAcquisition: [
      [
        "aap khud involved the apne last 10 customers close karne mein",
        "aapki sales team ne unhe ek tested pitch ya script se close kiya",
        "advertising aur marketing khud hi unhe le aayi",
      ],
      [
        "jo enquiries convert nahi hui, unka koi record nahi hai",
        "enquiries ka follow-up kabhi-kabhi hota hai, ya aap khud bade wale chase karte hain",
        "har enquiry ek follow-up date ke saath log hoti hai",
      ],
    ],
    dataVisibility: {
      A: [
        [
          "order status ke liye aap sirf memory se ek estimate de sakte hain",
          "order status check karne ke liye workers ko call karna aur registers dekhna padta hai",
          "aapka production schedule pehle se status aur expected completion dikhata hai",
        ],
        [
          "production aur rejection percentage ka koi proper record nahi hai",
          "aapko production aur rejection numbers sirf roughly pata hain",
          "bina kisi se poochhe, aap ek report mein yeh dekh lete hain",
        ],
      ],
      B: [
        [
          "6 mahine se na hile stock ke baare mein jaanne ke liye aapko physically check karna padega",
          "aapko roughly pata hai kaunse items slow-moving hain, memory se",
          "ek ageing report aapko exactly dikhati hai ki kitni value slow-moving stock mein phansi hai",
        ],
        [
          "market mein pade paise ka aapko sirf rough total pata hai",
          "agar aap poochein to accountant outstanding dues bata sakta hai",
          "bina kisi se poochhe, aap outstanding aur ageing dono dekh lete hain",
        ],
      ],
      C: [
        [
          "kal kitne log aaye ya kitno ne khareeda, iska aapko koi proper idea nahi hai",
          "aapke paas walk-ins aur sales ka sirf ek andaaza hai",
          "walk-ins aur sales properly track hote hain, aur aapko ek clear trend dikhta hai",
        ],
        [
          "stock na hone se hui lost sale kahin record nahi hoti",
          "aisa baar-baar ho to staff aapko verbally bata dete hain",
          "lost-sale ki wajahein record hoti hain aur aap unhe review karte hain",
        ],
      ],
      D: [
        [
          "agar aap door hon, to sales aur attendance jaanne ke liye bharosa karna padta hai",
          "aapka manager call karke sales aur attendance bata deta hai",
          "ek proper reporting system hai, isliye aapke bina kuch bhi off-system nahi jaata",
        ],
        [
          "cash, online aur actual sales match karte hain ya nahi, yeh koi alag se check nahi karta",
          "jab aap hote hain, tab aap khud check karte hain",
          "aapko ek daily tally report milti hai, aur koi kami ho to wajah ke saath flag hoti hai",
        ],
      ],
    },
  },
};

/** All BIL content, keyed by language. */
export const bilText: Record<Lang, BilText> = { en, hinglish };
