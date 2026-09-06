import Image from "next/image";
import Link from "next/link";
import { GOLD, INK } from "./theme";

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ig-grad" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FEDA75" />
          <stop offset="0.35" stopColor="#FA7E1E" />
          <stop offset="0.6" stopColor="#D62976" />
          <stop offset="0.8" stopColor="#962FBF" />
          <stop offset="1" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="url(#ig-grad)" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.5" stroke="url(#ig-grad)" strokeWidth="2" />
      <circle cx="17.6" cy="6.4" r="1.4" fill="url(#ig-grad)" />
    </svg>
  );
}

export default function HomeFooter() {
  return (
    <footer style={{ backgroundColor: INK }} className="text-white">
      {/* Gold bar */}
      <div className="h-2 w-full" style={{ backgroundColor: GOLD }} />

      <div className="max-w-[600px] mx-auto px-5 py-14 flex flex-col items-center text-center">
        {/* Our Services */}
        <h3 className="text-lg font-semibold">Our Services</h3>
        <ul className="mt-5 space-y-3 text-[15px] text-white/55">
          <li>
            <Link href="/bml" className="hover:text-white transition-colors">Business Maturity Level Calculator</Link>
          </li>
          <li>
            <Link href="/booking" className="hover:text-white transition-colors">Systems Strategy Session</Link>
          </li>
        </ul>

        {/* Connect with us */}
        <h3 className="mt-12 text-lg font-semibold">Connect with us</h3>
        <a
          href="https://www.instagram.com/systems_for_sme/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-3 rounded-full border border-white/25 px-6 py-3 hover:border-white/50 transition-colors"
        >
          <InstagramIcon />
          <span className="text-[15px] text-white/85">@systems_for_sme</span>
        </a>

        {/* Logo */}
        <div className="mt-16 flex flex-col items-center gap-3">
          <Image src="/logo-mark.png" alt="Systems for SME" width={64} height={64} />
          <span className="text-xl font-extrabold">Systems for SME</span>
        </div>
      </div>
    </footer>
  );
}
