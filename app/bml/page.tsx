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
  title: "Business Maturity Level (BML) Calculator | Systems for SME",
  description: "Take the free 5-minute BML Calculator to find out how dependent your business is on you — and get a specific systems roadmap to fix it.",
};

export default function BMLPage() {
  return <BMLCalculatorClient />;
}