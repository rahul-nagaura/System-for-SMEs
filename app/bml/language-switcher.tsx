"use client";

/* ─────────────────────────────────────────────────────────────
   BML Calculator — language toggle (pill in the navbar + hook)
   ─────────────────────────────────────────────────────────────
   useBmlLanguage()  → [lang, setLang]. The choice is remembered in
                       localStorage so it survives a refresh / coming
                       back to the page. Server render + first client
                       render are always "en", so there is no hydration
                       mismatch; the saved choice is applied right after.
   LanguageSwitcher  → the globe + "En" / "Hi" pill. It is a plain
                       toggle: one tap flips the language, no menu or
                       popup. The label always shows the CURRENT language.

   Related modules:
     - bml-i18n.ts  → Lang type + LANGS list + all the translated text
     - bml-client.tsx → owns the page and passes the pill into <Nav />
   ──────────────────────────────────────────────────────────── */

import { useSyncExternalStore } from "react";
import { LANGS, type Lang } from "./bml-i18n";

const STORAGE_KEY = "bml-language";

/* ── Tiny external store for the language ───────────────────── */

let current: Lang | null = null; // in-memory copy (works even if storage is blocked)
const listeners = new Set<() => void>();

function readLang(): Lang {
  if (current === null) {
    try {
      current = window.localStorage.getItem(STORAGE_KEY) === "hinglish" ? "hinglish" : "en";
    } catch {
      current = "en"; // storage unavailable (private mode etc.) — default to English
    }
  }
  return current;
}

function writeLang(next: Lang): void {
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* storage unavailable — the in-memory value still switches the page */
  }
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void): () => void {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}

const getServerLang = (): Lang => "en";

/** Current language + a setter. Safe on server and client. */
export function useBmlLanguage(): [Lang, (next: Lang) => void] {
  const lang = useSyncExternalStore(subscribe, readLang, getServerLang);
  return [lang, writeLang];
}

/* ── The pill ───────────────────────────────────────────────── */

function GlobeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#EDB605"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="M2.5 12h19" />
      <path d="M12 2.5c2.6 2.6 4 5.8 4 9.5s-1.4 6.9-4 9.5c-2.6-2.6-4-5.8-4-9.5s1.4-6.9 4-9.5z" />
    </svg>
  );
}

export function LanguageSwitcher({
  lang,
  onChange,
  label,
}: {
  lang: Lang;
  onChange: (next: Lang) => void;
  /** Accessible name for the button (already translated). */
  label: string;
}) {
  const index = Math.max(0, LANGS.findIndex((l) => l.id === lang));
  const active = LANGS[index];
  const next = LANGS[(index + 1) % LANGS.length];

  return (
    <button
      type="button"
      onClick={() => onChange(next.id)}
      aria-label={`${label} (${active.label})`}
      title={next.label}
      className="flex items-center gap-1.5 rounded-full border border-[#d8d8d8] bg-white pl-2.5 pr-3 py-1.5 text-sm font-medium text-[#080808] hover:border-[#080808]/40 active:scale-95 transition-all"
    >
      <GlobeIcon />
      <span>{active.short}</span>
    </button>
  );
}
