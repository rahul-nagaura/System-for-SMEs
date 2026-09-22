import type { Metadata } from "next";
import dynamic from "next/dynamic";

const BMLCalculatorClient = dynamic(() => import("./bml-client"), {
  loading: () => (
    <div className="min-h-screen bg-[#fff8f2] flex items-center justify-center font-sans">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#ffd21f] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-[#201b11] font-bold uppercase tracking-widest text-xs">Loading Protocol...</p>
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

  return <BMLCalculatorClient pricingAmount={pricingAmount} />;
}
