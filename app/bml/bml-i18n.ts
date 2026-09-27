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

export type Lang = "en" | "hi";

/** `short` is what the navbar pill shows for the CURRENT language. */
export const LANGS: { id: Lang; short: string; label: string }[] = [
  { id: "en", short: "En", label: "English" },
  { id: "hi", short: "हिं", label: "हिन्दी" },
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
  levelNames: Record<string, string>; // canonical level name -> the name shown to the user
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

    bottleneckHeading: "Your **#1** constraint",
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

/* ═════════════════════════ HINDI (देवनागरी) ═════════════════════════ */

const hi: BilText = {
  ui: {
    languageToggleLabel: "भाषा बदलें",

    introEyebrow: "3,000+ SME मालिक अपना स्कोर चेक कर चुके हैं",
    introTitle: "बिज़नेस इंडिपेंडेंस लेवल कैलकुलेटर",
    introSub: "जानिए आपका सबसे कमज़ोर सिस्टम कौन-सा है, उसकी वजह क्या है, और वह आपको कितना महँगा पड़ रहा है — 2 मिनट से भी कम में।",
    categoryHeading: "अपने बिज़नेस की कैटेगरी चुनें *",
    revenueHeading: "अपना सालाना रेवेन्यू / टर्नओवर रेंज चुनें *",

    questionProgress: (n) => `सवाल 0${n} / 08`,
    percentComplete: (pct) => `${pct}% पूरा`,
    back: "वापस",
    next: "आगे",
    checkScore: "मेरा स्कोर देखें",

    alerts: {
      category: "कृपया अपने बिज़नेस की कैटेगरी चुनें",
      revenue: "कृपया अपना सालाना रेवेन्यू रेंज चुनें",
      option: "कृपया एक विकल्प चुनें",
      name: "कृपया अपना नाम लिखें",
      businessName: "कृपया अपने बिज़नेस / फ़र्म का नाम लिखें",
      whatsapp: "कृपया सही WhatsApp नंबर लिखें",
      emailInvalid: "कृपया सही ईमेल पता लिखें",
    },

    leadHeading: "आपका BIL स्कोर तैयार है",
    leadSub: "बस एक आख़िरी कदम:",
    nameLabel: "आपका नाम क्या है *",
    namePlaceholder: "जैसे: राजेश कुमार",
    businessNameLabel: "आपके बिज़नेस / फ़र्म का नाम क्या है *",
    businessNamePlaceholder: "जैसे: एपेक्स मैन्युफैक्चरिंग",
    whatsappLabel: "आपका बिज़नेस संपर्क नंबर (WhatsApp) *",
    whatsappHint: "आपकी विस्तृत रिपोर्ट हम यहीं भेजेंगे।",
    emailLabel: "ईमेल ID (वैकल्पिक)",
    emailHint: "सिर्फ़ तब भरें जब आप ईमेल पर भी कॉपी चाहते हों।",
    generating: "आपका स्कोर निकाला जा रहा है...",
    showResult: "मेरा रिज़ल्ट दिखाएँ",

    resultEyebrow: "आपका स्कोर",
    heroHeadline: (name, levelName) => `${name}, आपका बिज़नेस ${levelName} है।`,
    ringCaption: "100 में से",
    levelOfTotal: (index, name) => `लेवल ${index} / 4 · ${name}`,
    scrollPrompt: "इसका 60 सेकंड का स्पष्टीकरण इसी पेज पर नीचे है।",

    benchmarkHeading: "बेंचमार्क",
    benchmarkStat: (percentile) =>
      percentile.kind === "bottom"
        ? { value: 100 - percentile.value, caption: "बिज़नेस आपसे ज़्यादा स्कोर करते हैं" }
        : { value: percentile.value, caption: "बिज़नेस आपसे कम स्कोर करते हैं" },
    benchmarkCopy: (branch, percentile, categoryLabel, categoryAvg) => {
      const opening =
        percentile.kind === "bottom"
          ? `आप यह टेस्ट देने वाले 3,000+ बिज़नेस में से सबसे नीचे के ${percentile.value}% में हैं।`
          : `आपने यह टेस्ट देने वाले 3,000+ बिज़नेस में से ${percentile.value}% से ज़्यादा स्कोर किया है।`;
      if (branch === "below") {
        return `${opening} औसत ${categoryLabel} बिज़नेस का स्कोर ${categoryAvg} है। **आप अपनी ही इंडस्ट्री से पीछे हैं।** यहाँ ज़्यादातर मालिक सोचते हैं कि समस्या स्टाफ़ की क्वालिटी की है। अक्सर ऐसा नहीं होता।`;
      }
      if (branch === "within") {
        return `${opening} यानी आप ठीक इंडस्ट्री के औसत पर हैं। **यह कोई तारीफ़ की बात नहीं है।** हमारे डेटा में **94% बिज़नेस लेवल 2 पर अटके हुए हैं।** आपकी इंडस्ट्री का औसत बिज़नेस अपने मालिक के बिना नहीं चल सकता।`;
      }
      return `${opening} यह ${categoryLabel} के औसत से ज़्यादा है। आपके और लेवल 4 के बीच का फ़ासला आपकी सोच से छोटा है, और **अक्सर वह एक ही सिस्टम होता है, चार नहीं।**`;
    },

    fourSystemsHeading: "चार स्तंभ",
    weakestCaption: "सबसे कमज़ोर सिस्टम",

    bottleneckHeading: "आपकी **#1** रुकावट",
    answerSentence: (clauseA, clauseB) => `आपने बताया कि ${clauseA} — और यह भी कि ${clauseB}।`,
    bottleneckFooter: "यह ठीक हो सकता है। नीचे 60 सेकंड का वीडियो देखें।",

    costHeading: "कुछ न करने की कीमत",
    costIntro: "3,000+ SME में हमें एक ही पैटर्न मिला: बिना सिस्टम के बिज़नेस चुपचाप अपने रेवेन्यू का कम से कम 1% हर साल खो देता है।",
    costLeadIn: "आपके रेवेन्यू लेवल पर, यह है:",
    costStatSuffix: "हर साल",
    costFragment: "डेड स्टॉक। हाथ से किए गए हिसाब। भूले हुए हॉट लीड — क्योंकि इन्हें पकड़ने के लिए कोई सिस्टम था ही नहीं।",

    openLoopHeading: "यह स्कोर क्या नहीं दिखा सकता",
    openLoopItems: (pillarLabel) => [
      "सबसे पहले कौन-सा प्रोसेस ठीक करना है। गलत प्रोसेस ठीक किया तो तीन महीने बर्बाद होंगे।",
      `क्या आपकी ${pillarLabel} की समस्या सच में ${pillarLabel} की ही है — या किसी और बड़ी समस्या का लक्षण है।`,
      "आपके बिज़नेस को असल में क्या चाहिए — बनाम वह जो एक फ़ॉर्म से अंदाज़ा लगाया जा सकता है।",
    ],
    openLoopFooter: "इनके लिए किसी को आपके असली बिज़नेस को देखना होगा।",

    vslPlaceholder: "VSL प्लेसहोल्डर",
    vslCaption: "60 सेकंड · म्यूट ऑटोप्ले · बर्न-इन कैप्शन",
    vslHint: "( यहाँ असली वीडियो आएगा )",

    nextStepEyebrow: "अगला कदम",
    ctaHeadline: "60 मिनट में अपना इंडिपेंडेंस स्कोर बढ़ाएँ।",
    ctaSub: "आपके बिज़नेस पर एक लाइव वर्किंग ऑडिट — कोई सामान्य सलाह नहीं।",
    ctaBullets: [
      "सिस्टम कैसे काम करते हैं, इसकी साफ़ समझ — ताकि बिज़नेस मालिक पर निर्भर न रहे",
      "आपकी असली रुकावट की पहचान, और उसे ठीक करने वाला सिस्टम",
      "एक पेज का 90 दिन का इंडिपेंडेंस रोडमैप",
      "आपके बिज़नेस में लगाए गए दो QR-आधारित चेकपॉइंट — आपका स्टाफ़ इसी हफ़्ते से रिपोर्ट करना शुरू करेगा",
      "30 दिन की रोज़ाना WhatsApp रिपोर्ट — क्या हुआ, क्या गड़बड़ लग रहा है, क्या करना है",
    ],
    ctaPrice: (amount) => `₹${amount}`,
    perSessionLabel: "एक सेशन",
    ctaGuarantee: "अगर सेशन के 48 घंटे के अंदर आपकी पहली रोज़ाना रिपोर्ट WhatsApp पर नहीं पहुँचती, तो पूरा रिफ़ंड मिलेगा।",
    ctaButton: "अपना सेशन बुक करें",

    testimonialsHeading: "ग्राहकों की राय",
    footerServices: "हमारी सेवाएँ",
    footerCalculator: "बिज़नेस इंडिपेंडेंस लेवल कैलकुलेटर",
    footerSession: "सिस्टम्स स्ट्रैटेजी सेशन",
    footerConnect: "हमसे जुड़ें",
  },

  categories: {
    A: "मैन्युफैक्चरिंग",
    B: "होलसेल या ट्रेडिंग",
    C: "शोरूम बिज़नेस (ज्वेलरी, कपड़ों की रिटेल, हार्डवेयर और सैनिटरी आदि)",
    D: "सर्विसेज़ / QSR / रिटेल",
  },
  revenue: {
    a: "1 करोड़ से कम",
    b: "1 – 10 करोड़",
    c: "10 – 50 करोड़",
    d: "50 – 100 करोड़",
    e: "100 करोड़ +",
  },
  pillarLabels: {
    operationalEfficiency: "ऑपरेशनल एफ़िशिएंसी",
    humanCapital: "ह्यूमन कैपिटल",
    customerAcquisition: "कस्टमर एक्विज़िशन",
    dataVisibility: "डेटा विज़िबिलिटी",
  },
  levelNames: {
    "Owner-Trapped": "मालिक में फँसा हुआ",
    "Owner-Dependent": "मालिक पर निर्भर",
    "Team-Run": "टीम-संचालित",
    "Owner-Independent": "मालिक से स्वतंत्र",
  },
  levelTaglines: {
    "Owner-Trapped": "जब आप रुकते हैं, बिज़नेस भी रुक जाता है।",
    "Owner-Dependent": "आपका बिज़नेस तभी चलता है जब आप देख रहे होते हैं। नज़र हटी, बिज़नेस रुका।",
    "Team-Run": "आपकी टीम दिन का ज़्यादातर काम संभालती है। आप सिर्फ़ अपवाद वाले मामले संभालते हैं।",
    "Owner-Independent": "रोज़मर्रा के कामकाज के लिए आप ज़रूरी नहीं हैं। अब बिज़नेस बढ़ाने का समय है।",
  },

  generalQuestions: [
    {
      question: "सोचिए आप 10 दिन के फ़ैमिली ट्रिप पर जाते हैं और फ़ोन साइलेंट रखते हैं। आपके बिज़नेस का क्या होगा?",
      options: [
        "मेरे बिना कुछ नहीं चलता",
        "कुछ काम हो जाता है, लेकिन मेरी गैरहाज़िरी में समस्याएँ जमा हो जाती हैं",
        "सब बिना रुकावट चलता है — मेरे पास सही टीम और प्रोसीजर हैं, बस कभी-कभार कोई अपवाद मेरे पास आता है",
      ],
    },
    {
      question: "आपके कुछ स्टैंडर्ड हैं जिनका पालन होना चाहिए — क्वालिटी, ईमानदारी, मूल्य। यह कौन सुनिश्चित करता है कि इनका पालन हो रहा है?",
      options: [
        "मैं खुद देखता हूँ और स्टाफ़ को सुधारने के लिए कहता हूँ",
        "मैं मान लेता हूँ कि स्टाफ़ वही करेगा जो मैंने सिखाया है — पता तब चलता है जब कुछ गड़बड़ हो जाती है",
        "रोज़ जाँच होती है — मुझे किसी मैनेजर या रिकॉर्ड से एक सारांश मिलता है कि क्या गड़बड़ हुई",
      ],
    },
    {
      question: "आप एक नया कर्मचारी रखते हैं। उसे ट्रेनिंग देने की ज़िम्मेदारी किसकी है?",
      options: [
        "वह काम करते-करते खुद सीख लेता है",
        "मैं सबको खुद ट्रेनिंग देता हूँ",
        "ट्रेनिंग मटीरियल और प्रोग्रेस ट्रैकिंग मौजूद है, इसलिए ऑनबोर्डिंग मेरे बिना भी चलती है",
      ],
    },
    {
      question: "आपका सबसे अनुभवी कर्मचारी कल बता देता है कि वह 30 दिन में नौकरी छोड़ रहा है। क्या होगा?",
      options: [
        "मैं मुश्किल में हूँ — बहुत सारा काम सिर्फ़ उसके दिमाग़ में है",
        "हम संभाल लेंगे, लेकिन मुझे कुछ महीनों तक उसका काम खुद संभालना पड़ेगा",
        "उसका काम लिखित रूप में दर्ज है, और किसी को तय समय-सीमा में उस काम के लिए तैयार किया जा सकता है",
      ],
    },
    {
      question: "आपके पिछले 10 नए ग्राहकों को आपके बिज़नेस के बारे में कैसे पता चला?",
      options: [
        "मैं खुद शामिल था — कॉल करना, फ़ॉलो-अप करना, बिक्री पक्की करना",
        "सेल्स टीम या स्टाफ़ ने एक आज़माए हुए पिच या स्क्रिप्ट से उन्हें कॉल किया",
        "विज्ञापन और मार्केटिंग से — डिजिटल, सोशल मीडिया, वेबसाइट लीड",
      ],
    },
    {
      question: "पिछले महीने जो इन्क्वायरी आईं और जिन्होंने खरीदा नहीं — उनमें से कितनों का फ़ॉलो-अप हुआ?",
      options: [
        "कोई रिकॉर्ड नहीं है",
        "स्टाफ़ कभी-कभी फ़ॉलो-अप करता है, या बड़ी वाली इन्क्वायरी को मैं खुद पकड़ता हूँ",
        "हर इन्क्वायरी फ़ॉलो-अप की तारीख़ के साथ दर्ज होती है",
      ],
    },
  ],

  categoryQuestions: {
    A: [
      {
        question: "एक ग्राहक फ़ोन करके ऑर्डर का स्टेटस पूछता है। उसे सही जवाब देने में आपको कितना समय लगता है?",
        options: [
          "मैं याददाश्त से अंदाज़ा बता देता हूँ",
          "मैं वर्करों को फ़ोन करता हूँ, रजिस्टर और तैयार माल का लॉग देखता हूँ",
          "मैं प्रोडक्शन शेड्यूल देखता हूँ — स्टेटस और पूरा होने की संभावित तारीख़ पहले से निकली हुई है",
        ],
      },
      {
        question: "पिछले 3 महीने का प्रोडक्शन और रिजेक्शन प्रतिशत — क्या आप अभी बता सकते हैं?",
        options: [
          "कोई सही रिकॉर्ड नहीं है",
          "मुझे मोटा-मोटा पता है, सटीक नहीं",
          "हाँ — मैं किसी से पूछे बिना रिपोर्ट में देख लेता हूँ",
        ],
      },
    ],
    B: [
      {
        question: "अभी आपके गोदाम में जो स्टॉक पड़ा है, उसमें से कितना 6 महीने से हिला नहीं है?",
        options: [
          "कोई अंदाज़ा नहीं — खुद जाकर देखना पड़ेगा",
          "मुझे याददाश्त से मोटा-मोटा पता है कि कौन-से आइटम धीमे बिक रहे हैं",
          "मुझे एजिंग रिपोर्ट मिलती है — मुझे ठीक-ठीक पता है कि धीमे बिकने वाले स्टॉक में कितनी रकम फँसी है",
        ],
      },
      {
        question: "अभी आपका कितना पैसा मार्केट में पड़ा है, और उसमें से कितना आपकी क्रेडिट शर्तों से ज़्यादा लेट हो चुका है?",
        options: [
          "मुझे मोटा कुल आँकड़ा पता है",
          "अगर मैं कहूँ तो मेरा अकाउंटेंट बता सकता है",
          "मैं किसी से पूछे बिना आउटस्टैंडिंग और एजिंग देख लेता हूँ",
        ],
      },
    ],
    C: [
      {
        question: "कल कितने लोग शोरूम में आए, और कितनों ने खरीदारी की?",
        options: [
          "कोई सही अंदाज़ा नहीं — कुछ दर्ज नहीं है",
          "मेरे दिमाग़ में एक अंदाज़ा है",
          "यह ठीक से ट्रैक होता है, और मुझे एक साफ़ ट्रेंड दिखता है",
        ],
      },
      {
        question: "कल एक ग्राहक ने कुछ माँगा जो आपके पास स्टॉक में नहीं था। यह कहाँ दर्ज होता है?",
        options: [
          "कहीं नहीं — उसे मना कर दिया और वह चला गया",
          "अगर ऐसा बार-बार हो तो स्टाफ़ मुझे ज़ुबानी बता देता है",
          "बिक्री खोने के कारण दर्ज होते हैं और मैं उनकी समीक्षा करता हूँ",
        ],
      },
    ],
    D: [
      {
        question: "आप 3 दिन के लिए दुकान से दूर हैं। आज की बिक्री और स्टाफ़ की हाज़िरी का पता आपको कैसे चलता है?",
        options: [
          "कोई अंदाज़ा नहीं — भरोसा करना पड़ता है कि वे ठीक से काम कर रहे होंगे",
          "मैं अपने मैनेजर को फ़ोन करता हूँ और वह बता देता है",
          "एक सही रिपोर्टिंग सिस्टम है — मुझे भरोसा है कि मेरी जानकारी के बिना कुछ भी सिस्टम से बाहर नहीं जाता",
        ],
      },
      {
        question: "कल की क्लोज़िंग — कैश, ऑनलाइन, और जो असल में बिका। ये तीनों आपस में मिलते हैं, यह कौन जाँचता है, और अगर नहीं मिलते तो क्या होता है?",
        options: [
          "अलग से कोई नहीं जाँचता",
          "जब मैं मौजूद होता हूँ, तब मैं खुद जाँचता हूँ",
          "मुझे रोज़ाना का टैली रिपोर्ट मिलता है और किसी भी कमी को कारण के साथ चिह्नित किया जाता है",
        ],
      },
    ],
  },

  answerClauses: {
    operationalEfficiency: [
      [
        "आपके बिज़नेस में तब तक कुछ नहीं हिलता जब तक आप खुद उसे न देखें",
        "आपके बिना कुछ काम तो हो जाता है, लेकिन आपकी गैरहाज़िरी में समस्याएँ तेज़ी से जमा हो जाती हैं",
        "आपकी टीम और प्रोसीजर सब कुछ बिना रुकावट चलाते हैं, और बस कभी-कभार कोई अपवाद आप तक पहुँचता है",
      ],
      [
        "आपको खुद स्टाफ़ की गलतियाँ पकड़नी और सुधरवानी पड़ती हैं",
        "आप मान लेते हैं कि स्टाफ़ वही करेगा जो आपने सिखाया है, और पता तभी चलता है जब कुछ गड़बड़ हो जाती है",
        "आपको रोज़ किसी मैनेजर या रिकॉर्ड से एक सारांश मिलता है कि क्या गड़बड़ हुई",
      ],
    ],
    humanCapital: [
      [
        "नए लोग ज़्यादातर काम करते-करते खुद ही सीखते हैं",
        "हर नए कर्मचारी को आप खुद ट्रेनिंग देते हैं",
        "ट्रेनिंग मटीरियल और प्रोग्रेस ट्रैकिंग की वजह से ऑनबोर्डिंग आपके बिना भी चलती है",
      ],
      [
        "अगर आपका सबसे अनुभवी व्यक्ति चला जाए, तो बिज़नेस का बहुत बड़ा हिस्सा उसके साथ चला जाएगा",
        "अगर वह चला जाए तो आपको कुछ महीनों तक उसका काम खुद संभालना पड़ेगा",
        "उसका काम लिखित रूप में दर्ज है, इसलिए किसी को तय समय-सीमा में उस काम के लिए तैयार किया जा सकता है",
      ],
    ],
    customerAcquisition: [
      [
        "आप अपने पिछले 10 ग्राहकों की बिक्री पक्की करने में खुद शामिल थे",
        "आपकी सेल्स टीम ने उन्हें एक आज़माए हुए पिच या स्क्रिप्ट से जोड़ा",
        "विज्ञापन और मार्केटिंग खुद ही उन्हें ले आई",
      ],
      [
        "जिन इन्क्वायरी से बिक्री नहीं हुई, उनका कोई रिकॉर्ड नहीं है",
        "इन्क्वायरी का फ़ॉलो-अप कभी-कभी होता है, या आप बड़ी वाली को खुद पकड़ते हैं",
        "हर इन्क्वायरी फ़ॉलो-अप की तारीख़ के साथ दर्ज होती है",
      ],
    ],
    dataVisibility: {
      A: [
        [
          "ऑर्डर के स्टेटस के लिए आप ग्राहक को सिर्फ़ याददाश्त से अंदाज़ा बता सकते हैं",
          "ऑर्डर का स्टेटस जानने के लिए वर्करों को फ़ोन करना और रजिस्टर देखना पड़ता है",
          "आपका प्रोडक्शन शेड्यूल स्टेटस और पूरा होने की संभावित तारीख़ पहले से दिखाता है",
        ],
        [
          "प्रोडक्शन और रिजेक्शन प्रतिशत का कोई सही रिकॉर्ड नहीं है",
          "आपको प्रोडक्शन और रिजेक्शन के आँकड़े सिर्फ़ मोटे तौर पर पता हैं",
          "आप किसी से पूछे बिना इसे रिपोर्ट में देख लेते हैं",
        ],
      ],
      B: [
        [
          "6 महीने से न हिले स्टॉक का पता लगाने के लिए आपको खुद जाकर देखना पड़ेगा",
          "आपको याददाश्त से बस मोटा-मोटा पता है कि कौन-से आइटम धीमे बिक रहे हैं",
          "एजिंग रिपोर्ट आपको ठीक-ठीक दिखाती है कि धीमे बिकने वाले स्टॉक में कितनी रकम फँसी है",
        ],
        [
          "मार्केट में पड़े पैसे का आपको सिर्फ़ मोटा कुल आँकड़ा पता है",
          "अगर आप पूछें तो आपका अकाउंटेंट बकाया रकम बता सकता है",
          "आप किसी से पूछे बिना आउटस्टैंडिंग और एजिंग दोनों देख लेते हैं",
        ],
      ],
      C: [
        [
          "कल कितने लोग आए या कितनों ने खरीदा, इसका आपको कोई सही अंदाज़ा नहीं है",
          "आपके पास आने वाले ग्राहकों और बिक्री का बस एक अंदाज़ा है",
          "आने वाले ग्राहक और बिक्री ठीक से ट्रैक होते हैं, और आपको एक साफ़ ट्रेंड दिखता है",
        ],
        [
          "स्टॉक न होने से खोई हुई बिक्री कहीं दर्ज नहीं होती",
          "अगर ऐसा बार-बार हो तो स्टाफ़ आपको ज़ुबानी बता देता है",
          "बिक्री खोने के कारण दर्ज होते हैं और आप उनकी समीक्षा करते हैं",
        ],
      ],
      D: [
        [
          "अगर आप दूर हों, तो बिक्री और हाज़िरी जानने के लिए आपको भरोसे पर रहना पड़ता है",
          "आपका मैनेजर फ़ोन करके बिक्री और हाज़िरी बता देता है",
          "एक सही रिपोर्टिंग सिस्टम है, इसलिए आपकी जानकारी के बिना कुछ भी सिस्टम से बाहर नहीं जाता",
        ],
        [
          "कैश, ऑनलाइन और असली बिक्री आपस में मिलते हैं या नहीं, यह कोई अलग से नहीं जाँचता",
          "जब आप मौजूद होते हैं, तब आप खुद जाँचते हैं",
          "आपको रोज़ाना का टैली रिपोर्ट मिलता है, और किसी भी कमी को कारण के साथ चिह्नित किया जाता है",
        ],
      ],
    },
  },
};

/** All BIL content, keyed by language. */
export const bilText: Record<Lang, BilText> = { en, hi };
