/* ─────────────────────────────────────────────────────────────
   BML Calculator — language content (English + Hinglish)
   ─────────────────────────────────────────────────────────────
   Data only (no React). Holds every piece of text the user READS
   in the calculator, once per language.

   IMPORTANT — display vs. stored values
   The values that are *stored, scored and submitted* (e.g. the
   "biggest problem" strings that bml-scoring.ts matches on, the
   answer text sent to Google Sheets) stay exactly as defined in
   bml-data.ts. This file only controls what is *shown*. Options are
   looked up by their `label` (A, B, C…) or by index, never by the
   translated text, so switching language can never change scoring
   or the data that gets submitted.

   "Hinglish" = Hindi written in Roman letters, mixed with the
   English business words Indian owners already use (SOP, team,
   staff, stock, dashboard, WhatsApp, marketing…).

   Related modules:
     - bml-data.ts      → canonical questions / options / scoring
     - language-switcher.tsx → the En / Hi pill + language hook
     - bml-client.tsx   → picks the right text and renders it
   ──────────────────────────────────────────────────────────── */

import { levels, gapCopy } from "./bml-data";

export type Lang = "en" | "hinglish";

/** Languages offered in the switcher. `short` is what the pill shows. */
export const LANGS: { id: Lang; short: string; label: string }[] = [
  { id: "en", short: "En", label: "English" },
  { id: "hinglish", short: "Hi", label: "Hinglish" },
];

/** Text for one quiz question. `options` is index-aligned with the
 *  canonical `questions[i].options` in bml-data.ts. */
export interface QuestionText {
  qLabel: string;
  question: string;
  options: string[];
}

/** Result copy for one weakest-dimension. The "cost" sentence is split
 *  so the highlighted (underlined) part can sit in the middle. */
export interface GapText {
  costPre: string;
  cost: string;
  costPost: string;
  risk: string;
  steps: [string, string][];
}

export interface UiText {
  languageToggleLabel: string;

  // Intro (step 0)
  introTitle: string;
  introSubtitle: {
    pre: string;
    chaotic: string;
    sep1: string;
    stable: string;
    sep2: string;
    ready: string;
    post: string;
  };
  yourName: string;
  yourNamePlaceholder: string;
  businessName: string;
  businessNamePlaceholder: string;
  painTag: string;
  painHeading: string;
  selectAll: string;
  revenueTag: string;
  revenueHeading: string;

  // Question steps
  otherPlaceholder: string;
  questionProgress: (n: number) => string;
  percentComplete: (pct: number) => string;
  back: string;
  next: string;
  checkScore: string;

  // Validation alerts
  alerts: {
    name: string;
    businessName: string;
    problem: string;
    revenue: string;
    option: string;
    email: string;
    emailInvalid: string;
    phone: string;
    businessType: string;
    description: string;
    city: string;
    invest: string;
  };

  // Lead capture (step 6)
  assessmentComplete: string;
  leadHeading: string;
  leadSub: string;
  emailLabel: string;
  emailHint: string;
  phoneLabel: string;
  phoneHint: string;
  businessTypeLabel: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  cityLabel: string;
  cityPlaceholder: string;
  cityHint: string;
  investLabel: string;
  generating: string;
  showResult: string;
  chipBenchmarks: string;
  chipAi: string;
  noSpamPre: string;
  noSpamBold: string;

  // Results (step 7). Hero reads: "Hey {name}" + heroMid + <stage + heroStageSuffix> + heroPost
  heroMid: string;
  heroStageSuffix: string;
  heroPost: string;
  dangerPre: string;
  dangerPost: string;
  fourSystems: string;
  weakestBadge: string;
  ladderTitle: string;
  biggestGapTitle: string;
  downloadResult: string;
  nextSteps: string;
  riskTitle: string;
  vaultLink: string;
  roadmapCta: string;
  roadmapBold1: string;
  roadmapMid: string;
  roadmapBold2: string;

  // Download modal
  modalTitle: string;
  close: string;
  exportNameLabel: string;
  themeColor: string;
  whatToShow: string;
  toggleScore: (pct: number) => string;
  toggleLevel: string;
  toggleDimensions: string;
}

export interface BmlText {
  ui: UiText;
  /** Index-aligned with `questions` in bml-data.ts (Q1…Q5). */
  questions: QuestionText[];
  /** Keyed by the option `label` (A, B, C…) from bml-data.ts. */
  biggestProblems: Record<string, string>;
  revenue: Record<string, string>;
  businessTypes: Record<string, string>;
  investment: Record<string, string>;
  /** Index-aligned with `levels` in bml-data.ts (L1…L5). */
  levelLines: string[];
  /** Keyed by dimension name (same keys as `gapCopy`). */
  gaps: Record<string, GapText>;
}

/* ══════════════════════════ ENGLISH ══════════════════════════ */

// English result copy already lives in bml-data.ts — reuse it so there is
// a single source of truth and the English text can never drift.
const enGaps: Record<string, GapText> = Object.fromEntries(
  Object.entries(gapCopy).map(([dimension, g]) => [
    dimension,
    {
      costPre: "This is costing you ",
      cost: g.cost,
      costPost: ` ${g.line}`,
      risk: g.risk,
      steps: g.steps,
    },
  ])
);

const en: BmlText = {
  ui: {
    languageToggleLabel: "Switch language",

    introTitle: "Business Maturity Calculator",
    introSubtitle: {
      pre: "Discover if your business is ",
      chaotic: "Chaotic",
      sep1: ", ",
      stable: "Stable",
      sep2: ", or ",
      ready: "Ready to Scale",
      post: ". Takes 30 seconds.",
    },
    yourName: "Your Name *",
    yourNamePlaceholder: "e.g. Rajesh Kumar",
    businessName: "Business Name *",
    businessNamePlaceholder: "e.g. Apex Manufacturing",
    painTag: "Pain Point Analysis",
    painHeading: "What do you feel are the biggest problems that you face? *",
    selectAll: "Select all that apply.",
    revenueTag: "Revenue Scale",
    revenueHeading: "What is your average monthly revenue? *",

    otherPlaceholder: "Write your details here...",
    questionProgress: (n) => `Question 0${n} of 05`,
    percentComplete: (pct) => `${pct}% Complete`,
    back: "Back",
    next: "Next",
    checkScore: "Check my score",

    alerts: {
      name: "Please enter your name",
      businessName: "Please enter your business name",
      problem: "Please select at least one problem",
      revenue: "Please select your average monthly revenue",
      option: "Please select an option",
      email: "Please enter your email address",
      emailInvalid: "Please enter a valid email address",
      phone: "Please enter a valid phone number",
      businessType: "Please select your type of business",
      description: "Please explain your business in brief",
      city: "Please enter your city and state",
      invest: "Please tell us if you are ready to invest",
    },

    assessmentComplete: "Assessment Complete",
    leadHeading: "Your result is ready!",
    leadSub: "Where should we send your personalized Business Maturity breakdown?",
    emailLabel: "Email Address (Required)",
    emailHint: "Business email is preferred.",
    phoneLabel: "Phone Number *",
    phoneHint: "Personal or business contact.",
    businessTypeLabel: "Type of Business *",
    descriptionLabel: "Explain Your Business in Brief *",
    descriptionPlaceholder: "What does your business do?",
    cityLabel: "City / State *",
    cityPlaceholder: "e.g. Jaipur, Rajasthan",
    cityHint: "Please enter city and state.",
    investLabel: "Are You Ready to Invest to Solve Your Business Problems? *",
    generating: "Generating Breakdown...",
    showResult: "Show My Result",
    chipBenchmarks: "Industry Benchmarks",
    chipAi: "AI-Powered Analysis",
    noSpamPre: "Don't worry, we value your focus. ",
    noSpamBold: "No spam. Only useful insights.",

    heroMid: ", your business is ",
    heroStageSuffix: ".",
    heroPost: "",
    dangerPre: "Most family businesses get stuck between ",
    dangerPost: " — the danger zone where growth stalls.",
    fourSystems: "The four systems of your business",
    weakestBadge: "WEAKEST",
    ladderTitle: "Your climb — maturity ladder",
    biggestGapTitle: "Your biggest gap",
    downloadResult: "Download your result",
    nextSteps: "YOUR NEXT STEPS",
    riskTitle: "What happens if you don't fix this",
    vaultLink: "Vault — free resources",
    roadmapCta: "GET YOUR CUSTOM SYSTEMS ROADMAP",
    roadmapBold1: "1-on-1 Strategy Session",
    roadmapMid: " · A customized systems blueprint for your business · ",
    roadmapBold2: "Step-by-step plan",

    modalTitle: "Customize and download Your result",
    close: "Close",
    exportNameLabel: "Your Name",
    themeColor: "Accent Theme Color",
    whatToShow: "What to show",
    toggleScore: (pct) => `Score ring (${pct}%)`,
    toggleLevel: "Maturity level & stage",
    toggleDimensions: "4-dimension breakdown",
  },

  // Clean English. The original quiz mixed in Hinglish fragments; those are
  // now proper English here (the Hinglish version lives below).
  questions: [
    {
      qLabel: "OPERATIONAL MATURITY",
      question:
        "If you had to go on a family trip for 10 days starting today, with your phone switched off the whole time, what would happen to your business? *",
      options: [
        "Nothing works without me",
        "A little work will get done, but problems pile up as soon as I'm back",
        "It will keep running smoothly - I have proper teams and systems",
        "Other (Please elaborate)",
      ],
    },
    {
      qLabel: "DATA VISIBILITY",
      question:
        "A client urgently asks for 1000+ units (or an order larger than your average order quantity). How fast can you check available stock and the expected order completion date? *",
      options: [
        "Hours / manual counting",
        "30–60 mins using Tally + Excel Formulas",
        "Instant Inventory and Order Management Dashboards",
        "Other (Please specify)",
      ],
    },
    {
      qLabel: "TEAM TRAINING",
      question: "Team Training - how do you train new staff? *",
      options: [
        "I personally train everyone",
        "Some standard documents/tutorials, but mostly I still have to teach them myself",
        "Clear SOP & training system",
        "Other",
      ],
    },
    {
      qLabel: "INTERNAL COMMUNICATION",
      question: "Internal Communication - how do you give instructions to your team? *",
      options: [
        "Manual guidance or call/WhatsApp",
        "Structured WhatsApp Groups by teams",
        "Automated Task Assignment, Reporting & Deadlines system",
        "Other",
      ],
    },
    {
      qLabel: "LEAD GENERATION",
      question: "Lead Generation - how do you find new customers? *",
      options: [
        "Only word of mouth",
        "Some ads / website / personal visits",
        "Automated lead generation funnel",
        "Other",
      ],
    },
  ],

  biggestProblems: {
    A: "Everything depends on me",
    B: "Staff leaves quickly",
    C: "No data tracking, only guesswork",
    D: "Sales are low",
    E: "Marketing and Branding are missing",
    F: "No Organizational Structure & Reporting Mechanism",
  },
  revenue: {
    A: "Under ₹5L",
    B: "₹5L - ₹20L",
    C: "₹20L - ₹50L",
    D: "₹50L - ₹5Cr",
    E: "Above ₹5Cr",
  },
  businessTypes: {
    A: "Manufacturing",
    B: "Digital Service/Product",
    C: "Retail",
    D: "Wholesale/Trader",
    E: "Other",
  },
  investment: {
    A: "Yes. If I find the right solution, I can invest both time and money",
    B: "Yes, can invest time, but not money",
    C: "Yes, can invest money, but not time",
    D: "No, not serious to scale",
  },

  levelLines: levels.map((l) => l.line),
  gaps: enGaps,
};

/* ══════════════════════════ HINGLISH ═════════════════════════ */

const hinglish: BmlText = {
  ui: {
    languageToggleLabel: "Bhasha badlein",

    introTitle: "Business Maturity Calculator",
    introSubtitle: {
      pre: "Jaaniye ki aapka business ",
      chaotic: "Chaotic",
      sep1: " hai, ",
      stable: "Stable",
      sep2: " hai, ya ",
      ready: "Scale karne ke liye Ready",
      post: " hai. Sirf 30 second lagenge.",
    },
    yourName: "Aapka Naam *",
    yourNamePlaceholder: "jaise: Rajesh Kumar",
    businessName: "Business Ka Naam *",
    businessNamePlaceholder: "jaise: Apex Manufacturing",
    painTag: "Problem Analysis",
    painHeading: "Aapke hisaab se aapki sabse badi problems kya hain? *",
    selectAll: "Jitni bhi lagu hon, sab select karein.",
    revenueTag: "Revenue Scale",
    revenueHeading: "Aapki average monthly revenue kitni hai? *",

    otherPlaceholder: "Apni baat detail mein likhein...",
    questionProgress: (n) => `Sawaal 0${n} / 05`,
    percentComplete: (pct) => `${pct}% Poora`,
    back: "Wapas",
    next: "Aage",
    checkScore: "Mera score dekhein",

    alerts: {
      name: "Please apna naam likhein",
      businessName: "Please apne business ka naam likhein",
      problem: "Please kam se kam ek problem select karein",
      revenue: "Please apni average monthly revenue select karein",
      option: "Please ek option select karein",
      email: "Please apna email address likhein",
      emailInvalid: "Please sahi email address likhein",
      phone: "Please sahi phone number likhein",
      businessType: "Please apne business ka type select karein",
      description: "Please apne business ke baare mein short mein batayein",
      city: "Please apna city aur state likhein",
      invest: "Please batayein ki kya aap invest karne ke liye ready hain",
    },

    assessmentComplete: "Assessment Poora Hua",
    leadHeading: "Aapka result ready hai!",
    leadSub: "Aapka personalized Business Maturity breakdown kahan bhejein?",
    emailLabel: "Email Address (Zaroori)",
    emailHint: "Business email behtar rahega.",
    phoneLabel: "Phone Number *",
    phoneHint: "Personal ya business number chalega.",
    businessTypeLabel: "Business Ka Type *",
    descriptionLabel: "Apne Business Ke Baare Mein Short Mein Batayein *",
    descriptionPlaceholder: "Aapka business kya karta hai?",
    cityLabel: "City / State *",
    cityPlaceholder: "jaise: Jaipur, Rajasthan",
    cityHint: "Please city aur state dono likhein.",
    investLabel: "Kya Aap Apne Business Ki Problems Solve Karne Ke Liye Invest Karne Ko Ready Hain? *",
    generating: "Breakdown Ban Raha Hai...",
    showResult: "Mera Result Dekhein",
    chipBenchmarks: "Industry Benchmarks",
    chipAi: "AI-Powered Analysis",
    noSpamPre: "Chinta na karein, hum aapke time ki kadar karte hain. ",
    noSpamBold: "Koi spam nahi. Sirf useful insights.",

    heroMid: ", aapka business ",
    heroStageSuffix: "",
    heroPost: " hai.",
    dangerPre: "Zyadatar family businesses ",
    dangerPost: " ke beech atak jate hain — yahi woh danger zone hai jahan growth ruk jati hai.",
    fourSystems: "Aapke business ke chaar systems",
    weakestBadge: "SABSE KAMZOR",
    ladderTitle: "Aapka safar — maturity ladder",
    biggestGapTitle: "Aapka sabse bada gap",
    downloadResult: "Apna result download karein",
    nextSteps: "AAPKE NEXT STEPS",
    riskTitle: "Agar aapne ise theek nahi kiya, to kya hoga",
    vaultLink: "Vault — free resources",
    roadmapCta: "APNA CUSTOM SYSTEMS ROADMAP LEIN",
    roadmapBold1: "1-on-1 Strategy Session",
    roadmapMid: " · Aapke business ke liye customized systems blueprint · ",
    roadmapBold2: "Step-by-step plan",

    modalTitle: "Apna result customize karein aur download karein",
    close: "Band karein",
    exportNameLabel: "Aapka Naam",
    themeColor: "Theme Ka Color",
    whatToShow: "Kya dikhana hai",
    toggleScore: (pct) => `Score ring (${pct}%)`,
    toggleLevel: "Maturity level aur stage",
    toggleDimensions: "4 dimensions ka breakdown",
  },

  questions: [
    {
      qLabel: "BUSINESS KITNA KHUD CHALTA HAI",
      question:
        "Agar aapko aaj se 10 din ke liye family trip par jaana ho, aur poore 10 din aapka phone band rahe, to aapke business ka kya hoga? *",
      options: [
        "Mere bina to kuch nahi chalta",
        "Thoda-bahut kaam ho jayega, lekin wapas aate hi problems ka dher lag jata hai",
        "Sab smoothly chalta rahega - mere paas proper team aur systems hain",
        "Kuch aur (please detail mein batayein)",
      ],
    },
    {
      qLabel: "DATA KI VISIBILITY",
      question:
        "Ek client turant 1000+ units (ya aapke average order se bade order) maang raha hai. Available stock aur order poora hone ki expected date aap kitni jaldi check kar sakte hain? *",
      options: [
        "Ghante lag jate hain / manually count karna padta hai",
        "30–60 minute lagte hain, Tally + Excel formulas se",
        "Turant - Inventory aur Order Management dashboards se",
        "Kuch aur (please detail mein likhein)",
      ],
    },
    {
      qLabel: "TEAM TRAINING",
      question: "Team Training - naye staff ko aap kaise train karte hain? *",
      options: [
        "Sabko train karne ka kaam mera hi hai",
        "Kuch standard documents/tutorials hain, lekin zyadatar mujhe khud hi sikhana padta hai",
        "Clear SOP aur training system hai",
        "Kuch aur",
      ],
    },
    {
      qLabel: "TEAM COMMUNICATION",
      question: "Internal Communication - aap team ko instructions kaise dete hain? *",
      options: [
        "Manually samjhana ya call/WhatsApp par",
        "Team-wise structured WhatsApp groups",
        "Automated Task Assignment, Reporting aur Deadlines ka system",
        "Kuch aur",
      ],
    },
    {
      qLabel: "NAYE CUSTOMERS (LEAD GENERATION)",
      question: "Lead Generation - aap naye customers kaise dhundhte hain? *",
      options: [
        "Sirf word of mouth se",
        "Kuch ads / website / personal visits se",
        "Automated lead generation funnel hai",
        "Kuch aur",
      ],
    },
  ],

  biggestProblems: {
    A: "Sab kuch mujh par hi depend hai",
    B: "Staff bahut jaldi chhod kar chale jate hain",
    C: "Koi data tracking nahi hai, sirf andaaze se kaam chalta hai",
    D: "Sales kam hain",
    E: "Marketing aur Branding ki kami hai",
    F: "Koi Organizational Structure aur Reporting System nahi hai",
  },
  revenue: {
    A: "₹5L se kam",
    B: "₹5L - ₹20L",
    C: "₹20L - ₹50L",
    D: "₹50L - ₹5Cr",
    E: "₹5Cr se zyada",
  },
  businessTypes: {
    A: "Manufacturing",
    B: "Digital Service/Product",
    C: "Retail",
    D: "Wholesale/Trader",
    E: "Kuch aur",
  },
  investment: {
    A: "Haan. Agar sahi solution mile, to time aur paisa dono invest kar sakte hain",
    B: "Haan, time invest kar sakte hain, lekin paisa nahi",
    C: "Haan, paisa invest kar sakte hain, lekin time nahi",
    D: "Nahi, scale karne ko lekar abhi serious nahi hain",
  },

  levelLines: [
    "Jaise hi aap phone band karte hain, aapka business ruk jata hai.",
    "Aap business ko nahi chala rahe, business aapko chala raha hai.",
    "Aapke paas systems hain — lekin unhe chalane ke liye abhi bhi aapki zaroorat padti hai.",
    "Aapka business processes par chalta hai, aapki maujoodgi par nahi.",
    "Aapka business aapke bina bhi chalta aur badhta hai.",
  ],

  gaps: {
    "Operational Efficiency": {
      costPre: "Iski wajah se aapke ",
      cost: "har hafte 20+ ghante",
      costPost: " baar-baar instructions dene aur fire-fighting mein chale jate hain.",
      risk: "Agar aap agle 12 mahine bhi Owner-Dependent mode mein rahe, to har process aapke dimaag mein hi rahega. Jis din aap door honge, kaam ruk jayega — aur jitna zyada kaam aap lenge, aapka Operational Efficiency gap utna hi badhta jayega.",
      steps: [
        ["Audit karein", "apne top 5 baar-baar hone wale kaam — jo bhi aap har hafte dohrate hain, sab likh lein."],
        ["Document karein", "sabse zyada repeat hone wale kaam ka ek SOP, aaj hi."],
        ["Delegate karein", "woh kaam ek aise team member ko, jiske paas ab us SOP ki zimmedari hogi."],
      ],
    },
    "Financial Control": {
      costPre: "Iski wajah se aapke ",
      cost: "lakhon rupaye",
      costPost: " untracked cash flow aur invoicing ki deri mein phanse rehte hain.",
      risk: "Financial Control mazboot kiye bina aap margins ke mamle mein andhere mein rahenge. 12 mahine baad revenue to badh jayega, lekin profit nahi — aur aapko phir bhi pata nahi hoga ki kaun se products se sach mein paisa aa raha hai.",
      steps: [
        ["Track karein", "30 din tak har rupaya jo aaye aur jaye, ek simple sheet mein."],
        ["Tight karein", "apna invoicing cycle — dues ka follow-up har hafte, mahine mein ek baar nahi."],
        ["Review karein", "product-level margins, taaki aap nuksaan mein bechna band kar sakein."],
      ],
    },
    "Human Capital": {
      costPre: "Iski wajah se aapka ",
      cost: "har naya hire",
      costPost: " turnover, baar-baar retraining aur role confusion mein barbaad ho jata hai.",
      risk: "Kamzor Human Capital system ke saath aap wahi roles baar-baar hire aur retrain karte rahenge. Ek saal baad bhi sirf aap hi jaante honge ki kaam kaise hota hai — aur achhe log chhodkar jate rahenge.",
      steps: [
        ["Define karein", "clear roles — kaun kis cheez ka zimmedar hai, ek hi page par."],
        ["Banayein", "agle hire ke liye 1-hafte ki onboarding checklist."],
        ["Train karein", "ek person ko, taaki woh ek process ko shuru se end tak poori tarah own kar sake."],
      ],
    },
    "Digital Maturity": {
      costPre: "Iski wajah se aapke ",
      cost: "roz ke kai ghante",
      costPost: " us manual kaam mein chale jate hain jo software ko karna chahiye.",
      risk: "Digital Maturity kam rehne ka matlab hai manual registers, WhatsApp ka chaos aur koi asli data nahi. Jo competitors systemize kar lete hain woh tezi se aage badhte hain, aur aap poora din ek register se doosre mein numbers copy karte rehte hain.",
      steps: [
        ["Chunein", "ek pareshan karne wala manual kaam, jise aap kisi simple tool mein shift kar sakein."],
        ["Centralize karein", "apna data — ek hi jagah par, 5 notebooks mein nahi."],
        ["Automate karein", "ek repetitive report, taaki woh aapke bina apne aap ban jaye."],
      ],
    },
  },
};

/** All BML content, keyed by language. */
export const bmlText: Record<Lang, BmlText> = { en, hinglish };
