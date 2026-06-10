"use client";

interface CustomToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function CustomToggle({ label, checked, onChange }: CustomToggleProps) {
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-[#141414] border border-zinc-800 hover:border-zinc-700 transition-colors">
      <span className="text-[11px] font-bold text-white uppercase tracking-wide">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-8 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 focus:outline-none ${
          checked ? 'bg-[#FCD12A]' : 'bg-zinc-800'
        }`}
      >
        <div
          className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            checked ? 'translate-x-3' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
