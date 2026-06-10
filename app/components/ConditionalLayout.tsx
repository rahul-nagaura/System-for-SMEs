"use client";

import { usePathname } from "next/navigation";

export default function ConditionalLayout({
  children,
  nav,
  footer,
}: {
  children: React.ReactNode;
  nav: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();

  // Standalone pages that define their own headers/footers
  const isStandalone =
    pathname === "/bml" ||
    pathname === "/booking" ||
    (pathname.startsWith("/vault/") && pathname !== "/vault");

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <>
      {nav}
      <main className="pt-20">{children}</main>
      {footer}
    </>
  );
}
