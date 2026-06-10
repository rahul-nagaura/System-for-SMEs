"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import BookingNav from "@/app/components/BookingNav";
import CustomToggle from "@/app/components/CustomToggle";

type Option = {
  label: string;
  text: string;
  score: number;
};

type QuestionStep = {
  id: number;
  qNum: string;
  qLabel: string;
  question: string;
  options: Option[];
};

const questions: QuestionStep[] = [
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

const biggestProblems = [
  { label: "A", text: "Sab kuch mere pe hi depend hai" },
  { label: "B", text: "Staff leaves quickly" },
  { label: "C", text: "Koi data tracking nahi hai, only guesswork" },
  { label: "D", text: "Sales low hain" },
  { label: "E", text: "Marketing aur Branding is missing" },
  { label: "F", text: "No Organizational Structure & Reporting Mechanism" },
];

const revenueOptions = [
  { label: "A", text: "Under ₹5L" },
  { label: "B", text: "₹5L - ₹20L" },
  { label: "C", text: "₹20L - ₹50L" },
  { label: "D", text: "₹50L - ₹5Cr" },
  { label: "E", text: "Above ₹5Cr" },
];

const gapMappings: Record<string, { title: string; cost: string; stagnation: string }> = {
  "Sab kuch mere pe hi depend hai": {
    title: "Dependency on Owner",
    cost: "Working IN the business instead of ON it, trapping you in daily operations.",
    stagnation: "If you don't delegate, 12 months from now you will still be working 14-hour days, exhausted, with zero business value if you want to exit.",
  },
  "Staff leaves quickly": {
    title: "Team Retention & SOPs",
    cost: "High staff turnover forces you to constantly retrain, creating severe operational inconsistency.",
    stagnation: "Without clear documentation and SOPs, 12 months from now you will still be stuck rehiring, retraining, and cleaning up manual staff mistakes daily.",
  },
  "Koi data tracking nahi hai, only guesswork": {
    title: "Data Visibility & Metrics",
    cost: "Flying blind without numbers, leading to margin leaks and impossible forecasting.",
    stagnation: "Without data tracking, 12 months from now you will still be leaking money, guessing margins, and leaving your profits entirely on the table.",
  },
  "Sales low hain": {
    title: "Sales Conversion Process",
    cost: "Leads are slipping through the cracks due to a lack of a structured conversion pipeline.",
    stagnation: "Without a structured sales process, 12 months from now you will still be losing warm leads to faster, more automated competitors.",
  },
  "Marketing aur Branding is missing": {
    title: "Lead Generation Funnel",
    cost: "Relying entirely on unpredictable word of mouth, capping your ability to scale.",
    stagnation: "Without consistent marketing, 12 months from now you will still be waiting for the phone to ring, anxious about next month's payroll.",
  },
  "No Organizational Structure & Reporting Mechanism": {
    title: "Reporting & Team Structure",
    cost: "Team accountability is non-existent, forcing you to manually follow up on every task.",
    stagnation: "Without reporting systems, 12 months from now you will still be micromanaging every single WhatsApp text to ensure basic tasks are done.",
  },
};

type CardTheme = {
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

const cardThemes: CardTheme[] = [
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

const RADIUS = 52;                       // must match SVG circle r
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const START_ANGLE = 1.5 * Math.PI;       // top (12 o'clock)

function getRingGeometry(score: number, max = 15) {
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

export default function BMLCalculator() {
  const [step, setStep] = useState<number>(0); // 0 = Intro, 1-5 = Q1-Q5, 6 = Lead Capture, 7 = Result
  const [name, setName] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [biggestProblem, setBiggestProblem] = useState<string>("");
  const [revenue, setRevenue] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [otherDetails, setOtherDetails] = useState<{ [key: number]: string }>({});
  const [tempOther, setTempOther] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);
  const [exportName, setExportName] = useState<string>("");
  const [themeId, setThemeId] = useState<string>('black');
  const [showScoreRing, setShowScoreRing] = useState<boolean>(true);
  const [showLevel, setShowLevel] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDownloadOpen(false);
      }
    };
    if (isDownloadOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDownloadOpen]);

  const totalScore = Object.entries(answers).reduce((sum, [qId, optionIndex]) => {
    const qNum = parseInt(qId);
    const q = questions[qNum - 1];
    if (q && q.options[optionIndex]) {
      return sum + q.options[optionIndex].score;
    }
    return sum;
  }, 0);

  // 2. Dimension calculations based on answers
  const s1 = answers[1] !== undefined ? questions[0].options[answers[1]].score : 1;
  const s2 = answers[2] !== undefined ? questions[1].options[answers[2]].score : 1;
  const s3 = answers[3] !== undefined ? questions[2].options[answers[3]].score : 1;
  const s4 = answers[4] !== undefined ? questions[3].options[answers[4]].score : 1;
  const s5 = answers[5] !== undefined ? questions[4].options[answers[5]].score : 1;

  let opEff = Math.round(((s1 + s4) / 6) * 50 + 35);
  let finCtrl = Math.round((s2 / 3) * 50 + 35);
  let humCap = Math.round((s3 / 3) * 50 + 35);
  let digMat = Math.round((s5 / 3) * 50 + 35);

  let weakestDim = "Operational Efficiency";
  if (biggestProblem === "Staff leaves quickly" || biggestProblem === "No Organizational Structure & Reporting Mechanism") {
    weakestDim = "Human Capital";
  } else if (biggestProblem === "Koi data tracking nahi hai, only guesswork") {
    weakestDim = "Financial Control";
  } else if (biggestProblem === "Sales low hain" || biggestProblem === "Marketing aur Branding is missing") {
    weakestDim = "Digital Maturity";
  }

  if (weakestDim === "Operational Efficiency") {
    opEff = Math.min(opEff, finCtrl - 5, humCap - 5, digMat - 5, 40);
  } else if (weakestDim === "Financial Control") {
    finCtrl = Math.min(finCtrl, opEff - 5, humCap - 5, digMat - 5, 40);
  } else if (weakestDim === "Human Capital") {
    humCap = Math.min(humCap, opEff - 5, finCtrl - 5, digMat - 5, 40);
  } else if (weakestDim === "Digital Maturity") {
    digMat = Math.min(digMat, opEff - 5, finCtrl - 5, humCap - 5, 40);
  }

  opEff = Math.max(15, Math.min(100, opEff));
  finCtrl = Math.max(15, Math.min(100, finCtrl));
  humCap = Math.max(15, Math.min(100, humCap));
  digMat = Math.max(15, Math.min(100, digMat));

  const averagePercentage = Math.round((opEff + finCtrl + humCap + digMat) / 4);
  const displayScore = Math.round((averagePercentage / 100) * 15);
  const ringGeometry = getRingGeometry(displayScore);

  const levels = [
    { min: 0,  max: 3,  name: "Chaotic (Founder-Trapped)", line: "Your business stops the moment you turn off your phone." },
    { min: 4,  max: 7,  name: "Owner-Dependent",           line: "Your business is running you, not the other way around." },
    { min: 8,  max: 10, name: "Organized",                 line: "You have systems — but they still need you to run them." },
    { min: 11, max: 13, name: "Systemized",                line: "Your business runs on processes, not on your presence." },
    { min: 14, max: 15, name: "Self-Running (Scalable)",   line: "Your business runs and grows without you in the room." }
  ];

  const currentLevel = levels.find(l => displayScore >= l.min && displayScore <= l.max) || levels[0];
  const currentLevelIndex = levels.indexOf(currentLevel) + 1;
  const stageNameOnly = currentLevel.name.split(" ")[0];

  const getBandColor = (val: number) => {
    if (val <= 40) return "#E5484D"; // Red
    if (val <= 70) return "#E8A93B"; // Amber
    return "#2E9E5B";                // Green
  };

  const ringColor = getBandColor(averagePercentage);
  const currentTheme = cardThemes.find(t => t.id === themeId) || cardThemes[0];

  const dimensionsList = [
    { name: "Operational Efficiency", value: opEff },
    { name: "Financial Control", value: finCtrl },
    { name: "Human Capital", value: humCap },
    { name: "Digital Maturity", value: digMat }
  ];

  const gapCopy = {
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

  const currentCopy = gapCopy[weakestDim as keyof typeof gapCopy] || gapCopy["Operational Efficiency"];

  const downloadPNG = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 1280;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentTheme = cardThemes.find(t => t.id === themeId) || cardThemes[0];

    // 1. Background
    ctx.fillStyle = currentTheme.bg;
    ctx.fillRect(0, 0, 720, 1280);

    // 2. Subtle Inset Border
    ctx.strokeStyle = currentTheme.border;
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 680, 1240);

    // 3. Header
    // Logo text
    ctx.fillStyle = currentTheme.text;
    ctx.font = "900 22px Archivo, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("SYSTEMS FOR SME", 60, 90);

    // Eyebrow
    ctx.fillStyle = "#9A9A93";
    ctx.font = "bold 14px Inter, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("BML DIAGNOSTIC", 660, 90);

    // Divider Line
    ctx.strokeStyle = currentTheme.border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 125);
    ctx.lineTo(660, 125);
    ctx.stroke();

    // 4. Footer
    // Footer Divider Line
    ctx.strokeStyle = currentTheme.border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 1130);
    ctx.lineTo(660, 1130);
    ctx.stroke();

    // Handle @systems_for_sme (centered)
    ctx.fillStyle = currentTheme.accent;
    ctx.font = "900 22px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("@systems_for_sme", 360, 1195);

    // 5. Calculate layout heights and spacing dynamically to center content
    const heights: { name: string; height: number }[] = [];
    
    // Name & Badge is always shown
    heights.push({ name: "name", height: 110 });

    if (showScoreRing) {
      heights.push({ name: "scoreRing", height: 230 });
    }

    if (showLevel) {
      heights.push({ name: "levelLine", height: 80 });
    }

    if (showDimensions) {
      heights.push({ name: "dimensions", height: 200 });
    }

    // Biggest Gap is always shown
    heights.push({ name: "biggestGap", height: 90 });

    const totalContentHeight = heights.reduce((sum, h) => sum + h.height, 0);
    const totalAvailableHeight = 850; // space between Y=180 and Y=1030
    
    // Distribute spacing
    const maxSpacing = 50;
    const spacing = heights.length > 1 ? Math.min(maxSpacing, (totalAvailableHeight - totalContentHeight) / (heights.length - 1)) : 0;
    const actualBlockHeight = totalContentHeight + spacing * (heights.length - 1);
    const startY = 180 + (totalAvailableHeight - actualBlockHeight) / 2;

    let currentY = startY;

    heights.forEach((item) => {
      if (item.name === "name") {
        ctx.fillStyle = currentTheme.text;
        ctx.font = "900 32px Archivo, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(exportName || "Founder", 60, currentY + 45);

        if (showLevel) {
          const badgeText = `LEVEL ${currentLevelIndex} · ${stageNameOnly.toUpperCase()}`;
          ctx.font = "900 15px Inter, sans-serif";
          const textWidth = ctx.measureText(badgeText).width;

          // Draw yellow badge background
          ctx.fillStyle = currentTheme.labelBg;
          ctx.fillRect(60, currentY + 68, textWidth + 24, 30);

          // Draw text inside badge
          ctx.fillStyle = currentTheme.labelText;
          ctx.fillText(badgeText, 72, currentY + 88);
        }
        currentY += item.height + spacing;
      } 
      
      else if (item.name === "scoreRing") {
        const centerX = 360;
        const centerY = currentY + 110;
        const radius = 80;

        // Draw track
        ctx.strokeStyle = currentTheme.trackBg;
        ctx.lineWidth = 17;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw progress fill
        ctx.strokeStyle = currentTheme.accent;
        ctx.lineWidth = 17;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, ringGeometry.startAngle, ringGeometry.endAngle, false);
        ctx.stroke();

        // Draw score inside ring
        ctx.fillStyle = currentTheme.text;
        ctx.font = "900 64px Archivo, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(averagePercentage.toString() + "%", centerX, centerY + 12);

        ctx.fillStyle = "#9A9A93";
        ctx.font = "900 15px Inter, sans-serif";
        ctx.fillText("OVERALL", centerX, centerY + 42);

        currentY += item.height + spacing;
      } 
      
      else if (item.name === "levelLine") {
        ctx.fillStyle = currentTheme.id === 'light' ? '#54544F' : '#D7D7D2';
        ctx.font = "bold 21px Inter, sans-serif";
        ctx.textAlign = "center";

        // Wrapped stage line text
        const text = currentLevel.line;
        const words = text.split(" ");
        let line = "";
        let lines = [];
        const maxWidth = 560;

        for (let n = 0; n < words.length; n++) {
          let testLine = line + words[n] + " ";
          let metrics = ctx.measureText(testLine);
          let testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + " ";
          } else {
            line = testLine;
          }
        }
        lines.push(line);

        let textY = currentY + 30;
        lines.forEach((l) => {
          ctx.fillText(l.trim(), 360, textY);
          textY += 30;
        });

        currentY += item.height + spacing;
      } 
      
      else if (item.name === "dimensions") {
        ctx.textAlign = "left";
        let barY = currentY + 20;

        dimensionsList.forEach((dim) => {
          const isWeak = dim.name === weakestDim;

          // Dimension Label
          ctx.fillStyle = currentTheme.text;
          ctx.font = "bold 18px Inter, sans-serif";
          ctx.fillText(dim.name, 60, barY);

          // If weakest, draw GAP badge
          if (isWeak) {
            ctx.font = "900 11px Inter, sans-serif";
            const badgeWidth = ctx.measureText("GAP").width;
            ctx.fillStyle = "#E5484D";
            ctx.fillRect(60 + ctx.measureText(dim.name).width + 12, barY - 16, badgeWidth + 12, 20);
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText("GAP", 60 + ctx.measureText(dim.name).width + 18, barY - 2);
          }

          // Percentage
          ctx.fillStyle = currentTheme.id === 'light' ? '#6B6B66' : '#9A9A93';
          ctx.font = "bold 18px Archivo, sans-serif";
          ctx.textAlign = "right";
          ctx.fillText(`${dim.value}%`, 660, barY);

          // Progress Track
          ctx.fillStyle = currentTheme.trackBg;
          ctx.fillRect(60, barY + 12, 600, 10);

          // Progress Fill
          ctx.fillStyle = currentTheme.accent;
          ctx.fillRect(60, barY + 12, 600 * (dim.value / 100), 10);

          barY += 45;
          ctx.textAlign = "left";
        });

        currentY += item.height + spacing;
      } 
      
      else if (item.name === "biggestGap") {
        // Draw vertical yellow accent line
        ctx.fillStyle = currentTheme.accent;
        ctx.fillRect(60, currentY, 6, 70);

        // Subtext
        ctx.fillStyle = "#9A9A93";
        ctx.font = "900 13px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("BIGGEST GAP", 80, currentY + 18);

        // Main value
        ctx.fillStyle = currentTheme.text;
        ctx.font = "900 24px Archivo, sans-serif";
        ctx.fillText(weakestDim.toUpperCase(), 80, currentY + 50);

        currentY += item.height + spacing;
      }
    });

    // Download flow
    const link = document.createElement("a");
    link.download = `${exportName.trim().replace(/\s+/g, "_")}_BML_Score.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleNext = () => {
    if (step === 0) {
      if (!name.trim()) {
        alert("Please enter your name");
        return;
      }
      if (!businessName.trim()) {
        alert("Please enter your business name");
        return;
      }
      if (!biggestProblem) {
        alert("Please select your biggest problem");
        return;
      }
      if (!revenue) {
        alert("Please select your average monthly revenue");
        return;
      }
      setStep(1);
    } else if (step >= 1 && step <= 5) {
      if (answers[step] === undefined) {
        alert("Please select an option");
        return;
      }
      // If "Other" option is selected (typically Option D), we could check if details are provided
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleShowResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Please enter your email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    const getQText = (qIndex: number) => {
      const ansIdx = answers[qIndex];
      if (ansIdx === undefined) return "";
      const opt = questions[qIndex - 1]?.options[ansIdx];
      return opt ? `${opt.label} - ${opt.text}` : "";
    };

    const payload = {
      name,
      businessName,
      email,
      whatsapp,
      revenue,
      biggestProblem,
      averagePercentage,
      currentLevel: `Level ${currentLevelIndex} - ${stageNameOnly}`,
      weakestDim,
      q1: getQText(1),
      q1_details: otherDetails[1] || "",
      q2: getQText(2),
      q2_details: otherDetails[2] || "",
      q3: getQText(3),
      q3_details: otherDetails[3] || "",
      q4: getQText(4),
      q4_details: otherDetails[4] || "",
      q5: getQText(5),
      q5_details: otherDetails[5] || ""
    };

    try {
      await fetch("/api/bml-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Failed to submit lead to database: ", err);
    } finally {
      setIsSubmitting(false);
      setStep(7);
    }
  };

  const selectAnswer = (qId: number, optionIndex: number) => {
    setAnswers({ ...answers, [qId]: optionIndex });
  };


  return (
    <div className={`min-h-screen ${
      step === 7 ? "bg-[#F7F7F5] text-[#0E0E0E]" : "bg-[#fff8f2] text-[#2b3040]"
    } font-sans flex flex-col relative overflow-x-hidden transition-colors duration-300`}>
      <BookingNav activePage={step === 7 ? "results" : "bml"} />

      {/* Main Content Area */}
      <main className={`flex-grow pt-24 pb-32 px-6 ${
        step === 7 ? "max-w-5xl" : "max-w-3xl"
      } mx-auto w-full flex flex-col justify-start`}>
        {step < 6 ? (
          <div className="w-full space-y-8">
            {/* Header Banner - only shown on Intro page (step 0) */}
            {step === 0 && (
              <div className="relative w-full rounded-2xl overflow-hidden border border-[#2b3040]/10 shadow-md bg-white">
                <div className="relative h-48 w-full bg-[#141414]">
                  <Image
                    src="/factory_banner.png"
                    alt="Factory Banner"
                    fill
                    sizes="(max-width: 768px) 100vw, 720px"
                    className="object-cover opacity-75"
                    priority
                  />
                </div>
                {/* Yellow overlay logo */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 w-20 h-20 rounded-full bg-[#edb605] flex items-center justify-center border-4 border-[#fff8f2] shadow-md">
                  <span className="material-symbols-outlined text-white text-4xl">trending_up</span>
                </div>
              </div>
            )}

            {/* Progress Bar (not on result page) */}
            {step > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-end text-xs font-bold uppercase tracking-wider text-[#2b3040]/60">
                  <span>Question 0{step} of 05</span>
                  <span>{step * 20}% Complete</span>
                </div>
                <div className="h-2 w-full bg-[#2b3040]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#edb605] transition-all duration-500 ease-out"
                    style={{ width: `${step * 20}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Quiz Content Card */}
            {step === 0 ? (
              /* Step 0: Intro */
              <div className="space-y-6 pt-6">
                <div className="text-center space-y-2">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-[#2b3040] tracking-tight">
                    Business Maturity Calculator
                  </h1>
                  <p className="text-[#2b3040]/70 font-medium">
                    Discover if your business is <span className="text-[#edb605] font-bold">Chaotic</span>, <span className="text-[#0058ed] font-bold">Stable</span>, or <span className="text-emerald-600 font-bold">Ready to Scale</span>. Takes 30 seconds.
                  </p>
                </div>

                <div className="bg-white border border-[#2b3040]/10 p-6 md:p-8 rounded-[24px] shadow-sm space-y-6">
                  {/* Identification info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#2b3040]/60">Your Name *</label>
                      <input
                        type="text"
                        className="w-full bg-[#fff8f2]/50 border-b-2 border-[#2b3040]/20 focus:border-[#edb605] text-base py-2 px-1 focus:ring-0 outline-none transition-colors"
                        placeholder="e.g. Rajesh Kumar"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#2b3040]/60">Business Name *</label>
                      <input
                        type="text"
                        className="w-full bg-[#fff8f2]/50 border-b-2 border-[#2b3040]/20 focus:border-[#edb605] text-base py-2 px-1 focus:ring-0 outline-none transition-colors"
                        placeholder="e.g. Apex Manufacturing"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Problem selection */}
                  <div className="space-y-4 pt-4 border-t border-[#2b3040]/10">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#edb605]">Pain Point Analysis</span>
                      <h3 className="text-xl font-bold text-[#2b3040] mt-1">What do you feel is the biggest problem that you face? *</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {biggestProblems.map((prob) => (
                        <button
                          key={prob.label}
                          type="button"
                          className={`flex items-start gap-3 md:gap-4 p-3 md:p-3.5 rounded-lg border text-left transition-all duration-200 ${
                            biggestProblem === prob.text
                              ? "border-[#edb605] bg-[#edb605]/5 font-semibold"
                              : "border-[#2b3040]/10 bg-[#fff8f2]/30 hover:bg-[#2b3040]/5"
                          }`}
                          onClick={() => setBiggestProblem(prob.text)}
                        >
                          <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            biggestProblem === prob.text ? "border-[#edb605] bg-white" : "border-[#2b3040]/30 bg-white"
                          }`}>
                            <div className={`w-2.5 h-2.5 rounded-full bg-[#edb605] transition-transform ${
                              biggestProblem === prob.text ? "scale-100" : "scale-0"
                            }`}></div>
                          </div>
                          <span className="text-sm text-[#2b3040]">{prob.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Revenue selection */}
                  <div className="space-y-4 pt-6 border-t border-[#2b3040]/10">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#edb605]">Revenue Scale</span>
                      <h3 className="text-xl font-bold text-[#2b3040] mt-1">What is your average monthly revenue? *</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {revenueOptions.map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          className={`flex items-start gap-3 md:gap-4 p-3 md:p-3.5 rounded-lg border text-left transition-all duration-200 ${
                            revenue === opt.text
                              ? "border-[#edb605] bg-[#edb605]/5 font-semibold"
                              : "border-[#2b3040]/10 bg-[#fff8f2]/30 hover:bg-[#2b3040]/5"
                          }`}
                          onClick={() => setRevenue(opt.text)}
                        >
                          <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            revenue === opt.text ? "border-[#edb605] bg-white" : "border-[#2b3040]/30 bg-white"
                          }`}>
                            <div className={`w-2.5 h-2.5 rounded-full bg-[#edb605] transition-transform ${
                              revenue === opt.text ? "scale-100" : "scale-0"
                            }`}></div>
                          </div>
                          <span className="text-sm text-[#2b3040]">{opt.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Step 1-5: Question steps */
              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edb605]/10 text-[#edb605] border border-[#edb605]/20">
                    <span className="material-symbols-outlined text-xs font-bold">star</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{questions[step - 1].qLabel}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#2b3040] leading-snug">
                    {questions[step - 1].question}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {questions[step - 1].options.map((opt, optIdx) => {
                    const isSelected = answers[step] === optIdx;
                    const isOther = opt.text.toLowerCase().includes("other");
                    
                    return (
                      <div key={optIdx} className="space-y-3">
                        <button
                          type="button"
                          className={`w-full flex items-start gap-3 md:gap-4 p-3.5 md:p-4 rounded-xl border text-left transition-all duration-200 active:scale-[0.98] ${
                            isSelected
                              ? "border-[#edb605] bg-white shadow-md font-semibold ring-1 ring-[#edb605]/20"
                              : "border-[#2b3040]/10 bg-white hover:bg-[#2b3040]/5"
                          }`}
                          onClick={() => {
                            selectAnswer(step, optIdx);
                            if (isOther) {
                              setTempOther(otherDetails[step] || "");
                            }
                          }}
                        >
                          <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 bg-white transition-colors ${
                            isSelected ? "border-[#edb605]" : "border-[#2b3040]/30"
                          }`}>
                            <div className={`w-3 h-3 rounded-full bg-[#edb605] transition-transform ${
                              isSelected ? "scale-100" : "scale-0"
                            }`}></div>
                          </div>
                          <div className="w-full">
                            <p className="text-[15px] text-[#2b3040] font-medium">{opt.text}</p>
                            
                            {/* Inline specify field for Other option */}
                            {isOther && isSelected && (
                              <div 
                                className="mt-3 w-full"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="text"
                                  className="w-full bg-[#fff8f2]/50 border-b-2 border-[#edb605] text-sm py-2 px-1 focus:ring-0 outline-none"
                                  placeholder="Apna problem details likhein..."
                                  value={tempOther}
                                  onChange={(e) => {
                                    setTempOther(e.target.value);
                                    setOtherDetails({ ...otherDetails, [step]: e.target.value });
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : step === 6 ? (
          /* Step 6: Lead Capture */
          <div className="w-full pt-6 space-y-6 max-w-md mx-auto z-10 relative">
            {/* Progress Tracker */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#666666] uppercase">Assessment Complete</span>
                <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#edb605] uppercase">100%</span>
              </div>
              <div className="h-1.5 w-full bg-[#f4ede6] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#edb605] to-[#d4a304] w-full transition-all duration-1000 ease-out"></div>
              </div>
            </div>

            {/* Heading Section */}
            <div className="text-center space-y-3">
              <h1 className="text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] tracking-[-0.02em] font-bold text-[#1a1a1a] font-sans leading-tight">
                Aapka result ready hai!
              </h1>
              <p className="text-[18px] leading-[28px] text-[#666666] max-w-xs mx-auto">
                Apna personalized Business Maturity breakdown kahan bhejein?
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white border border-black/5 rounded-2xl p-8 space-y-6 shadow-[0_20px_40px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] relative z-10">
              <form className="space-y-6" onSubmit={handleShowResult}>
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#666666] block ml-1 uppercase" htmlFor="email">Email Address (Required)</label>
                  <div className="relative group">
                    <input
                      className="w-full bg-[#f4ede6] border border-[#e0d8d0] rounded-xl px-4 py-4 text-[#1a1a1a] placeholder:text-[#666666]/40 focus:outline-none focus:border-[#edb605] focus:ring-1 focus:ring-[#edb605] transition-all"
                      id="email"
                      placeholder="name@company.com"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#666666] opacity-40 group-focus-within:text-[#edb605] transition-colors">mail</span>
                  </div>
                </div>
                {/* WhatsApp Field */}
                <div className="space-y-2">
                  <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#666666] block ml-1 uppercase" htmlFor="whatsapp">WhatsApp Number (Optional)</label>
                  <div className="relative group">
                    <input
                      className="w-full bg-[#f4ede6] border border-[#e0d8d0] rounded-xl px-4 py-4 text-[#1a1a1a] placeholder:text-[#666666]/40 focus:outline-none focus:border-[#edb605] focus:ring-1 focus:ring-[#edb605] transition-all"
                      id="whatsapp"
                      placeholder="+91 98XXX XXXXX"
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#666666] opacity-40 group-focus-within:text-[#edb605] transition-colors">phone_iphone</span>
                  </div>
                </div>
                {/* CTA Button */}
                {isSubmitting ? (
                  <button
                    className="w-full bg-[#edb605] text-black font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-[0_10px_25px_-5px_rgba(237,182,5,0.3)] group disabled:opacity-85"
                    disabled
                    type="submit"
                  >
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Generating Breakdown...
                  </button>
                ) : (
                  <button
                    className="w-full bg-[#edb605] text-black font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-[0_10px_25px_-5px_rgba(237,182,5,0.3)] group"
                    type="submit"
                  >
                    Show My Result
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                )}
              </form>
              {/* Value Chips */}
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <span className="bg-[#e8e0d9] text-[#4a4a4a] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> 
                  Industry Benchmarks
                </span>
                <span className="bg-[#f0f7f4] text-[#005236] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  AI-Powered Analysis
                </span>
              </div>
            </div>

            {/* Footer Small Print */}
            <p className="text-center text-[#666666] text-sm opacity-80 pt-6">
              Don&apos;t worry, we value your focus. <span className="font-semibold text-[#1a1a1a]">No spam. Sirf useful insights.</span>
            </p>

            {/* Decorative Visual Lock */}
            <div className="hidden lg:block absolute left-[480px] top-[140px] w-64 h-64 opacity-20 animate-pulse">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 border-2 border-[#edb605]/40 rounded-[40px] rotate-12"></div>
                <div className="absolute inset-0 border-2 border-[#edb605]/20 rounded-[40px] -rotate-6 translate-x-4"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#edb605] text-8xl">lock_open</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Step 7: Results Screen */
          <div className="w-full pt-6 space-y-12 animate-in fade-in duration-500 max-w-[1120px] mx-auto pb-16">
            <section className="pt-[54px] pb-[18px]">
              <h1 className="font-['Archivo'] font-extrabold text-[30px] sm:text-[42px] md:text-[52px] leading-[1.02] tracking-tight max-w-[680px] text-[#0E0E0E]">
                Hey <span className="font-extrabold">{name || "Founder"}</span>, your business is <em style={{ fontStyle: "normal", background: "linear-gradient(transparent 62%, #FCD12A 62%)" }}>{stageNameOnly}.</em>
              </h1>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-[26px]">
              {/* LEFT COLUMN — the diagnosis */}
              <div className="order-1 flex flex-col gap-[22px] text-left">
                {/* Score Card */}
                <div className="bg-white border border-[#1C1C1C] p-[26px] rounded-none flex flex-col sm:flex-row gap-[26px] items-center text-center sm:text-left">
                  <div className="relative w-[132px] h-[132px] flex-shrink-0">
                    <svg viewBox="0 0 120 120" width="132" height="132">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="#ECECE6" strokeWidth="11"/>
                      <circle cx="60" cy="60" r="52" fill="none" stroke={ringGeometry.color}
                        strokeWidth="11" transform="rotate(-90 60 60)"
                        strokeDasharray={ringGeometry.dashArray}
                        strokeDashoffset={ringGeometry.dashOffset}
                        className="transition-all duration-[1100ms] ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <b className="font-['Archivo'] font-black text-[40px] leading-[0.9] text-[#0E0E0E]">{displayScore}</b>
                      <span className="text-[12px] text-[#9A9A93] font-semibold mt-[3px]">/ 15</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="inline-block bg-[#FCD12A] text-[#0E0E0E] font-bold text-[11px] tracking-[0.1em] uppercase px-[10px] py-[5px] mb-3">
                      Level {currentLevelIndex}: {currentLevel.name}
                    </span>
                    <div className="font-['Archivo'] font-bold text-[22px] leading-[1.18] tracking-tight text-[#0E0E0E]">
                      {currentLevel.line}
                    </div>
                    <div className="mt-4 pt-3.5 border-t border-dashed border-[#E4E4DE] text-[13px] text-[#6B6B66]">
                      Most family businesses get stuck between <b>6&ndash;8</b> &mdash; the danger zone where growth stalls.
                    </div>
                  </div>
                </div>

                {/* Dimensions Card */}
                <div className="bg-white border border-[#1C1C1C] p-[26px] rounded-none">
                  <div className="text-[11px] tracking-[0.14em] uppercase text-[#6B6B66] font-semibold mb-2.5">
                    The four systems of your business
                  </div>
                  <div className="flex flex-col gap-4">
                    {dimensionsList.map((dim) => {
                      const isWeak = dim.name === weakestDim;
                      return (
                        <div key={dim.name} className="grid grid-cols-1 gap-1.5">
                          <div className="flex items-baseline justify-between gap-2.5">
                            <span className="text-[13px] font-semibold text-[#0E0E0E]">
                              {dim.name}
                              {isWeak && (
                                <span className="text-[9px] tracking-[0.1em] bg-[#E5484D] text-white px-1.5 py-0.5 ml-2 align-middle font-bold">
                                  WEAKEST
                                </span>
                              )}
                            </span>
                            <span className="font-['Archivo'] font-bold text-[13px] text-[#6B6B66]">
                              {dim.value}%
                            </span>
                          </div>
                          <div className="h-[9px] bg-[#ECECE6] relative overflow-hidden">
                            <div
                              className="h-full transition-all duration-[1000ms] ease-[cubic-bezier(0.2,0.7,0.2,1)]"
                              style={{
                                width: `${dim.value}%`,
                                backgroundColor: getBandColor(dim.value)
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ladder Card */}
                <div className="bg-white border border-[#1C1C1C] p-[26px] rounded-none">
                  <div className="text-[11px] tracking-[0.14em] uppercase text-[#6B6B66] font-semibold mb-2.5">
                    Your climb &mdash; maturity ladder
                  </div>
                  <div className="display flex gap-2">
                    {levels.map((l, i) => {
                      const idx = i + 1;
                      let cls = "flex-1 text-center";
                      let barStyle = "h-[30px] border border-[#1C1C1C] flex items-center justify-center font-['Archivo'] font-bold text-xs bg-white text-[#0E0E0E]";
                      let labelStyle = "text-[9px] tracking-[0.06em] uppercase text-[#9A9A93] mt-1.5 font-semibold";

                      if (idx < currentLevelIndex) {
                        barStyle = "h-[30px] border border-[#1C1C1C] flex items-center justify-center font-['Archivo'] font-bold text-xs bg-[#0E0E0E] text-white";
                      } else if (idx === currentLevelIndex) {
                        barStyle = "h-[30px] border border-[#1C1C1C] flex items-center justify-center font-['Archivo'] font-bold text-xs bg-[#FCD12A] text-[#0E0E0E]";
                        labelStyle = "text-[9px] tracking-[0.06em] uppercase text-[#0E0E0E] mt-1.5 font-bold";
                      }

                      return (
                        <div key={i} className={cls}>
                          <div className={barStyle}>L{idx}</div>
                          <div className={labelStyle}>{l.name.split(' ')[0]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Gap Block */}
                <div className="border-l-4 border-[#FCD12A] pl-[18px] py-1 text-left">
                  <div className="text-[11px] tracking-[0.14em] uppercase text-[#6B6B66] font-semibold mb-2.5">
                    Your biggest gap
                  </div>
                  <div className="font-['Archivo'] font-black text-2xl tracking-tight text-[#0E0E0E] my-0.5 uppercase">
                    {weakestDim}
                  </div>
                  <p className="text-sm text-[#6B6B66] max-w-[380px] font-medium leading-relaxed mt-2">
                    This is costing you <u className="text-[#0E0E0E] font-bold" style={{ textDecorationColor: "#FCD12A", textDecorationThickness: "2px" }}>{currentCopy.cost}</u> {currentCopy.line}
                  </p>
                </div>

                {/* Download Button */}
                <button
                  type="button"
                  onClick={() => {
                    setExportName(name || "Founder");
                    setIsDownloadOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 border border-[#1C1C1C] bg-white p-3.5 text-xs tracking-[0.08em] uppercase font-bold cursor-pointer w-full text-[#0E0E0E] hover:bg-[#0E0E0E] hover:text-white transition-colors rounded-none max-w-[280px]"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px]"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>
                  Download your result
                </button>
              </div>

              {/* RIGHT COLUMN — the action */}
              <div className="order-3 lg:order-2 flex flex-col gap-[22px] text-left">
                {/* Next Steps */}
                <div className="bg-[#0E0E0E] text-white p-[26px] rounded-none">
                  <h3 className="font-['Archivo'] font-extrabold text-[18px] tracking-[0.02em] mb-[18px] text-white">
                    YOUR NEXT STEPS
                  </h3>
                  <div className="flex flex-col gap-4">
                    {currentCopy.steps.map((stepItem, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex-shrink-0 w-[22px] h-[22px] bg-[#FCD12A] text-[#0E0E0E] font-['Archivo'] font-extrabold text-xs flex items-center justify-center">
                          {idx + 1}
                        </div>
                        <p className="text-[13.5px] text-[#D7D7D2] leading-[1.45] font-medium">
                          <b className="text-white font-bold">{stepItem[0]}</b> {stepItem[1]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Block */}
                <div className="border border-[#E5484D] bg-white p-[26px] rounded-none">
                  <div className="text-[11px] tracking-[0.14em] uppercase text-[#E5484D] font-semibold mb-2.5 flex items-center gap-1.5">
                    <span>⚠</span> What happens if you don't fix this
                  </div>
                  <p className="text-[13.5px] text-[#54544F] leading-[1.55] font-medium">
                    {/* Render HTML markup since staging risk has <b> tags */}
                    <span dangerouslySetInnerHTML={{ __html: currentCopy.risk }} />
                  </p>
                </div>

                {/* Redirecting Open Vault Button */}
                <Link
                  href="/vault"
                  className="flex items-center justify-center gap-2 border border-[#1C1C1C] bg-white p-3.5 text-xs tracking-[0.08em] uppercase font-bold cursor-pointer w-full text-[#0E0E0E] hover:bg-[#0E0E0E] hover:text-white transition-colors rounded-none"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px]"><path d="M3 7h7l2 2h9v11H3z"/></svg>
                  Vault &mdash; free resources
                </Link>
              </div>

              {/* FULL-WIDTH PRIMARY BUTTON */}
              <div className="order-2 lg:order-3 lg:col-span-2 pt-2 pb-[60px]">
                <Link
                  href="/booking"
                  className="w-full bg-[#FCD12A] border-none border-b-[5px] border-[#0E0E0E] text-[#0E0E0E] font-['Archivo'] font-black text-lg sm:text-[22px] md:text-[28px] tracking-[0.01em] p-[30px] cursor-pointer flex items-center justify-center gap-4 transition-transform hover:-translate-y-0.5 rounded-none text-center block"
                >
                  BOOK YOUR STRATEGY SESSION <span className="text-xl sm:text-2xl">&rarr;</span>
                </Link>
                <div className="text-center text-xs text-[#6B6B66] mt-3.5 tracking-[0.02em] font-medium">
                  <b>30-min call</b> &middot; a specific systems roadmap for your business &middot; <b>no obligation</b>
                </div>
              </div>
            </div>

            {/* DOWNLOAD PREVIEW MODAL */}
            {isDownloadOpen && (
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-8 overflow-y-auto animate-in fade-in duration-300"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setIsDownloadOpen(false);
                }}
              >
                <div 
                  className="bg-[#0E0E0E] border border-zinc-800 flex flex-col md:flex-row w-full max-w-4xl h-[90vh] md:h-[80vh] max-h-[800px] shadow-[24px_24px_50px_rgba(0,0,0,0.6)] rounded-none relative overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Left Panel - Controls */}
                  <div className="order-2 md:order-1 w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-[#0E0E0E] border-t md:border-t-0 md:border-r border-zinc-800 text-white">
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="flex flex-col gap-1 pb-3 border-b border-zinc-800">
                        <div className="flex justify-between items-center">
                          <span className="font-['Archivo'] font-black tracking-[0.06em] text-[10px] text-zinc-500 uppercase">SYSTEMS FOR SME</span>
                          <button
                            onClick={() => setIsDownloadOpen(false)}
                            className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 select-none border-none bg-transparent"
                          >
                            ✕ Close
                          </button>
                        </div>
                        <h2 className="font-['Archivo'] font-black text-base uppercase tracking-tight text-white mt-1">Customize and download Your result</h2>
                      </div>

                      {/* Your Name */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Your Name</label>
                        <input
                          type="text"
                          className="w-full bg-[#141414] border border-zinc-800 focus:border-[#FCD12A] focus:ring-1 focus:ring-[#FCD12A] outline-none transition-all rounded-none font-bold text-white py-3 px-4"
                          placeholder="e.g. Rajesh Kumar"
                          value={exportName}
                          onChange={(e) => setExportName(e.target.value)}
                        />
                      </div>

                      {/* Card Style */}
                      <div className="space-y-2.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Accent Theme Color</label>
                        <div className="flex flex-wrap gap-3.5">
                          {cardThemes.map((theme) => {
                            const isSelected = theme.id === themeId;
                            return (
                              <button
                                key={theme.id}
                                onClick={() => setThemeId(theme.id)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'border-white ring-2 ring-[#FCD12A] ring-offset-2 ring-offset-black bg-[#141414]'
                                    : 'border-zinc-800 bg-[#0E0E0E] hover:border-zinc-600'
                                }`}
                                title={theme.name}
                              >
                                <span 
                                  className="w-4 h-4 rounded-full flex-shrink-0" 
                                  style={{ backgroundColor: theme.dotColor }}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* What to Show */}
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">What to show</label>
                        
                        <div className="flex flex-col gap-2">
                          <CustomToggle
                            label={`Score ring (${averagePercentage}%)`}
                            checked={showScoreRing}
                            onChange={setShowScoreRing}
                          />
                          <CustomToggle
                            label="Maturity level & stage"
                            checked={showLevel}
                            onChange={setShowLevel}
                          />
                          <CustomToggle
                            label="4-dimension breakdown"
                            checked={showDimensions}
                            onChange={setShowDimensions}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Download Button */}
                    <div className="mt-8">
                      <button
                        onClick={downloadPNG}
                        className="w-full bg-[#FCD12A] text-black border border-black hover:bg-white hover:text-black py-4 text-sm font-black uppercase tracking-widest transition-all rounded-none cursor-pointer text-center block"
                      >
                        Download your result
                      </button>
                    </div>
                  </div>

                  {/* Right Panel - Live Preview */}
                  <div className="order-1 md:order-2 w-full md:w-1/2 p-4 md:p-8 bg-[#141414] bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] flex items-center justify-center overflow-hidden h-full min-h-[400px] md:min-h-0 border-l border-zinc-800">
                    <div className="w-full flex flex-col items-center justify-center overflow-hidden py-4">
                      
                      {/* Scale Wrapper to prevent overflow/scrollbars */}
                      <div className="w-full flex justify-center items-center scale-[0.68] sm:scale-[0.75] md:scale-[0.78] lg:scale-[0.82] xl:scale-[0.88] origin-center my-[-50px]">
                        {/* The Card */}
                        <div 
                          className="aspect-[9/16] w-full max-w-[320px] border flex flex-col justify-between p-6 transition-all duration-300 relative shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
                          style={{
                            backgroundColor: currentTheme.bg,
                            borderColor: currentTheme.border,
                            color: currentTheme.text
                          }}
                        >
                          {/* Card Header */}
                          <div className="flex flex-col gap-1 border-b pb-3 flex-shrink-0" style={{ borderColor: currentTheme.border }}>
                            <div className="flex justify-between items-baseline">
                              <span className="font-['Archivo'] font-black tracking-[0.06em] text-[12px] uppercase">SYSTEMS FOR SME</span>
                              <span className="text-[9px] tracking-[0.1em] font-extrabold text-[#9A9A93] uppercase">BML DIAGNOSTIC</span>
                            </div>
                          </div>

                          {/* Dynamic Content Block */}
                          <div className="flex-grow flex flex-col justify-center gap-5 my-4">
                            {/* User Name & Level */}
                            <div className="flex flex-col gap-2">
                              <div className="font-['Archivo'] font-extrabold text-xl tracking-tight truncate">
                                {exportName || "Founder"}
                              </div>
                              {showLevel && (
                                <div className="flex">
                                  <span className="text-[9px] font-black px-2 py-1 tracking-wider uppercase" style={{ backgroundColor: currentTheme.labelBg, color: currentTheme.labelText }}>
                                    Level {currentLevelIndex} · {stageNameOnly}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Score Ring */}
                            {showScoreRing && (
                              <div className="flex justify-center my-1">
                                <div className="relative w-[110px] h-[110px]">
                                  <svg viewBox="0 0 120 120" className="w-full h-full">
                                    <circle cx="60" cy="60" r="52" fill="none" stroke={currentTheme.trackBg} strokeWidth="11"/>
                                    <circle cx="60" cy="60" r="52" fill="none" stroke={currentTheme.accent} strokeWidth="11"
                                      transform="rotate(-90 60 60)"
                                      strokeDasharray={ringGeometry.dashArray}
                                      strokeDashoffset={ringGeometry.dashOffset}
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="font-['Archivo'] font-black text-2xl" style={{ color: currentTheme.text }}>{averagePercentage}%</span>
                                    <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-extrabold mt-0.5">OVERALL</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Stage description text */}
                            {showLevel && (
                              <div className="text-center">
                                <p className="text-[12.5px] font-bold leading-relaxed opacity-90 max-w-[280px] mx-auto" style={{ color: currentTheme.id === 'light' ? '#54544F' : '#D7D7D2' }}>
                                  {currentLevel.line}
                                </p>
                              </div>
                            )}

                            {/* 4-Dimension breakdown */}
                            {showDimensions && (
                              <div className="flex flex-col gap-2 my-1">
                                {dimensionsList.map((dim) => {
                                  const isWeak = dim.name === weakestDim;
                                  return (
                                    <div key={dim.name} className="flex flex-col gap-1">
                                      <div className="flex justify-between items-baseline text-[9px]">
                                        <span className="font-bold flex items-center gap-1" style={{ color: currentTheme.text }}>
                                          {dim.name}
                                          {isWeak && (
                                            <span className="text-[7px] tracking-[0.05em] bg-[#E5484D] text-white px-1.5 py-0.5 font-extrabold uppercase scale-90">
                                              GAP
                                            </span>
                                          )}
                                        </span>
                                        <span className="font-bold opacity-80" style={{ color: currentTheme.text }}>{dim.value}%</span>
                                      </div>
                                      <div className="h-1.5 w-full relative" style={{ backgroundColor: currentTheme.trackBg }}>
                                        <div 
                                          className="h-full transition-all duration-500" 
                                          style={{ 
                                            width: `${dim.value}%`, 
                                            backgroundColor: currentTheme.accent 
                                          }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Biggest Gap */}
                            <div className="border-l-2 pl-3 py-0.5 text-left" style={{ borderLeftColor: currentTheme.accent }}>
                              <span className="text-[9px] tracking-[0.1em] uppercase text-[#9A9A93] font-semibold block">Biggest Gap</span>
                              <span className="font-['Archivo'] font-black text-sm tracking-tight uppercase" style={{ color: currentTheme.text }}>
                                {weakestDim}
                              </span>
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="flex flex-col gap-1.5 border-t pt-4 text-center mt-auto flex-shrink-0" style={{ borderColor: currentTheme.border }}>
                            <span className="text-[11px] font-black tracking-wider font-mono" style={{ color: currentTheme.accent }}>@systems_for_sme</span>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Sticky Action Bar */}
      {step < 6 && (
        <div className="fixed bottom-0 left-0 w-full z-50 px-6 pb-8 pt-4 bg-[#fff8f2]/90 backdrop-blur-lg border-t border-[#2b3040]/10">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-6">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className={`flex items-center gap-1.5 font-bold text-[13px] tracking-wider uppercase transition-all py-3 ${
                step === 0 ? "opacity-35 cursor-not-allowed" : "hover:text-[#edb605] active:scale-90"
              }`}
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex items-center justify-center gap-2 bg-[#edb605] text-[#2b3040] font-extrabold text-[13px] tracking-widest uppercase rounded-full px-8 py-4 shadow-md hover:brightness-105 active:scale-95 transition-all"
            >
              {step === 5 ? "Check my score" : "Next"}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}