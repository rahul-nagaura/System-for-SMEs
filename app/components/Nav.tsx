"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Shared site navbar.
 *
 * Both props are optional and off by default, so pages that don't opt in
 * (e.g. /booking, /vault) render exactly as before.
 *  - showLogo:         gold logo mark + "Systems for SME" wordmark
 *  - languageSwitcher: a node (the En/Hi pill) shown beside the menu button
 */
export default function Nav({
  showLogo = false,
  languageSwitcher,
}: {
  showLogo?: boolean;
  languageSwitcher?: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 w-full z-50 bg-white h-20 flex items-center justify-between ${
        showLogo
          ? "px-3 min-[360px]:px-4 sm:px-6 md:px-12 shadow-[0_2px_14px_rgba(0,0,0,0.08)]"
          : "px-6 md:px-12 border-b border-[#d8d8d8]"
      }`}
    >
      {/* Brand */}
      {showLogo ? (
        <Link href="/" className="flex items-center gap-2 min-[360px]:gap-2.5 hover:opacity-85 transition-opacity">
          <Image
            src="/logo-mark.png"
            alt=""
            width={40}
            height={40}
            className="w-8 h-8 min-[360px]:w-9 min-[360px]:h-9 sm:w-10 sm:h-10 flex-shrink-0"
            priority
          />
          <span className="font-extrabold text-[15px] min-[360px]:text-[17px] sm:text-xl tracking-tight text-[#080808]">
            Systems for SME
          </span>
        </Link>
      ) : (
        <Link
          href="/"
          className="font-black text-lg md:text-xl tracking-tight text-[#080808] hover:opacity-85 transition-opacity"
        >
          SYSTEMS FOR SME
        </Link>
      )}

      {/* Desktop Links */}
      <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-[#080808]">
        <Link href="/vault" className="hover:text-[#ffd21f] transition-colors">
          Vault
        </Link>
        <Link href="/bml" className="hover:text-[#ffd21f] transition-colors">
          BML Calculator
        </Link>
      </nav>

      {/* Right side: language switcher (optional) + CTA / menu button */}
      <div className="flex items-center gap-1 min-[360px]:gap-2 sm:gap-3">
        {languageSwitcher}

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
            {showLogo ? (
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {isOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            ) : isOpen ? (
              "✕"
            ) : (
              "☰"
            )}
          </button>
        </div>
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
