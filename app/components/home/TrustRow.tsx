/* The three trust chips (icon-in-circle + label) shown on the gold CTA sections. */
export default function TrustRow() {
  const items = [
    { label: "Free Tool", icon: <span className="text-2xl font-normal leading-none">₹</span> },
    {
      label: "Takes under 30s",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2h6M12 5V2" /><circle cx="12" cy="13" r="8" /><path d="M12 10v3l2 1.5" /></svg>
      ),
    },
    {
      label: "3K+ Users",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
      ),
    },
  ];
  return (
    <div className="flex items-start justify-center gap-8 sm:gap-12">
      {items.map((it) => (
        <div key={it.label} className="flex flex-col items-center gap-2.5 text-center">
          <span className="w-14 h-14 rounded-full bg-white/50 flex items-center justify-center text-[#0E0E0E]">
            {it.icon}
          </span>
          <span className="text-sm md:text-base font-semibold text-[#0E0E0E]/85">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
