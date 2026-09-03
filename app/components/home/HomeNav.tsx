"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BmlButton from "./BmlButton";

export default function HomeNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-[#0E0E0E] border-b border-white/10">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-5 h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo-mark.png" alt="Systems for SME" width={38} height={38} />
          <span className="font-extrabold text-lg tracking-tight text-white">Systems for SME</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-white">
          <a href="#what-we-do" className="hover:text-[#FDC521] transition-colors">What we do</a>
          <a href="#how" className="hover:text-[#FDC521] transition-colors">How it works</a>
          <a href="#about" className="hover:text-[#FDC521] transition-colors">About</a>
        </nav>
        <button
          className="md:hidden text-2xl font-bold p-2 text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0E0E0E] px-5 py-4 flex flex-col gap-4 text-sm font-bold uppercase tracking-wider text-white">
          <a href="#what-we-do" onClick={() => setMenuOpen(false)}>What we do</a>
          <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <BmlButton variant="gold" className="justify-center mt-1" />
        </div>
      )}
    </header>
  );
}
