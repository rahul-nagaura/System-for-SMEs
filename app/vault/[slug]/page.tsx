import Link from "next/link";
import { notFound } from "next/navigation";
import CopyPrompt from "@/app/components/CopyPrompt";

/* ─────────────────────────────────────────────────────────────
   All vault resources — add new ones here in the future!
   Each entry has: slug, title, tag, icon, intro, and sections.
   ──────────────────────────────────────────────────────────── */
const resources: Record<string, {
  title: string;
  tag: string;
  icon: string;
  intro: string;
  sections?: { heading: string; body: string }[];
  section?: string;
}> = {
  "sop": {
    title: "SOP Generator Prompt",
    tag: "Prompt",
    icon: "smart_toy",
    intro: "Act as an operations manager. I will describe a manual process in my business. Write a step-by-step SOP including Objective, Prerequisites, and numbered steps.",
    sections: [
      {
        heading: "SOP Generator Prompt Text",
        body: `"Act as an operations manager. I will describe a manual process in my business. Write a step-by-step SOP including Objective, Prerequisites, and numbered steps."`
      }
    ],
    section: "ai_prompts"
  },
  "role": {
    title: "Role Clarity Prompt",
    tag: "Prompt",
    icon: "smart_toy",
    intro: "Create a Job Scorecard for a [Role Name] position in an SME. List the top 3 mission-critical KPIs and the 5 primary tasks they must own 100%.",
    sections: [
      {
        heading: "Role Clarity Prompt Text",
        body: `"Create a Job Scorecard for a [Role Name] position in an SME. List the top 3 mission-critical KPIs and the 5 primary tasks they must own 100%."`
      }
    ],
    section: "ai_prompts"
  },
  "problem": {
    title: "Problem Root-Cause Prompt",
    tag: "Prompt",
    icon: "smart_toy",
    intro: "Using the 5 Whys technique, analyze why [Describe Bottleneck] keeps happening in my warehouse. Suggest a systemic fix that doesn't involve me intervening.",
    sections: [
      {
        heading: "Problem Root-Cause Prompt Text",
        body: `"Using the 5 Whys technique, analyze why [Describe Bottleneck] keeps happening in my warehouse. Suggest a systemic fix that doesn't involve me intervening."`
      }
    ],
    section: "ai_prompts"
  },
  "systems-starter-guide": {
    title: "Systems Starter Guide",
    tag: "Guide",
    icon: "rocket_launch",
    intro: "A practical roadmap to help you transition from being the operator of your business to being its owner. This guide gives you the first 5 steps every SME owner must take to build a self-running business.",
    sections: [
      { heading: "Step 1 — Audit Your Time", body: "Spend one week tracking every task you do. Categorize them into: Only I can do this, Someone trained could do this, This should be automated. Most founders discover 60–70% of their time is in categories 2 and 3." },
      { heading: "Step 2 — Document One Process Per Week", body: "Pick the most repeated process in your business. Write it down step by step. This becomes your first SOP. Don't try to do everything at once — one per week is enough." },
      { heading: "Step 3 — Identify Your First Hire or Delegate", body: "Based on your time audit, find the ONE task that takes the most of your time and least requires your expertise. Train someone or hire for that exact task first." },
      { heading: "Step 4 — Create a Communication Protocol", body: "Stop running on WhatsApp chaos. Define: where decisions are logged, how updates are shared, and who is responsible for what." },
      { heading: "Step 5 — Hold Weekly Operations Review", body: "Set up a 30-minute sync meeting with your key team members. Review: KPIs met, bottlenecks faced, and key tasks for the upcoming week. This builds team accountability." }
    ],
    section: "vault"
  },
  "manufacturing-guide": {
    title: "Manufacturing Owner's Guide",
    tag: "Guide",
    icon: "factory",
    intro: "Specific frameworks for shop-floor management, quality control, and inventory optimization in manufacturing SMEs.",
    sections: [
      { heading: "Step 1 — Clean the Floor (5S)", body: "Introduce the 5S methodology to organize the shop floor. Sort unnecessary tools, set everything in order, shine the machines, standardize the cleaning process, and sustain the habits." },
      { heading: "Step 2 — Implement Daily Production Logs", body: "Enforce a simple paper log or spreadsheet where operators enter production counts, machine downtime, and scrap levels at the end of every shift." },
      { heading: "Step 3 — Reorder Point Inventory", body: "Never run out of raw materials. Establish minimum stock levels (reorder points) for key materials and assign one person to trigger purchases when those levels are breached." },
      { heading: "Step 4 — Set Quality Checkpoints", body: "Install quality check steps before packing and shipping. Define clear criteria for passes and rejects so defects are caught on the shop floor rather than by the customer." }
    ],
    section: "vault"
  },
  "sop-guide": {
    title: "SOP Guide",
    tag: "Template",
    icon: "account_tree",
    intro: "How to document processes so that your team actually follows them without you having to remind them.",
    sections: [
      { heading: "Use a Standard Format", body: "Every SOP should include: Objective (Why we do this), Owner (Who does this), Trigger (When to do this), and Step-by-Step steps (Numbered, clear actions)." },
      { heading: "Write for a 15-year old", body: "Avoid jargon and write simple, direct sentences. Use 'If-Then' logic to handle exceptions (e.g., 'If stock is under 10 units, notify the purchase manager')." },
      { heading: "Record Loom Videos", body: "Don't just write. Record a 3-minute video showing how to do the task (especially software tasks). Embed the video link at the top of the written SOP." },
      { heading: "Review and Update", body: "Processes change. Review SOPs quarterly with the team members who perform them to keep documentation aligned with reality." }
    ],
    section: "vault"
  },
  "roles-responsibilities": {
    title: "Roles & Responsibilities",
    tag: "Guide",
    icon: "groups",
    intro: "Clarity for your team so they stop asking you for every minor decision and start taking ownership.",
    sections: [
      { heading: "Stop using standard Job Descriptions", body: "Job descriptions list vague responsibilities. Instead, use Job Scorecards that define specific, measurable outcomes." },
      { heading: "Define Key Results Areas (KRAs)", body: "Give each team member 2-3 KRAs that they own entirely (e.g., 'Maintain billing accuracy above 99%' or 'Dispatch orders within 24 hours of booking')." },
      { heading: "Outline Decision Authority", body: "Tell them exactly what decisions they can make without your approval. For example, 'Sales reps can offer up to 5% discount' or 'Purchasing can approve orders up to ₹20,000'." },
      { heading: "Review Performance Monthly", body: "Sit down for 15 minutes each month to review scorecards and provide feedback, shifting the focus from hours worked to outcomes delivered." }
    ],
    section: "vault"
  }
};

export default async function ResourcePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  let resource: {
    title: string;
    tag: string;
    icon: string;
    intro: string;
    sections?: { heading: string; body: string }[];
    section?: string;
  } | null = null;

  const webappUrl = process.env.GOOGLE_SCRIPT_WEBAPP_URL;

  if (webappUrl) {
    try {
      const isDev = process.env.NODE_ENV === "development";
      const fetchUrl = isDev 
        ? `${webappUrl}?action=fetchContent&t=${Date.now()}` 
        : `${webappUrl}?action=fetchContent`;
      
      const fetchOptions: RequestInit = isDev 
        ? { cache: "no-store" } 
        : { next: { revalidate: 600 } };

      const res = await fetch(fetchUrl, fetchOptions);
      const data = await res.json();
      if (data.success && data.vault) {
        const found = data.vault.find((v: any) => v.slug === slug);
        if (found) {
          let sections = [];
          try {
            sections = JSON.parse(found.content);
          } catch (e) {
            sections = [{ heading: "Guide Overview", body: found.content || "" }];
          }
          resource = {
            title: found.title,
            tag: found.tag || (found.section === "ai_prompts" ? "Prompt" : "Guide"),
            icon: found.icon || (found.section === "ai_prompts" ? "smart_toy" : "rocket_launch"),
            intro: found.intro || "",
            sections,
            section: found.section || "vault"
          };
        }
      }
    } catch (err) {
      console.error("Failed to load vault item from spreadsheet, falling back:", err);
    }
  }

  // Fallback to local hardcoded resources if not found in spreadsheet
  if (!resource) {
    resource = resources[slug];
  }

  if (!resource) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fff8f2] text-[#201b11] font-sans pb-24">
      {/* Navigation Shell */}
      <header className="sticky top-0 w-full z-50 bg-[#fff8f2]/90 backdrop-blur-xl border-b border-[#2b3040]/10 shadow-sm h-16 flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#edb605] text-3xl font-black">analytics</span>
          <span className="font-extrabold text-[20px] tracking-tight text-[#2b3040]">Systems for SME</span>
        </Link>
        <div className="flex gap-4">
          <Link href="/vault" className="text-sm font-bold text-[#2b3040]/70 hover:text-[#edb605] transition-colors">
            ← Vault Hub
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[800px] mx-auto px-6 pt-12 space-y-12">
        {/* Intro */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="bg-[#edb605] text-[#201b11] px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
              {resource.tag}
            </span>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#fcdc95] border border-[#725b22]/20 rounded-xl">
              <span className="material-symbols-outlined text-3xl text-[#775a00]">{resource.icon}</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{resource.title}</h1>
              <p className="text-sm text-[#4f4633] font-medium leading-relaxed max-w-xl">
                {resource.intro}
              </p>
            </div>
          </div>
        </section>

        {/* Content sections */}
        <section className="space-y-8">
          {resource.section === "ai_prompts" || resource.tag === "Prompt" ? (
            <CopyPrompt text={resource.sections?.[0]?.body || resource.intro} />
          ) : (
            (resource.sections || []).map((section, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#2b3040]/10 p-6 md:p-8 rounded-[24px] shadow-sm space-y-4"
              >
                <h3 className="text-lg font-bold text-[#2b3040] flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#fcdc95] text-[#775a00] text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  {section.heading}
                </h3>
                <p className="text-sm text-[#4f4633] leading-relaxed pl-9 font-medium">
                  {section.body}
                </p>
              </div>
            ))
          )}
        </section>

        {/* Footer actions */}
        <footer className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/booking"
            className="bg-[#edb605] text-[#201b11] font-bold py-5 px-10 rounded-full flex items-center justify-center gap-2 hover:bg-[#e2b900] active:scale-95 transition-all text-center border-2 border-[#2b3040]/20 shadow-md"
          >
            Apply this to your Business
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
          <Link
            href="/vault"
            className="bg-transparent text-[#2b3040] font-bold py-5 px-10 rounded-full border-2 border-[#2b3040] flex items-center justify-center gap-2 hover:bg-[#2b3040]/5 active:scale-95 transition-all text-center"
          >
            Browse other resources
          </Link>
        </footer>
      </main>
    </div>
  );
}