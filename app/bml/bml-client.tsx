"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Nav from "@/app/components/Nav";
import CustomToggle from "@/app/components/CustomToggle";
import {
  questions,
  biggestProblems,
  revenueOptions,
  businessTypes,
  investmentOptions,
  cardThemes,
  levels,
  gapCopy,
} from "./bml-data";
import { getRingGeometry, getBandColor, computeDimensions } from "./bml-scoring";
import { downloadResultCard } from "./bml-card";

export default function BMLCalculator() {
  const [step, setStep] = useState<number>(0); // 0 = Intro, 1-5 = Q1-Q5, 6 = Lead Capture, 7 = Result
  const [name, setName] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [revenue, setRevenue] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [typeOfBusiness, setTypeOfBusiness] = useState<string>("");
  const [businessDescription, setBusinessDescription] = useState<string>("");
  const [cityState, setCityState] = useState<string>("");
  const [investmentReadiness, setInvestmentReadiness] = useState<string>("");
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

  // Derive the four dimension scores, weakest gap, overall % and 0–15
  // score from the answers (see bml-scoring.ts for the math).
  const { opEff, finCtrl, humCap, digMat, weakestDim, averagePercentage, displayScore } =
    computeDimensions(answers, selectedProblems);
  const ringGeometry = getRingGeometry(displayScore);

  const currentLevel = levels.find(l => displayScore >= l.min && displayScore <= l.max) || levels[0];
  const currentLevelIndex = levels.indexOf(currentLevel) + 1;
  const stageNameOnly = currentLevel.name.split(" ")[0];

  const currentTheme = cardThemes.find(t => t.id === themeId) || cardThemes[0];

  const dimensionsList = [
    { name: "Operational Efficiency", value: opEff },
    { name: "Financial Control", value: finCtrl },
    { name: "Human Capital", value: humCap },
    { name: "Digital Maturity", value: digMat }
  ];

  const currentCopy = gapCopy[weakestDim as keyof typeof gapCopy] || gapCopy["Operational Efficiency"];

  // Render + download the shareable result card (see bml-card.ts).
  const downloadPNG = () => {
    downloadResultCard({
      themeId,
      exportName,
      showScoreRing,
      showLevel,
      showDimensions,
      averagePercentage,
      currentLevelIndex,
      stageNameOnly,
      currentLevelLine: currentLevel.line,
      ringGeometry,
      dimensionsList,
      weakestDim,
    });
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
      if (selectedProblems.length === 0) {
        alert("Please select at least one problem");
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
    if (!whatsapp.trim() || whatsapp.replace(/[\s\-+]/g, "").length < 10) {
      alert("Please enter a valid phone number");
      return;
    }
    if (!typeOfBusiness) {
      alert("Please select your type of business");
      return;
    }
    if (!businessDescription.trim()) {
      alert("Please explain your business in brief");
      return;
    }
    if (!cityState.trim()) {
      alert("Please enter your city and state");
      return;
    }
    if (!investmentReadiness) {
      alert("Please tell us if you are ready to invest");
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
      biggestProblem: selectedProblems.join(", "),
      typeOfBusiness,
      businessDescription,
      cityState,
      investmentReadiness,
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

  // Add/remove a pain point from the multi-select list.
  const toggleProblem = (problemText: string) => {
    setSelectedProblems((prev) =>
      prev.includes(problemText)
        ? prev.filter((p) => p !== problemText)
        : [...prev, problemText]
    );
  };


  return (
    <div className={`min-h-screen ${
      step === 7 ? "bg-[#F7F7F5] text-[#0E0E0E]" : "bg-[#fff8f2] text-[#2b3040]"
    } font-sans flex flex-col relative overflow-x-hidden transition-colors duration-300`}>
      <Nav />

      {/* Main Content Area */}
      <main className={`flex-grow pt-24 px-6 ${step < 6 ? "pb-32" : "pb-10"} ${
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
                      <h3 className="text-xl font-bold text-[#2b3040] mt-1">What do you feel are the biggest problems that you face? *</h3>
                      <p className="text-xs text-[#2b3040]/50 font-medium mt-1">Select all that apply.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {biggestProblems.map((prob) => {
                        const isChecked = selectedProblems.includes(prob.text);
                        return (
                          <button
                            key={prob.label}
                            type="button"
                            className={`flex items-start gap-3 md:gap-4 p-3 md:p-3.5 rounded-lg border text-left transition-all duration-200 ${
                              isChecked
                                ? "border-[#edb605] bg-[#edb605]/5 font-semibold"
                                : "border-[#2b3040]/10 bg-[#fff8f2]/30 hover:bg-[#2b3040]/5"
                            }`}
                            onClick={() => toggleProblem(prob.text)}
                          >
                            <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                              isChecked ? "border-[#edb605] bg-[#edb605]" : "border-[#2b3040]/30 bg-white"
                            }`}>
                              <span className={`material-symbols-outlined text-white text-sm font-black transition-transform ${
                                isChecked ? "scale-100" : "scale-0"
                              }`}>check</span>
                            </div>
                            <span className="text-sm text-[#2b3040]">{prob.text}</span>
                          </button>
                        );
                      })}
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
          <div className="w-full pt-6 space-y-6 max-w-lg mx-auto z-10 relative">
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
                  <p className="text-[11px] text-[#666666]/70 ml-1">Business email is preferred.</p>
                </div>
                {/* Phone Field */}
                <div className="space-y-2">
                  <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#666666] block ml-1 uppercase" htmlFor="whatsapp">Phone Number *</label>
                  <div className="relative group">
                    <input
                      className="w-full bg-[#f4ede6] border border-[#e0d8d0] rounded-xl px-4 py-4 text-[#1a1a1a] placeholder:text-[#666666]/40 focus:outline-none focus:border-[#edb605] focus:ring-1 focus:ring-[#edb605] transition-all"
                      id="whatsapp"
                      placeholder="+91 98XXX XXXXX"
                      required
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#666666] opacity-40 group-focus-within:text-[#edb605] transition-colors">phone_iphone</span>
                  </div>
                  <p className="text-[11px] text-[#666666]/70 ml-1">Personal or business contact.</p>
                </div>
                {/* Type of Business */}
                <div className="space-y-2">
                  <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#666666] block ml-1 uppercase">Type of Business *</label>
                  <div className="grid grid-cols-1 gap-2">
                    {businessTypes.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setTypeOfBusiness(opt.text)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left text-sm transition-all duration-200 ${
                          typeOfBusiness === opt.text
                            ? "border-[#edb605] bg-[#edb605]/5 font-semibold text-[#1a1a1a]"
                            : "border-[#e0d8d0] bg-[#f4ede6] hover:border-[#edb605]/50 text-[#1a1a1a]"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          typeOfBusiness === opt.text ? "border-[#edb605]" : "border-[#666666]/30"
                        }`}>
                          <div className={`w-2 h-2 rounded-full bg-[#edb605] transition-transform ${
                            typeOfBusiness === opt.text ? "scale-100" : "scale-0"
                          }`}></div>
                        </div>
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Business Brief */}
                <div className="space-y-2">
                  <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#666666] block ml-1 uppercase" htmlFor="bml-description">Explain Your Business in Brief *</label>
                  <textarea
                    className="w-full bg-[#f4ede6] border border-[#e0d8d0] rounded-xl px-4 py-4 text-[#1a1a1a] placeholder:text-[#666666]/40 focus:outline-none focus:border-[#edb605] focus:ring-1 focus:ring-[#edb605] transition-all resize-none"
                    id="bml-description"
                    rows={3}
                    required
                    placeholder="What does your business do?"
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                  />
                </div>
                {/* City / State */}
                <div className="space-y-2">
                  <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#666666] block ml-1 uppercase" htmlFor="city-state">City / State *</label>
                  <input
                    className="w-full bg-[#f4ede6] border border-[#e0d8d0] rounded-xl px-4 py-4 text-[#1a1a1a] placeholder:text-[#666666]/40 focus:outline-none focus:border-[#edb605] focus:ring-1 focus:ring-[#edb605] transition-all"
                    id="city-state"
                    type="text"
                    required
                    placeholder="e.g. Jaipur, Rajasthan"
                    value={cityState}
                    onChange={(e) => setCityState(e.target.value)}
                  />
                  <p className="text-[11px] text-[#666666]/70 ml-1">Please enter city and state.</p>
                </div>
                {/* Investment Readiness */}
                <div className="space-y-2">
                  <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#666666] block ml-1 uppercase">Are You Ready to Invest to Solve Your Business Problems? *</label>
                  <div className="grid grid-cols-1 gap-2">
                    {investmentOptions.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setInvestmentReadiness(opt.text)}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-left text-sm transition-all duration-200 ${
                          investmentReadiness === opt.text
                            ? "border-[#edb605] bg-[#edb605]/5 font-semibold text-[#1a1a1a]"
                            : "border-[#e0d8d0] bg-[#f4ede6] hover:border-[#edb605]/50 text-[#1a1a1a]"
                        }`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          investmentReadiness === opt.text ? "border-[#edb605]" : "border-[#666666]/30"
                        }`}>
                          <div className={`w-2 h-2 rounded-full bg-[#edb605] transition-transform ${
                            investmentReadiness === opt.text ? "scale-100" : "scale-0"
                          }`}></div>
                        </div>
                        {opt.text}
                      </button>
                    ))}
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
          <div className="w-full pt-6 space-y-12 animate-in fade-in duration-500 max-w-[1120px] mx-auto pb-2">
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
              <div className="order-2 lg:order-2 flex flex-col gap-[22px] text-left">
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
              <div className="order-3 lg:order-3 lg:col-span-2 pt-2 pb-2">
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