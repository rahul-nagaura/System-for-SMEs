"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import { revenueOptions } from "@/app/bml/bml-data";

// Available call slots (Raghav confirms the exact one over WhatsApp).
const timeSlots = ["2:00–3:00 PM", "10:00–11:00 PM", "11:00 PM–12:00 AM"];

// Raghav's WhatsApp number (country code + number, digits only) for the
// click-to-chat link built on submit.
const WHATSAPP_NUMBER = "919417149638";

// Build a wa.me link with the chosen date + slot pre-filled into the message.
const buildWhatsAppUrl = (date: string, slot: string) => {
  const message = `Hi Team, I've completed my onboarding form and booked a Systems Strategy Session with Raghav for ${date}, ${slot}. I'd like to proceed to the next step — could you please share the payment link to confirm my slot? Thank you!`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

interface FormData {
  fullName: string;
  phone: string;
  businessName: string;
  description: string;
  teamSize: string;
  revenue: string;
  tracking: string;
  problems: string[];
  otherProblem: string;
  fixedBefore: string;
  authority: string;
  bookingDate: string;
  slot: string;
}

const initialFormState: FormData = {
  fullName: "",
  phone: "",
  businessName: "",
  description: "",
  teamSize: "",
  revenue: "",
  tracking: "",
  problems: [],
  otherProblem: "",
  fixedBefore: "",
  authority: "",
  bookingDate: "",
  slot: "",
};

export default function BookingPage() {
  const [form, setForm] = useState<FormData>(initialFormState);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // Next 7 days as selectable date labels. Computed in IST so server-rendered
  // and client-hydrated labels match. Past days never appear and the list
  // rolls forward automatically each day.
  const dateOptions = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          timeZone: "Asia/Kolkata",
        });
      }),
    []
  );

  const handleTextChange = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [k]: e.target.value });
  };

  const selectRadio = (k: keyof FormData, val: string) => {
    setForm({ ...form, [k]: val });
  };

  const toggleCheckbox = (problemVal: string) => {
    const current = [...form.problems];
    const index = current.indexOf(problemVal);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(problemVal);
    }
    setForm({ ...form, problems: current });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.businessName.trim() || !form.description.trim()) {
      alert("Please fill out all required text fields in Section 01.");
      return;
    }
    if (!form.teamSize) {
      alert("Please select your current team size in Section 02.");
      return;
    }
    if (!form.revenue) {
      alert("Please select your average monthly revenue in Section 02.");
      return;
    }
    if (!form.tracking) {
      alert("Please select how you track daily tasks/sales in Section 02.");
      return;
    }
    if (!form.fixedBefore) {
      alert("Please answer whether you have tried fixing this before in Section 03.");
      return;
    }
    if (!form.authority) {
      alert("Please select your decision-making authority in Section 04.");
      return;
    }
    if (!form.bookingDate) {
      alert("Please pick a preferred date in Section 05.");
      return;
    }
    if (!form.slot) {
      alert("Please pick a preferred time slot in Section 05.");
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch("/api/booking-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
    } catch (err) {
      console.error("Failed to submit booking session to database: ", err);
    } finally {
      setIsSubmitting(false);
      // Show the confirmation screen (fallback) and redirect to WhatsApp so the
      // user can confirm timing + get the payment link. The chosen date + slot
      // are already saved to the Results sheet above.
      setSubmitted(true);
      window.location.href = buildWhatsAppUrl(form.bookingDate, form.slot);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fff8f2] text-[#201b11] flex flex-col font-sans">
        <Nav />
        <main className="flex-grow pt-32 pb-24 px-6 max-w-xl mx-auto w-full flex flex-col justify-center items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#fcdc95] flex items-center justify-center border-2 border-[#725b22] shadow-md animate-bounce">
            <span className="material-symbols-outlined text-4xl text-[#775a00]">check</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Form Secured &amp; Received!</h1>
          <p className="text-base text-[#4f4633] leading-relaxed max-w-md">
            Your details are saved. We&apos;re taking you to WhatsApp to confirm your slot and share the payment link. If it doesn&apos;t open automatically, tap below.
          </p>
          <div className="pt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={buildWhatsAppUrl(form.bookingDate, form.slot)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#edb605] text-[#201b11] font-bold py-4 px-8 border-2 border-[#725b22] uppercase tracking-wider hover:brightness-105 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
            >
              Continue on WhatsApp
              <span className="material-symbols-outlined text-lg">open_in_new</span>
            </a>
            <Link
              href="/"
              className="bg-transparent text-[#201b11] font-bold py-4 px-8 border-2 border-[#725b22] uppercase tracking-wider hover:bg-[#725b22]/5 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
            >
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f2] text-[#201b11] flex flex-col font-sans selection:bg-[#edb605]/30">
      <Nav />

      {/* Main Form Area */}
      <main className="flex-grow pt-24 pb-24 px-6 max-w-[800px] mx-auto w-full">
        {/* Intro */}
        <section className="pb-12 text-left space-y-4">
          <div className="inline-flex">
            <span className="bg-[#edb605] text-[#201b11] px-3 py-1 text-[11px] font-bold uppercase tracking-widest border border-[#725b22]/20">
              Before Your Session
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">Pre-Session Onboarding Form</h1>
          <p className="text-base text-[#4f4633] font-medium">Tell us a little about your business. Takes under 2 minutes.</p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-16">
          {/* SECTION 1: Basic Info */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#775a00]">01. Basic Protocol</span>
              <div className="h-[1px] flex-grow bg-[#725b22]/20"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#4f4633]">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={handleTextChange("fullName")}
                  className="w-full bg-[#f8ecdc] border border-[#725b22] py-4 px-4 text-base focus:border-[#edb605] outline-none"
                  placeholder="e.g. John Smith"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#4f4633]">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleTextChange("phone")}
                  className="w-full bg-[#f8ecdc] border border-[#725b22] py-4 px-4 text-base focus:border-[#edb605] outline-none"
                  placeholder="+91 00000 00000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#4f4633]">Business Name *</label>
              <input
                type="text"
                required
                value={form.businessName}
                onChange={handleTextChange("businessName")}
                className="w-full bg-[#f8ecdc] border border-[#725b22] py-4 px-4 text-base focus:border-[#edb605] outline-none"
                placeholder="e.g. Global Tech Solutions"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#4f4633]">Business Description *</label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={handleTextChange("description")}
                className="w-full bg-[#f8ecdc] border border-[#725b22] py-4 px-4 text-base focus:border-[#edb605] outline-none resize-none"
                placeholder="Briefly describe what your business does..."
              />
            </div>
          </section>

          {/* SECTION 2: Business Snapshot */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#775a00]">02. Operational Snapshot</span>
              <div className="h-[1px] flex-grow bg-[#725b22]/20"></div>
            </div>

            <div className="space-y-4">
              <p className="text-[17px] font-bold">What is your current team size? *</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {["Just me", "2–5", "6–15", "16–30", "30+"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => selectRadio("teamSize", size)}
                    className={`border-2 p-4 text-center text-sm font-bold transition-all duration-200 ${
                      form.teamSize === size
                        ? "border-[#edb605] bg-[#fcdc95]"
                        : "border-[#725b22]/20 bg-transparent hover:bg-[#725b22]/5"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-[17px] font-bold">What is your average monthly revenue? *</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {revenueOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => selectRadio("revenue", opt.text)}
                    className={`border-2 p-4 text-center text-sm font-bold transition-all duration-200 ${
                      form.revenue === opt.text
                        ? "border-[#edb605] bg-[#fcdc95]"
                        : "border-[#725b22]/20 bg-transparent hover:bg-[#725b22]/5"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-[17px] font-bold">How do you currently track daily tasks/sales? *</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { val: "registers", label: "Registers / Diary", icon: "menu_book" },
                  { val: "whatsapp", label: "WhatsApp", icon: "chat" },
                  { val: "excel", label: "Excel / Sheets", icon: "table_chart" },
                  { val: "software", label: "Tally / ERP", icon: "terminal" },
                  { val: "none", label: "Nothing consistent", icon: "warning" },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => selectRadio("tracking", item.val)}
                    className={`border-2 p-4 flex flex-col items-center justify-center gap-3 text-center text-xs font-bold transition-all duration-200 ${
                      form.tracking === item.val
                        ? "border-[#edb605] bg-[#fcdc95]"
                        : "border-[#725b22]/20 bg-transparent hover:bg-[#725b22]/5"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[#775a00] text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 3: Bottleneck Analysis */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#775a00]">03. Bottleneck Analysis</span>
              <div className="h-[1px] flex-grow bg-[#725b22]/20"></div>
            </div>

            <div className="space-y-4">
              <p className="text-[17px] font-bold">Where is the system breaking down? (Select all that apply)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { val: "staff", label: "Staff Management" },
                  { val: "data", label: "Lack of Data Insight" },
                  { val: "owner_dependency", label: "Dependency on Owner" },
                  { val: "sales", label: "Sales Conversion" },
                  { val: "scale", label: "Scaling Friction" },
                ].map((problem) => {
                  const isChecked = form.problems.includes(problem.val);
                  return (
                    <button
                      key={problem.val}
                      type="button"
                      onClick={() => toggleCheckbox(problem.val)}
                      className={`border-2 p-4 text-left text-sm font-bold flex items-center gap-3 transition-all duration-200 ${
                        isChecked
                          ? "border-[#edb605] bg-[#fcdc95]"
                          : "border-[#725b22]/20 bg-transparent hover:bg-[#725b22]/5"
                      }`}
                    >
                      <div className={`w-5 h-5 border-2 flex items-center justify-center bg-white ${
                        isChecked ? "border-[#edb605]" : "border-[#725b22]/30"
                      }`}>
                        {isChecked && <span className="material-symbols-outlined text-xs text-[#775a00] font-black">check</span>}
                      </div>
                      {problem.label}
                    </button>
                  );
                })}
                <div className="flex items-center gap-2 border-2 border-[#725b22]/20 bg-transparent p-2">
                  <span className="material-symbols-outlined text-[#775a00] px-2 text-lg">edit</span>
                  <input
                    type="text"
                    value={form.otherProblem}
                    onChange={handleTextChange("otherProblem")}
                    className="flex-grow bg-transparent text-sm py-2 px-1 focus:ring-0 outline-none placeholder:text-on-surface-variant/40 border-none"
                    placeholder="Other issue specify..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <p className="text-[17px] font-bold">Have you tried fixing this before? *</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { val: "yes", label: "Yes" },
                  { val: "no", label: "No" },
                  { val: "other", label: "Partial Attempt" },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => selectRadio("fixedBefore", item.val)}
                    className={`border-2 py-3 px-8 text-center text-sm font-bold transition-all duration-200 ${
                      form.fixedBefore === item.val
                        ? "border-[#edb605] bg-[#fcdc95]"
                        : "border-[#725b22]/20 bg-transparent hover:bg-[#725b22]/5"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 4: Decision Authority */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#775a00]">04. Authority Protocol</span>
              <div className="h-[1px] flex-grow bg-[#725b22]/20"></div>
            </div>

            <div className="space-y-4">
              <p className="text-[17px] font-bold">Are you the primary decision maker? *</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { val: "owner", label: "Yes, Business Owner" },
                  { val: "partner", label: "Need to discuss with Partner" },
                  { val: "representative", label: "Representing someone else" },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => selectRadio("authority", item.val)}
                    className={`border-2 p-6 text-center text-sm font-bold flex items-center justify-center transition-all duration-200 h-24 ${
                      form.authority === item.val
                        ? "border-[#edb605] bg-[#fcdc95]"
                        : "border-[#725b22]/20 bg-transparent hover:bg-[#725b22]/5"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 5: Schedule the Call */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#775a00]">05. Book Your Slot</span>
              <div className="h-[1px] flex-grow bg-[#725b22]/20"></div>
            </div>

            <div className="space-y-3">
              <p className="text-[17px] font-bold">Pick your preferred date *</p>
              <p className="text-xs text-[#4f4633]/70">We&apos;ll confirm the final date with you on WhatsApp.</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {dateOptions.map((date) => (
                  <button
                    key={date}
                    type="button"
                    onClick={() => selectRadio("bookingDate", date)}
                    className={`border-2 p-3 text-center text-xs font-bold transition-all duration-200 ${
                      form.bookingDate === date
                        ? "border-[#edb605] bg-[#fcdc95]"
                        : "border-[#725b22]/20 bg-transparent hover:bg-[#725b22]/5"
                    }`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <p className="text-[17px] font-bold">Pick your preferred time slot *</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => selectRadio("slot", slot)}
                    className={`border-2 p-4 text-center text-sm font-bold transition-all duration-200 ${
                      form.slot === slot
                        ? "border-[#edb605] bg-[#fcdc95]"
                        : "border-[#725b22]/20 bg-transparent hover:bg-[#725b22]/5"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Submit */}
          <footer className="pt-12 space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#edb605] text-[#201b11] py-5 px-12 border-2 border-[#725b22] font-extrabold uppercase tracking-wider hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>Securing Connection...</>
              ) : (
                <>
                  Book My Session
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
            <p className="text-center text-[10px] font-bold uppercase tracking-wider text-[#4f4633]/60">
              Your data is protected under SME encryption protocols.
            </p>
          </footer>
        </form>
      </main>

      {/* Global Footer */}
      <footer className="bg-[#f8ecdc]/50 border-t-2 border-[#725b22] w-full py-8 mt-24">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-extrabold text-sm uppercase text-[#201b11]">Systems for SME</div>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-wider">
            <Link href="/bml" className="text-[#4f4633] hover:text-[#775a00] transition-colors">BML Calculator</Link>
            <Link href="/vault" className="text-[#4f4633] hover:text-[#775a00] transition-colors">Vault</Link>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#725b22]/70">© 2026 Systems for SME. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
