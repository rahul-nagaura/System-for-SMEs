import HomeNav from "./components/home/HomeNav";
import Hero from "./components/home/Hero";
import SoundFamiliar from "./components/home/SoundFamiliar";
import StatBand from "./components/home/StatBand";
import CheckBml from "./components/home/CheckBml";
import WhatWeDo from "./components/home/WhatWeDo";
import ProductTracking from "./components/home/ProductTracking";
import AboutUs from "./components/home/AboutUs";
import Testimonials, { Review } from "./components/home/Testimonials";
import HowItWorks from "./components/home/HowItWorks";
import ReadyCta from "./components/home/ReadyCta";
import HomeFooter from "./components/home/HomeFooter";
import { Montserrat } from "next/font/google";

// The redesign's brand font (from Figma).
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const defaultReviews: Review[] = [
  {
    name: "Anand K.",
    role: "Retail Chain Owner",
    text: "I was managing 15 retail stores via phone calls. After one session, we moved to a dashboard. I finally had a Sunday off after 3 years.",
    rating: 5,
  },
  {
    name: "Priya M.",
    role: "Manufacturing Director",
    text: "Raghav understands the reality of Indian SME staff. He doesn't suggest complex tech they won't use. He suggests what actually works.",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "Logistics Provider",
    text: "The best money I've spent on my business. The roadmap alone saved me 2 months of trial and error with different softwares.",
    rating: 5,
  },
];

/**
 * Landing page — a thin composition of the section components in
 * `app/components/home/`. Each section lives in its own file; this file just
 * orders them and wires the dynamic reviews (from the Google Sheet) through.
 */
export default function LandingPage({ content }: { content: { reviews?: Review[] } }) {
  const reviews: Review[] =
    content.reviews && content.reviews.length > 0 ? content.reviews : defaultReviews;

  return (
    <div className={`${montserrat.className} bg-white text-[#0E0E0E] overflow-x-hidden`}>
      <HomeNav />
      <Hero />
      <SoundFamiliar />
      <StatBand />
      <CheckBml />
      <WhatWeDo />
      <ProductTracking />
      <AboutUs />
      <Testimonials reviews={reviews} />
      <HowItWorks />
      <ReadyCta />
      <HomeFooter />
    </div>
  );
}
