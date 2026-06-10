"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const defaultReviews = [
  {
    name: "Anand K.",
    role: "Retail Chain Owner",
    text: "I was managing 15 retail stores via phone calls. After one session, we moved to a dashboard. I finally had a Sunday off after 3 years.",
    rating: 5
  },
  {
    name: "Priya M.",
    role: "Manufacturing Director",
    text: "Raghav understands the reality of Indian SME staff. He doesn't suggest complex tech they won't use. He suggests what actually works.",
    rating: 5
  },
  {
    name: "Vikram Singh",
    role: "Logistics Provider",
    text: "The best ₹1500 I've spent on my business. The roadmap alone saved me 2 months of trial and error with different softwares.",
    rating: 5
  }
];

const defaultFAQs = [
  {
    question: "What if I don't use any tech right now?",
    answer: "That's perfectly fine. We start from wherever you are. Whether you're using pen and paper or WhatsApp, our goal is to find the *simplest* next step for you."
  },
  {
    question: "Will you implement the systems for me?",
    answer: "This session is for strategy and a roadmap. If you need implementation support after the session, we can discuss a full consulting engagement, but there is no obligation."
  },
  {
    question: "Is this session suitable for any industry?",
    answer: "The principles of systems apply to almost any business. However, I specialize in Manufacturing, Retail, Wholesale, and Logistics."
  },
  {
    question: "How do I prepare for the session?",
    answer: "Just bring your biggest operational headaches and an open mind. If you have an org chart or a list of your current staff roles, that's a bonus."
  }
];

export default function LandingPage({ content }: { content: any }) {
  const priceText = content.settings.pricing_amount 
    ? (String(content.settings.pricing_amount).startsWith("₹") ? content.settings.pricing_amount : `₹${content.settings.pricing_amount}`) 
    : "₹1,499";

  const ownerPhoto = content.settings.owner_photo_url || "/raghav.jpg";
  const reviewsList = content.reviews && content.reviews.length > 0 ? content.reviews : defaultReviews;
  const faqsList = content.faqs && content.faqs.length > 0 ? content.faqs : defaultFAQs;

  return (
    <div className="brutalist-theme">
      {/* 2. Hero Section */}
      <section className="pt-8 pb-section-padding-desktop px-gutter max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-[2px] w-12 bg-primary-container block"></span>
            <span className="font-section-label text-section-label text-text-primary uppercase tracking-[0.2em]">
              FOR SME OWNERS &amp; FAMILY BUSINESS HEIRS
            </span>
          </div>
          <h1 className="font-display-xl text-display-xl-mobile md:text-display-xl text-text-primary mb-8 leading-[0.95]">
            Your Business Runs You. <br />
            <span className="text-zinc-400">Let&apos;s Fix That.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-[540px]">
            A 60-minute Systems Strategy Session to diagnose your operational bottlenecks and map out a clear path to delegation and scalability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              className="bg-primary-container text-text-primary font-button-text text-button-text uppercase py-5 px-10 flex items-center justify-center gap-2 hover:brightness-95 transition-all text-center border-2 border-text-primary"
              href="/booking"
            >
              Book the Session — {priceText}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link
              className="bg-transparent text-text-primary font-button-text text-button-text uppercase py-5 px-10 border-2 border-text-primary flex items-center justify-center gap-2 hover:bg-surface-muted transition-colors text-center"
              href="#process"
            >
              See What&apos;s Included
              <span className="material-symbols-outlined">arrow_downward</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-1">
              <div className="w-10 h-10 bg-surface-muted border border-text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">factory</span>
              </div>
              <div className="w-10 h-10 bg-surface-muted border border-text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">storefront</span>
              </div>
              <div className="w-10 h-10 bg-surface-muted border border-text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              </div>
            </div>
            <p className="font-section-label text-[11px] text-text-primary uppercase tracking-widest">
              Used by business owners in steel, retail &amp; logistics.
            </p>
          </div>
        </div>

        <div className="relative bg-surface-muted border-2 border-text-primary p-4 lg:p-12 aspect-square lg:aspect-auto lg:h-[600px] flex items-center justify-center overflow-hidden">
          <div className="w-full h-full border border-zinc-300 bg-white shadow-2xl relative p-8 flex flex-col gap-6">
            <div className="h-6 w-1/3 bg-primary-container"></div>
            <div className="space-y-3">
              <div className="h-3 w-full bg-zinc-100"></div>
              <div className="h-3 w-full bg-zinc-100"></div>
              <div className="h-3 w-3/4 bg-zinc-100"></div>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="aspect-video bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-zinc-300 text-5xl">bar_chart</span>
              </div>
              <div className="aspect-video bg-primary-container/10 border border-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-container text-5xl">account_tree</span>
              </div>
            </div>
            <div className="h-32 w-full border border-dashed border-zinc-300 flex items-center justify-center">
              <span className="text-zinc-300 font-section-label uppercase">Operations Map V1.0</span>
            </div>
            <div className="absolute bottom-8 right-8 w-20 h-20 bg-primary-container flex items-center justify-center border-2 border-text-primary shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]">
              <span className="material-symbols-outlined text-text-primary text-4xl">check</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pain Agitation */}
      <section className="bg-text-primary text-white py-section-padding-desktop px-gutter" id="problems">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-16">
            <p className="font-section-label text-section-label text-primary-container mb-4 uppercase tracking-[0.2em]">
              THE CHALLENGE
            </p>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-4">
              Does this sound familiar?
            </h2>
            <p className="text-zinc-400 max-w-[600px]">
              Running an SME is hard, but it shouldn&apos;t be exhausting. Most owners are trapped in these cycles:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800">
            <div className="bg-text-primary p-10 hover:bg-zinc-900 transition-colors">
              <span className="material-symbols-outlined text-primary-container text-4xl mb-6">psychology</span>
              <h3 className="font-bold text-xl mb-4">The &ldquo;Founder&apos;s Trap&rdquo;</h3>
              <p className="text-zinc-400">
                Decisions stop at your desk. Nothing moves unless you&apos;re personally involved or give the final okay.
              </p>
            </div>
            <div className="bg-text-primary p-10 hover:bg-zinc-900 transition-colors">
              <span className="material-symbols-outlined text-primary-container text-4xl mb-6">chat_error</span>
              <h3 className="font-bold text-xl mb-4">WhatsApp Management</h3>
              <p className="text-zinc-400">
                Operations happen over 50 different WhatsApp groups. Information is scattered and accountability is zero.
              </p>
            </div>
            <div className="bg-text-primary p-10 hover:bg-zinc-900 transition-colors">
              <span className="material-symbols-outlined text-primary-container text-4xl mb-6">person_alert</span>
              <h3 className="font-bold text-xl mb-4">Unreliable Hiring</h3>
              <p className="text-zinc-400">
                You hire people but end up doing their work because &ldquo;it&apos;s faster to do it myself than explain it.&rdquo;
              </p>
            </div>
            <div className="bg-text-primary p-10 hover:bg-zinc-900 transition-colors">
              <span className="material-symbols-outlined text-primary-container text-4xl mb-6">sync_problem</span>
              <h3 className="font-bold text-xl mb-4">Firefighting Daily</h3>
              <p className="text-zinc-400">
                You spend 90% of your day solving urgent problems instead of focusing on growing the business.
              </p>
            </div>
            <div className="bg-text-primary p-10 hover:bg-zinc-900 transition-colors">
              <span className="material-symbols-outlined text-primary-container text-4xl mb-6">visibility_off</span>
              <h3 className="font-bold text-xl mb-4">Zero Visibility</h3>
              <p className="text-zinc-400">
                You don&apos;t know your real-time margins or stock levels without asking 3 different people for reports.
              </p>
            </div>
            <div className="bg-text-primary p-10 hover:bg-zinc-900 transition-colors">
              <span className="material-symbols-outlined text-primary-container text-4xl mb-6">home_work</span>
              <h3 className="font-bold text-xl mb-4">Generational Friction</h3>
              <p className="text-zinc-400">
                As an heir, you want to modernize, but the &ldquo;old way&rdquo; of doing things is holding the company back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. What is the Session */}
      <section className="py-section-padding-desktop px-gutter bg-white" id="process">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div>
            <p className="font-section-label text-section-label text-text-primary mb-4 uppercase tracking-[0.2em]">
              THE SOLUTION
            </p>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-8">
              What is the Systems Strategy Session?
            </h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-container flex items-center justify-center font-bold border border-text-primary">
                  01
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 uppercase">Operational Audit</h4>
                  <p className="text-on-surface-variant">
                    We map out your current workflow—from lead to delivery—and find where the leaks are.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-container flex items-center justify-center font-bold border border-text-primary">
                  02
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 uppercase">Bottleneck Diagnosis</h4>
                  <p className="text-on-surface-variant">
                    Identify which tasks *must* be done by you and which can be automated or delegated immediately.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-container flex items-center justify-center font-bold border border-text-primary">
                  03
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 uppercase">Implementation Roadmap</h4>
                  <p className="text-on-surface-variant">
                    A step-by-step plan on which tools (ERP, CRM, Notion) and processes to install first.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-surface-muted border-2 border-text-primary p-12 relative">
            <div className="absolute -top-6 -right-6 bg-primary-container text-text-primary font-bold px-6 py-3 border-2 border-text-primary shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
              60 MINS
            </div>
            <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter">THE AGENDA</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 border-b border-zinc-200 pb-4">
                <span className="material-symbols-outlined text-primary-container">timer</span>
                <span>10m: Deep Dive into your current pain points</span>
              </li>
              <li className="flex items-center gap-3 border-b border-zinc-200 pb-4">
                <span className="material-symbols-outlined text-primary-container">architecture</span>
                <span>25m: Live Mapping of your critical path</span>
              </li>
              <li className="flex items-center gap-3 border-b border-zinc-200 pb-4">
                <span className="material-symbols-outlined text-primary-container">edit_note</span>
                <span>15m: Tool &amp; Team recommendations</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">question_answer</span>
                <span>10m: Open Q&amp;A for your specific industry</span>
              </li>
            </ul>
            <div className="mt-12">
              <Link
                className="inline-flex items-center gap-2 text-text-primary font-bold border-b-2 border-primary-container hover:border-text-primary transition-all"
                href="/booking"
              >
                RESERVE YOUR SPOT NOW
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Deliverable Value Stack */}
      <section className="py-section-padding-desktop px-gutter bg-surface-muted" id="value">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-4">
              Massive Value. Tiny Investment.
            </h2>
            <p className="text-on-surface-variant">What you get for the price of a dinner for two.</p>
          </div>
          <div className="bg-white border-2 border-text-primary overflow-hidden shadow-[16px_16px_0px_0px_rgba(10,10,10,0.05)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-text-primary text-white">
                  <th className="p-6 font-section-label uppercase tracking-widest border-r border-zinc-700">
                    Deliverable
                  </th>
                  <th className="p-6 font-section-label uppercase tracking-widest text-right">
                    Market Value
                  </th>
                </tr>
              </thead>
              <tbody className="text-text-primary">
                <tr className="border-b border-zinc-100">
                  <td className="p-6 border-r border-zinc-100">
                    <span className="font-bold block">1-on-1 Systems Audit (60 Mins)</span>
                    <span className="text-sm text-zinc-500">
                      Direct consultation focused on your unique business logic.
                    </span>
                  </td>
                  <td className="p-6 text-right font-bold text-text-primary">₹15,000</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="p-6 border-r border-zinc-100">
                    <span className="font-bold block">The SME Tool-Kit (PDF)</span>
                    <span className="text-sm text-zinc-500">
                      Curated list of 15+ softwares for inventory, sales &amp; finance.
                    </span>
                  </td>
                  <td className="p-6 text-right font-bold text-text-primary">₹2,500</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="p-6 border-r border-zinc-100">
                    <span className="font-bold block">Sample SOP Template</span>
                    <span className="text-sm text-zinc-500">
                      A plug-and-play format to start documenting your roles.
                    </span>
                  </td>
                  <td className="p-6 text-right font-bold text-text-primary">₹1,500</td>
                </tr>
                <tr className="bg-primary-container/5">
                  <td className="p-6 border-r border-zinc-100">
                    <span className="font-bold block text-lg text-text-primary">Total Real-World Value</span>
                  </td>
                  <td className="p-6 text-right font-black text-lg text-text-primary">₹19,000+</td>
                </tr>
              </tbody>
            </table>
            <div className="p-10 bg-primary-container flex flex-col md:flex-row items-center justify-between gap-8 border-t-2 border-text-primary">
              <div>
                <span className="block font-black text-4xl">ONLY {priceText}</span>
                <span className="text-sm font-bold uppercase tracking-wider text-on-primary-container">
                  Offer valid for first 100 bookings
                </span>
              </div>
              <Link
                className="w-full md:w-auto bg-text-primary text-white px-10 py-5 font-black uppercase text-center hover:bg-zinc-800 transition-colors"
                href="/booking"
              >
                CLAIM THIS VALUE NOW
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Who it is for / Not for */}
      <section className="py-section-padding-desktop px-gutter bg-white border-t border-zinc-100">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-12 border-2 border-text-primary bg-white">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
              <h3 className="font-black text-2xl uppercase tracking-tighter">THIS IS FOR YOU IF:</h3>
            </div>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-zinc-400 mt-1">arrow_forward</span>
                <p className="font-medium">You run a manufacturing, retail, or service business with ₹1Cr+ turnover.</p>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-zinc-400 mt-1">arrow_forward</span>
                <p className="font-medium">
                  You feel like you&apos;ve hit a ceiling and can&apos;t grow without working more hours.
                </p>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-zinc-400 mt-1">arrow_forward</span>
                <p className="font-medium">
                  You are the 2nd/3rd generation in a family business trying to bring structure.
                </p>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-zinc-400 mt-1">arrow_forward</span>
                <p className="font-medium">You&apos;re ready to invest in tech to buy back your time.</p>
              </li>
            </ul>
          </div>
          <div className="p-12 border-2 border-zinc-200 bg-surface-muted">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-red-500 text-3xl">cancel</span>
              <h3 className="font-black text-2xl uppercase tracking-tighter text-zinc-400">NOT FOR YOU IF:</h3>
            </div>
            <ul className="space-y-6 text-zinc-500">
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined mt-1">close</span>
                <p>You&apos;re looking for &ldquo;get rich quick&rdquo; schemes or generic business coaching.</p>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined mt-1">close</span>
                <p>You&apos;re an early-stage startup with no revenue or existing team.</p>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined mt-1">close</span>
                <p>You aren&apos;t willing to change how you currently manage your staff.</p>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined mt-1">close</span>
                <p>You want someone to do the work for you without your input.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 7. Social Proof / Testimonials */}
      <section className="bg-text-primary text-white py-section-padding-desktop px-gutter overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-center mb-16">
            What Owners Are Saying
          </h2>
          {reviewsList.length > 3 ? (
            <div className="relative w-full overflow-hidden py-4">
              <div className="animate-marquee-track flex gap-8">
                {[...reviewsList, ...reviewsList].map((review: any, idx: number) => (
                  <div key={idx} className="p-8 border border-zinc-800 bg-zinc-900 flex flex-col justify-between min-w-[320px] max-w-[400px] flex-shrink-0">
                    <div>
                      <div className="flex text-primary-container mb-6">
                        {Array.from({ length: Math.min(5, Math.max(1, Number(review.rating || 5))) }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined">star</span>
                        ))}
                      </div>
                      <p className="italic text-zinc-300 mb-8 font-body-lg">
                        &ldquo;{review.text}&rdquo;
                      </p>
                    </div>
                    <div>
                      <p className="font-bold">{review.name}</p>
                      <p className="text-sm text-zinc-500 uppercase tracking-widest">{review.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              <style>{`
                @keyframes marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .animate-marquee-track {
                  display: flex;
                  width: max-content;
                  animation: marquee 35s linear infinite;
                }
                .animate-marquee-track:hover {
                  animation-play-state: paused;
                }
              `}</style>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviewsList.map((review: any, idx: number) => (
                <div key={idx} className="p-8 border border-zinc-800 bg-zinc-900 flex flex-col justify-between">
                  <div>
                    <div className="flex text-primary-container mb-6">
                      {Array.from({ length: Math.min(5, Math.max(1, Number(review.rating || 5))) }).map((_, i) => (
                        <span key={i} className="material-symbols-outlined">star</span>
                      ))}
                    </div>
                    <p className="italic text-zinc-300 mb-8 font-body-lg">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </div>
                  <div>
                    <p className="font-bold">{review.name}</p>
                    <p className="text-sm text-zinc-500 uppercase tracking-widest">{review.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 8. About Raghav */}
      <section className="py-section-padding-desktop px-gutter bg-white" id="about">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/5] bg-zinc-100 border-2 border-text-primary overflow-hidden relative">
              <Image
                alt="Portrait of Raghav, systems strategist"
                className="object-cover grayscale contrast-125"
                src={ownerPhoto}
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-primary-container p-10 border-2 border-text-primary shadow-[10px_10px_0px_0px_rgba(10,10,10,1)] hidden md:block">
              <div className="text-4xl font-black">50+</div>
              <div className="font-bold text-sm uppercase">SMEs Optimized</div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="font-section-label text-section-label text-text-primary mb-4 uppercase tracking-[0.2em]">
              THE STRATEGIST
            </p>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-8">Meet Raghav</h2>
            <div className="space-y-6 font-body-lg text-on-surface-variant">
              <p>I don&apos;t believe in &ldquo;management jargon.&rdquo; I believe in systems that work even when you aren&apos;t looking.</p>
              <p>
                Having worked with over 50 traditional businesses across India, I&apos;ve seen that the biggest
                bottleneck isn&apos;t capital or talent—it&apos;s the <strong>founder&apos;s time.</strong>
              </p>
              <p>
                I help SME owners bridge the gap between traditional grit and modern efficiency. My mission is to help
                you build a business that serves your life, not a life that serves your business.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-zinc-100 pt-8">
              <div>
                <h4 className="font-black text-2xl">8+ Years</h4>
                <p className="text-sm uppercase font-bold text-zinc-400">Experience</p>
              </div>
              <div>
                <h4 className="font-black text-2xl">100%</h4>
                <p className="text-sm uppercase font-bold text-zinc-400">Practicality</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Guarantee */}
      <section className="bg-primary-container py-24 px-gutter text-center border-y-2 border-text-primary">
        <div className="max-w-[800px] mx-auto">
          <span className="material-symbols-outlined text-text-primary text-6xl mb-6">workspace_premium</span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-6">
            The &ldquo;No-Risk&rdquo; Guarantee
          </h2>
          <p className="font-body-lg text-on-primary-container mb-10">
            If you feel the session didn&apos;t provide at least 10x the value of your investment within the first 30
            minutes, tell me. I&apos;ll refund your {priceText} instantly. No questions asked. We only want happy clients.
          </p>
          <Link
            className="inline-block bg-text-primary text-white font-bold uppercase py-5 px-12 hover:bg-zinc-800 transition-colors"
            href="/booking"
          >
            I&apos;M READY TO SCALE
          </Link>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="py-section-padding-desktop px-gutter bg-white" id="faq">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-center mb-16">
            Frequently Asked
          </h2>
          <div className="space-y-4">
            {faqsList.map((faq: any, idx: number) => (
              <details key={idx} className="group border-2 border-text-primary">
                <summary className="list-none p-6 font-bold text-lg cursor-pointer flex justify-between items-center bg-white group-open:bg-zinc-50 select-none">
                  {faq.question}
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="p-6 pt-0 text-on-surface-variant border-t border-zinc-100">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Final CTA */}
      <section className="bg-text-primary text-white py-24 px-gutter text-center relative overflow-hidden" id="book">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary-container"></div>
        <div className="max-w-[700px] mx-auto relative z-10">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-8">
            Stop fire-fighting. <br />
            Start leading.
          </h2>
          <p className="text-zinc-400 mb-12 text-lg">
            Book your Systems Strategy Session today and get the roadmap to a business that runs itself.
          </p>
          <div className="bg-zinc-900 border border-zinc-800 p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <div className="text-left w-full md:w-auto">
                <p className="text-sm font-bold uppercase tracking-widest text-primary-container mb-2">Investment</p>
                <p className="text-4xl font-black">
                  {priceText}<span className="text-lg text-zinc-500 font-normal line-through ml-3">₹4,999</span>
                </p>
              </div>
              <Link
                className="w-full md:w-auto bg-primary-container text-text-primary font-black px-12 py-6 text-xl hover:brightness-110 transition-all flex items-center justify-center gap-3 border-2 border-text-primary"
                href="/booking"
              >
                SECURE MY SLOT
                <span className="material-symbols-outlined">bolt</span>
              </Link>
            </div>
            <p className="mt-8 text-sm text-zinc-500">Only 4 slots available for this week.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
