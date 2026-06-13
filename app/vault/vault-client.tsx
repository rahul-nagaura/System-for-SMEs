"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const defaultPrompts = [
  {
    id: "sales-sop",
    label: "Sales Process SOP Generator",
    text: `You are an operations consultant who builds simple, practical Standard Operating Procedures (SOPs) for small and medium Indian businesses. You do NOT use corporate jargon. You write in clear, simple language that a shop owner or factory owner can hand directly to their staff.

Your job: help me create a complete, ready-to-use SALES PROCESS SOP for my business.

RULES:
- Ask me ONE question at a time. Wait for my answer before asking the next. Do not ask everything at once.
- Keep questions simple and in plain language. If I give a vague answer, ask a quick follow-up to get specifics.
- You may use Hindi/Hinglish words if I do, to keep it natural.

Ask me, one by one:
1. What does your business sell, and who is your typical customer? (retail / wholesale / manufacturing / service)
2. How does a new lead or customer usually reach you? (walk-in, WhatsApp, phone, referral, Instagram, dealer, etc.)
3. Walk me through what happens from the moment a customer shows interest until the deal is closed and paid — in your own words, even if messy.
4. Who is involved in this process? (you, a salesperson, an accountant, etc.)
5. Where do deals usually slip, get delayed, or get lost?
6. What do you want this SOP to fix most? (faster closing, fewer lost leads, less dependence on you, consistent follow-up, etc.)

After I answer all questions, generate a SALES PROCESS SOP with:
- A clear step-by-step flow (Stage 1, Stage 2, Stage 3...) from lead to payment, with WHO is responsible for each step.
- The exact action + a sample line/script for each customer-facing step (especially follow-up messages).
- A "response time rule" for each stage (e.g. respond to new lead within X hours).
- A short list of what to record/track at each stage.
- A "Owner is NOT needed here" note marking which steps can run without me.

Format it cleanly with headings and numbered steps so I can print it and give it to my team. Keep it under 2 pages. Start by asking Question 1 only.`,
  },
  {
    id: "family-business-matrix",
    label: "Family Business Decision Matrix Generator",
    text: `You are an advisor who helps Indian family businesses stop fighting over decisions by clearly defining WHO decides WHAT. You understand the typical tension between the older generation (experience, instinct, relationships) and the younger generation (data, technology, systems). You are neutral, practical, and respectful to both sides.

Your job: help me build a clear DECISION MATRIX for my family business, so every decision has a defined owner and the daily arguments stop.

RULES:
- Ask me ONE question at a time. Wait for my answer before the next one.
- Keep it simple and plain. Use Hinglish if I do.
- Do not take sides between generations.

Ask me, one by one:
1. What type of business is it, and who are the family members involved? (e.g. father + son, two brothers — and roughly their ages/roles)
2. What are the 3-4 decisions you fight or disagree about the MOST right now?
3. Who currently has the final say on most things — and is that working?
4. What does the older generation do best? (relationships, credit calls, risk judgment, suppliers, etc.)
5. What does the younger generation do best? (data, pricing, tech, hiring, marketing, etc.)
6. Are there any decisions you both want to make TOGETHER, no matter what?

After I answer, generate a DECISION MATRIX as a clean table with these columns: DECISION | WHO DECIDES | WHO MUST BE CONSULTED | NOTES.

Cover at least these decision areas (add any specific to my business): raw material / inventory purchase, pricing & discounts, credit/udhaar limits, hiring & firing, new software/tools, marketing spend, vendor changes, expansion/new investment.

For each, assign it to the older generation, the younger generation, or Joint — based on MY answers about who is good at what, not a generic template.

Then add:
- Two short "Role Cards": one for each person, listing their final-say areas in one line each.
- A simple "Sunday Sync" suggestion: a 30-min weekly meeting where joint decisions get reviewed.

Format it so I can print it and stick it near my desk. Start by asking Question 1 only.`,
  },
  {
    id: "job-description",
    label: "Role-wise Job Description Generator",
    text: `You are an HR advisor who helps small and medium Indian business owners create clear, practical Job Descriptions (JDs) for their staff. You do NOT use corporate HR jargon. You write JDs that a shop owner or factory owner can directly hand to a candidate or existing employee — simple, clear, no fluff.

Your job: help me create a complete, ready-to-use JOB DESCRIPTION for a role in my business — including duties, salary, leaves, bonus, and growth path.

RULES:
- Ask me ONE question at a time. Wait for my answer before asking the next.
- Keep questions simple and in plain language. Use Hinglish if I do.
- If my answer is vague (e.g. "sab kuch karega"), push back gently and help me break it into specific tasks.
- Be realistic about Indian SME context — small teams, multi-tasking roles, market-rate salaries.

Ask me, one by one:
1. What is your business, and which role do you want to define? (e.g. sales executive, accountant, factory supervisor, store manager)
2. What daily and weekly work do you expect from this role? List everything, even small tasks — I will organize it.
3. What salary range can you afford for this role per month? (Give a min-max, and mention if it includes any allowances)
4. How many leaves can you offer per month/year? (paid leaves, festival holidays, weekly off — whatever applies)
5. Do you want to offer any performance bonus or incentive? If yes, what result should it be linked to? (sales target, attendance, production output, collections, etc.)
6. How will salary hikes work? (yearly review, performance-based, fixed % — or you're not sure and want a suggestion)
7. Who will this person report to, and is there anyone who will report to them?
8. What kind of person works and what kind fails in your business? (e.g. needs to handle pressure, must be honest with cash, should speak with customers politely)

After I answer all questions, generate a ROLE-WISE JOB DESCRIPTION with these sections:
- Role Title & Reporting: who they report to, who reports to them.
- Key Responsibilities: daily, weekly, and monthly duties as separate numbered lists — specific actions, not vague lines like "handle sales."
- What Success Looks Like: 3-4 measurable outcomes for this role (so performance reviews have a base).
- Salary & Benefits: salary range, leave policy, weekly off — written clearly so there's no confusion later.
- Bonus & Incentives: exact condition → exact reward (e.g. "monthly collections above X = Y bonus").
- Hike & Growth Path: when and how salary review happens, and what the next position for this person can be.
- Not This Role's Job: 2-3 things this role is NOT responsible for (to stop "yeh mera kaam nahi hai" fights).
- Candidate Fit Note: 3 qualities to look for, 3 red flags to avoid — based on my answers.

Format it cleanly with headings so I can print it and use it for hiring or for setting expectations with existing staff. Keep it under 2 pages. Start by asking Question 1 only.`,
  },
];

const defaultResourcesList = [
  {
    id: "systems-starter-guide",
    title: "Systems Starter Guide",
    tag: "Guide",
    icon: "rocket_launch",
    intro: "A practical roadmap to help you transition from being the operator of your business to being its owner. This guide gives you the first 5 steps every SME owner must take to build a self-running business.",
  },
  {
    id: "manufacturing-guide",
    title: "Manufacturing Owner's Guide",
    tag: "Guide",
    icon: "factory",
    intro: "Specific frameworks for shop-floor management, quality control, and inventory optimization in manufacturing SMEs.",
  },
  {
    id: "sop-guide",
    title: "SOP Guide",
    tag: "Template",
    icon: "account_tree",
    intro: "How to document processes so that your team actually follows them without you having to remind them.",
  },
  {
    id: "roles-responsibilities",
    title: "Roles & Responsibilities",
    tag: "Guide",
    icon: "groups",
    intro: "Clarity for your team so they stop asking you for every minor decision and start taking ownership.",
  }
];

export default function VaultPage({ content }: { content: any }) {

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAllGuides, setShowAllGuides] = useState(false);
  const [showAllPrompts, setShowAllPrompts] = useState(false);

  const guideSectionRef = useRef<HTMLDivElement>(null);
  const promptSectionRef = useRef<HTMLDivElement>(null);

  const handleGuidesToggle = () => {
    if (showAllGuides) {
      guideSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    setShowAllGuides(!showAllGuides);
  };

  const handlePromptsToggle = () => {
    if (showAllPrompts) {
      promptSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    setShowAllPrompts(!showAllPrompts);
  };

  // 1. Get sheet guides (section is "vault" or empty) and reverse so the newest sheet entry (bottom of sheet) is at the top
  const sheetGuides = content.vault 
    ? content.vault
        .filter((item: any) => {
          const s = String(item.section || "").toLowerCase().trim();
          return !s || s === "vault";
        })
        .map((item: any) => ({
          id: item.slug || item.id,
          title: item.title,
          tag: item.tag || "Guide",
          icon: item.icon || "rocket_launch",
          intro: item.intro || ""
        }))
        .reverse()
    : [];

  // 2. Get default guides and filter out any that are overridden by sheet guides to prevent duplicates
  const sheetGuideIds = new Set(sheetGuides.map((item: any) => item.id));
  const filteredDefaultGuides = defaultResourcesList.filter(
    (item: any) => !sheetGuideIds.has(item.id)
  );

  // 3. Combine them: Sheet entries first (newest top), then remaining default guides, and always AI Prompt Kit at the very end
  const resourcesList = [
    ...sheetGuides,
    ...filteredDefaultGuides,
    {
      id: "ai-prompt-kit",
      title: "AI Prompt Kit",
      tag: "Prompt",
      icon: "smart_toy",
      intro: "Automate mundane tasks with these tried & tested prompts.",
      isLocalAnchor: true,
    }
  ];

  // 4. Get sheet prompts (section is "ai_prompts") and reverse
  const sheetPrompts = content.vault
    ? content.vault
        .filter((item: any) => {
          const s = String(item.section || "").toLowerCase().trim();
          return s === "ai_prompts";
        })
        .map((item: any) => ({
          id: item.slug || item.id,
          label: item.title,
          text: item.content || ""
        }))
        .reverse()
    : [];

  const sheetPromptIds = new Set(sheetPrompts.map((item: any) => item.id));
  const filteredDefaultPrompts = defaultPrompts.filter(
    (item: any) => !sheetPromptIds.has(item.id)
  );

  const prompts = [
    ...sheetPrompts,
    ...filteredDefaultPrompts
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="brutalist-theme">
      {/* Section 1: Hero */}
      <section className="bg-surface-container-lowest pt-8 pb-section-padding-mobile md:pt-10 md:pb-section-padding-desktop px-gutter">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-2/3">
            <span className="inline-block bg-primary-container text-on-primary-container font-section-label text-section-label px-3 py-1 mb-6">
              THE SYSTEMS VAULT
            </span>
            <h1 className="font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl text-on-background mb-8">
              Aapke business ko system pe chalane ke liye har zaroori tool — ek hi jagah.
            </h1>
            <p className="font-body-lg text-body-lg text-secondary mb-10 max-w-2xl">
              Guides, frameworks aur AI prompts jo aapko owner-trap se bahar nikaalte hain. Free. No fluff.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link
                className="bg-black text-white px-10 py-5 font-button-text text-button-text hover:bg-zinc-800 hover:text-white hover:border-zinc-800 transition-all active:scale-95 border-2 border-black text-center"
                href="/bml"
              >
                Apna Business Audit Karo →
              </Link>
              <span className="font-body-md text-body-md text-secondary border-b border-secondary hover:border-on-background hover:text-on-background transition-colors">
                Pehle audit, phir resources — yahi sahi order hai.
              </span>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative w-full aspect-square border-4 border-on-background bg-primary-container p-8 flex items-center justify-center">
              <span className="material-symbols-outlined text-[120px] text-on-background select-none">
                inventory_2
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Primary CTA (BML Calculator) */}
      <section className="bg-text-primary py-16 px-gutter">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-xl">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary-container mb-4">
              Start Here: BML Calculator
            </h2>
            <p className="font-body-lg text-body-lg text-white">
              2 minute ka diagnostic jo batata hai aapka business aap pe kitna depend karta hai — aur kahan system lagana hai.
            </p>
          </div>
          <Link
            className="w-full md:w-auto bg-primary-container text-on-primary-container px-12 py-6 font-button-text text-button-text hover:bg-surface-bright hover:text-on-background transition-colors text-center border-2 border-text-primary"
            href="/bml"
          >
            Free Audit Lo
          </Link>
        </div>
      </section>

      {/* Section 4: AI Prompt Kit Details */}
      <section ref={promptSectionRef} id="ai-prompt-kit" className="bg-[#141414] py-section-padding-mobile md:py-section-padding-desktop px-gutter overflow-hidden relative text-white">
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="mb-16">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#ffd21f] mb-4">
              AI Prompt Kit
            </h2>
            <p className="font-body-lg text-body-lg text-zinc-400">
              Copy-paste ready prompts for ChatGPT/Claude to help you systemize faster.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prompts.slice(0, showAllPrompts ? prompts.length : 6).map((p) => (
              <div
                key={p.id}
                className="group border-2 border-zinc-700 p-10 bg-[#1c1c1c] hover:border-[#ffd21f] transition-colors duration-300 flex flex-col justify-between relative"
                style={{ minHeight: "320px" }}
              >
                <div className="flex justify-between items-start gap-4 mb-6">
                  <h3 className="font-headline-lg-mobile text-[22px] font-bold text-white leading-tight">
                    {p.label}
                  </h3>
                  <button
                    onClick={() => handleCopy(p.id, p.text)}
                    className="bg-white text-black hover:bg-[#ffd21f] hover:border-[#ffd21f] px-4 py-2 text-xs font-bold uppercase transition-colors cursor-pointer select-none flex-shrink-0 border-2 border-white active:scale-95"
                  >
                    {copiedId === p.id ? "COPIED!" : "COPY"}
                  </button>
                </div>
                
                <div
                  className="bg-[#0e0e0e] text-zinc-300 p-4 font-mono text-[13px] leading-relaxed select-all overflow-y-auto custom-scrollbar flex-grow border border-zinc-800"
                  style={{ height: "180px", whiteSpace: "pre-wrap" }}
                >
                  {p.text}
                </div>
              </div>
            ))}
          </div>
          {prompts.length > 6 && (
            <div className="mt-12 text-center md:text-left">
              <button
                onClick={handlePromptsToggle}
                className="bg-white text-[#141414] px-10 py-5 font-button-text text-button-text border-2 border-white hover:bg-[#ffd21f] hover:text-[#141414] hover:border-[#ffd21f] transition-all active:scale-95 inline-block cursor-pointer"
                style={{ borderRadius: "0px" }}
              >
                {showAllPrompts ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </div>
        {/* Geometric shape */}
        <div className="absolute -right-24 top-1/4 w-96 h-96 border-8 border-[#ffd21f]/10 pointer-events-none rotate-12"></div>
      </section>

      {/* Section 3: Resource Library */}
      <section ref={guideSectionRef} className="bg-surface py-section-padding-mobile md:py-section-padding-desktop px-gutter">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg whitespace-nowrap">
              Vault ke andar kya hai
            </h2>
            <div className="flex-grow h-[2px] bg-primary-container"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resourcesList.slice(0, showAllGuides ? resourcesList.length : 6).map((res) => {
              const cardInnerContent = (
                <>
                  <span className="material-symbols-outlined text-4xl text-primary mb-6 group-hover:text-on-background select-none">
                    {res.icon}
                  </span>
                  <h3 className="font-headline-lg-mobile text-[24px] font-bold mb-4 text-text-primary">
                    {res.title}
                  </h3>
                  <p className="font-body-md text-secondary group-hover:text-on-background mb-8 flex-grow">
                    {res.intro}
                  </p>
                  <div className="font-button-text text-button-text text-primary group-hover:text-on-background flex items-center gap-2">
                    Open <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                </>
              );

              if (res.isLocalAnchor) {
                return (
                  <a
                    key={res.id}
                    href={`#${res.id}`}
                    className="group border-2 border-on-background p-10 bg-surface-container-lowest hover:bg-primary-container transition-colors duration-300 flex flex-col h-full cursor-pointer"
                  >
                    {cardInnerContent}
                  </a>
                );
              }

              return (
                <Link
                  key={res.id}
                  href={`/vault/${res.id}`}
                  className="group border-2 border-on-background p-10 bg-surface-container-lowest hover:bg-primary-container transition-colors duration-300 flex flex-col h-full cursor-pointer"
                >
                  {cardInnerContent}
                </Link>
              );
            })}
          </div>

          {resourcesList.length > 6 && (
            <div className="mt-12 text-center">
              <button
                onClick={handleGuidesToggle}
                className="bg-black text-white px-10 py-5 font-button-text text-button-text border-2 border-black hover:bg-zinc-800 hover:text-white hover:border-zinc-800 transition-all active:scale-95 inline-block cursor-pointer"
                style={{ borderRadius: "0px" }}
              >
                {showAllGuides ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Section 5: Closing CTA */}
      <section className="bg-primary-container py-24 px-gutter">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="font-display-xl-mobile md:font-headline-lg text-on-background mb-6">
            Confused kahan se shuru karu?
          </h2>
          <p className="font-body-lg text-on-background font-bold mb-10">
            Audit se shuru karo.
          </p>
          <Link
            className="bg-black text-white px-12 py-6 font-button-text text-button-text hover:bg-zinc-800 hover:text-white hover:border-zinc-800 transition-all border-2 border-black inline-block text-center"
            href="/bml"
          >
            Business Audit Karo →
          </Link>
        </div>
      </section>
    </div>
  );
}
