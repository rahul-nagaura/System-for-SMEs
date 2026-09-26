/* The three trust chips (icon-in-circle + label) shown on the gold CTA sections.
   Sizes follow the Figma: 40px circles, small semibold labels. */
export default function TrustRow() {
  const items = [
    { label: "Free Tool", icon: <span className="text-xl font-normal leading-none">₹</span> },
    {
      label: "Takes under 2min",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2h6M12 5V2" /><circle cx="12" cy="13" r="8" /><path d="M12 10v3l2 1.5" /></svg>
      ),
    },
    {
      label: "3K+ Users",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
      ),
    },
  ];
  return (
    <div className="flex items-start justify-center gap-8 sm:gap-12">
      {items.map((it) => (
        <div key={it.label} className="flex flex-col items-center gap-2 text-center">
          <span className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/50 flex items-center justify-center text-[#111111]">
            {it.icon}
          </span>
          <span className="text-xs md:text-sm font-semibold text-[#111111]">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
