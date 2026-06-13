"use client";
import { useState } from "react";
import Link from "next/link";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-[#d8d8d8] h-20 flex items-center justify-between px-6 md:px-12">
      {/* Brand */}
      <Link
        href="/"
        className="font-black text-lg md:text-xl tracking-tight text-[#080808] hover:opacity-85 transition-opacity"
      >
        SYSTEMS FOR SME
      </Link>

      {/* Desktop Links */}
      <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-[#080808]">
        <Link href="/vault" className="hover:text-[#ffd21f] transition-colors">
          Vault
        </Link>
        <Link href="/bml" className="hover:text-[#ffd21f] transition-colors">
          BML Calculator
        </Link>
      </nav>

      {/* Desktop CTA Button */}
      <div className="hidden md:block">
        <Link
          href="/booking"
          prefetch={true}
          className="bg-[#ffd21f] text-[#080808] py-3 px-6 text-xs font-extrabold uppercase hover:bg-[#e2b900] active:scale-95 transition-all shadow-sm border border-[#e2b900]/10 flex items-center justify-center"
          style={{ borderRadius: "0px" }}
        >
          BOOK YOUR SESSION
        </Link>
      </div>

      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[#080808] focus:outline-none flex items-center justify-center p-2 text-2xl font-bold"
          aria-label="Toggle menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-[#d8d8d8] py-6 px-6 flex flex-col gap-5 shadow-lg z-50 animate-in slide-in-from-top-4 duration-200">
          <Link
            onClick={() => setIsOpen(false)}
            className="text-[#080808] hover:text-[#ffd21f] font-bold text-sm uppercase tracking-wider py-2 border-b border-zinc-100"
            href="/vault"
          >
            Vault
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            className="text-[#080808] hover:text-[#ffd21f] font-bold text-sm uppercase tracking-wider py-2 border-b border-zinc-100"
            href="/bml"
          >
            BML Calculator
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            className="bg-[#ffd21f] text-[#080808] py-4 px-6 text-xs font-extrabold uppercase hover:bg-[#e2b900] active:scale-95 transition-all text-center w-full block border border-[#e2b900]/10 font-bold"
            href="/booking"
            prefetch={true}
          >
            BOOK YOUR SESSION
          </Link>
        </div>
      )}
    </header>
  );
}
