"use client";
import { useState } from "react";

export default function CopyPrompt({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="border-2 border-black bg-[#141414] text-zinc-100 p-6 md:p-8 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#edb605] animate-pulse"></span>
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">PROMPT TEMPLATE</span>
        </div>
        <button
          onClick={handleCopy}
          className="bg-[#edb605] text-[#201b11] px-5 py-2 text-xs font-bold uppercase hover:bg-[#e2b900] active:scale-95 transition-all select-none border-2 border-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          {copied ? "COPIED!" : "COPY PROMPT"}
        </button>
      </div>
      <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap select-all max-h-[350px] overflow-y-auto custom-scrollbar bg-black p-6 border-2 border-black">
        {text}
      </div>
      <div className="flex justify-center pt-2">
        <button
          onClick={handleCopy}
          className="w-full bg-[#edb605] text-[#201b11] font-bold py-4 px-8 border-2 border-black hover:bg-[#e2b900] active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <span className="material-symbols-outlined text-lg">content_copy</span>
          {copied ? "Prompt Copied! Paste in ChatGPT/Claude" : "Copy Prompt to Clipboard"}
        </button>
      </div>
    </div>
  );
}
