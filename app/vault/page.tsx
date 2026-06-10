import type { Metadata } from "next";
import VaultPageClient from "./vault-client";

export const metadata: Metadata = {
  title: "The Vault — Free Systems, Guides & SOPs | Systems for SME",
  description: "Free guides, SOP templates, delegation checklists, and AI prompts for Indian SME owners and family business heirs ready to build systems.",
};

export const revalidate = 3600;

export default async function VaultPage() {
  let content = {
    settings: {},
    faqs: [],
    reviews: [],
    vault: []
  };

  const webappUrl = process.env.GOOGLE_SCRIPT_WEBAPP_URL;
  if (webappUrl) {
    try {
      const res = await fetch(`${webappUrl}?action=fetchContent`, {
        next: { revalidate: 60 }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          content = data;
        }
      }
    } catch (err) {
      console.error("Vault page server-side fetch failed:", err);
    }
  }

  return <VaultPageClient content={content} />;
}
