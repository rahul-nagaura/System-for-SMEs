import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Montserrat, Noto_Sans_Devanagari } from "next/font/google";

// Montserrat on every step of the calculator (per the final design: white
// background + Montserrat "all places"). Applied on a wrapper so the nav,
// quiz, lead form and results all inherit it.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Montserrat has no Devanagari letters, so the Hindi version falls back to
// Noto Sans Devanagari. `preload: false` — it is only downloaded when Hindi
// text is actually on screen, so English visitors never pay for it.
const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

const BMLCalculatorClient = dynamic(() => import("./bml-client"), {
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#ffd21f] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-[#111111] font-bold uppercase tracking-widest text-xs">Loading...</p>
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Business Independence Level (BIL) Calculator | Systems for SME",
  description: "Take the free 2-minute BIL Calculator to find your weakest system, why it's happening, and what it's costing you.",
};

// Revalidate hourly — same cadence as the home page's content-feed fetch.
export const revalidate = 3600;

const DEFAULT_PRICING_AMOUNT = "4,999";

export default async function BMLPage() {
  let pricingAmount = DEFAULT_PRICING_AMOUNT;

  // Block 7's CTA price is editable from the Google Sheet: add a
  // `bil_pricing_amount` row to the GlobalSettings tab (same pattern as the
  // home page's `pricing_amount` key — see GOOGLE_SHEET_SETUP.md). Deliberately
  // a SEPARATE key from the home page's, since it's a different offer/price.
  const webappUrl = process.env.GOOGLE_SCRIPT_WEBAPP_URL;
  if (webappUrl) {
    try {
      const res = await fetch(`${webappUrl}?action=fetchContent`, {
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data.settings?.bil_pricing_amount) {
          pricingAmount = String(data.settings.bil_pricing_amount);
        }
      }
    } catch (err) {
      console.error("BIL page settings fetch failed:", err);
    }
  }

  return (
    <div className={montserrat.className} style={{ fontFamily: `${montserrat.style.fontFamily}, ${devanagari.style.fontFamily}` }}>
      <BMLCalculatorClient pricingAmount={pricingAmount} />
    </div>
  );
}
