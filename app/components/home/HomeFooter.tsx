import Image from "next/image";
import Link from "next/link";
import { GOLD, INK } from "./theme";

export default function HomeFooter() {
  return (
    <footer style={{ backgroundColor: INK }} className="text-white py-14 px-5">
      <div className="max-w-[1200px] mx-auto grid sm:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2">
            <Image src="/logo-mark.png" alt="Systems for SME" width={30} height={30} />
            <span className="font-extrabold">Systems for SME</span>
          </div>
          <p className="mt-3 text-sm text-white/60 max-w-xs">
            Building self-running systems for Indian SMEs &amp; family businesses.
          </p>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Our Services</div>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/bml" className="hover:text-white transition-colors">BML Diagnostic</Link></li>
            <li><Link href="/booking" className="hover:text-white transition-colors">Systems Strategy Session</Link></li>
            <li><Link href="/vault" className="hover:text-white transition-colors">The Vault (free resources)</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Connect with us</div>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/systems_for_sme/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" style={{ color: GOLD }}>Instagram</a>
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto mt-10 pt-6 border-t border-white/10 text-xs text-white/40">
        © {new Date().getFullYear()} Systems for SME. All rights reserved.
      </div>
    </footer>
  );
}
