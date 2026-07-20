import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ConditionalLayout from "./components/ConditionalLayout";
import Nav from "./components/Nav";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Systems for SME",
  description: "Build systems. Break free from the owner trap.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-white text-[#141414]">
        <ConditionalLayout nav={<Nav />} footer={<SiteFooter />}>
          {children}
        </ConditionalLayout>
        <Analytics />
      </body>
    </html>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-[#141414] border-t-4 border-[#ffd21f] text-white py-8 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Left Info */}
        <div className="space-y-2">
          <a
            href="https://www.instagram.com/systems_for_sme/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-sm tracking-wider text-[#ffd21f] uppercase"
          >
            SYSTEMS 4 SME
          </a>
          <p className="text-zinc-400 text-xs md:text-sm font-medium">
            Empowering business owners to build self-running systems.
          </p>
        </div>

        {/* Right Links */}
        <div className="flex flex-wrap gap-x-8 gap-y-4 text-xs md:text-sm font-medium text-white">
          <Link href="/bml" className="hover:text-[#ffd21f] transition-colors">
            BML Calculator
          </Link>
          <Link href="/vault" className="hover:text-[#ffd21f] transition-colors">
            Vault
          </Link>
        </div>
      </div>
    </footer>
  );
}
