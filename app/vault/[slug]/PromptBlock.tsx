"use client";

import { useState } from "react";

export default function PromptBlock({ promptText, label }: { promptText: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="border border-zinc-700 bg-[#1c1c1c] p-6 md:p-8 space-y-6" style={{ borderRadius: "0px" }}>
      <div className="flex justify-between items-center">
        <span className="text-[#ffd21f] font-sans text-xs font-bold uppercase tracking-widest">
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="bg-white text-[#141414] px-6 py-2 text-xs font-bold uppercase hover:bg-[#ffd21f] hover:text-[#141414] transition-colors cursor-pointer select-none"
          style={{ borderRadius: "0px" }}
        >
          {copied ? "COPIED!" : "COPY"}
        </button>
      </div>
      <div className="bg-[#0e0e0e] text-zinc-100 p-6 font-mono text-sm leading-relaxed select-all" style={{ borderRadius: "0px" }}>
        &quot;{promptText}&quot;
      </div>
    </div>
  );
}
