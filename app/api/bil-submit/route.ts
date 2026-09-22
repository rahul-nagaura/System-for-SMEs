import { NextResponse } from "next/server";

/* ─────────────────────────────────────────────────────────────
   BIL Calculator V2 — lead submission endpoint
   ─────────────────────────────────────────────────────────────
   Kept separate from /api/bml-submit rather than reusing it: that
   route hard-validates the OLD score range (0-15), OLD level codes
   (L1-L5) and OLD pillar names (Operational Efficiency / Financial
   Control / Human Capital / Digital Maturity) — every new BIL
   submission would fail its validation outright, not just miss a
   sheet column. This route validates the NEW shape instead and
   forwards action: "submitBil" (vs the old "submitBml") to the same
   Apps Script webhook.

   NOTE for the Google Sheet / Apps Script side (not done in this
   change — see bml-client.tsx's summary): google_apps_script.js needs
   a handler for action "submitBil" that writes these fields to a new
   sheet tab. Until then this endpoint still returns success to the
   frontend (same silent-fail pattern as bml-submit) so the UI never
   breaks, but nothing lands in a sheet.
   ──────────────────────────────────────────────────────────── */

interface RateLimitInfo {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitInfo>();

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone: string) => /^\d{10,15}$/.test(phone.replace(/[\s\-+]/g, ""));
const sanitize = (str: string) => str.trim().replace(/<[^>]*>/g, "");

const VALID_CATEGORIES = ["A", "B", "C", "D"];
const VALID_REVENUE = ["a", "b", "c", "d", "e"];
const VALID_PILLARS = ["operationalEfficiency", "humanCapital", "customerAcquisition", "dataVisibility"];

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return NextResponse.json({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  // Rate limit: max 5 requests per 60s per IP (same policy as bml-submit).
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  const now = Date.now();
  const limitInfo = rateLimitMap.get(ip);
  if (limitInfo) {
    if (now < limitInfo.resetTime) {
      limitInfo.count += 1;
      if (limitInfo.count > 5) {
        return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const rawName = String(body.name ?? "");
  const rawBusinessName = String(body.businessName ?? "");
  const rawPhone = String(body.whatsapp ?? "");
  const rawEmail = String(body.email ?? "");
  const category = String(body.category ?? "");
  const revenueBracket = String(body.revenueBracket ?? "");
  const totalScore = Number(body.totalScore);
  const levelIndex = Number(body.levelIndex);
  const weakestPillar = String(body.weakestPillar ?? "");

  if (rawName.trim().length < 2 || rawName.trim().length > 100) {
    return NextResponse.json({ success: false, error: "Validation failed", field: "name" }, { status: 422 });
  }
  if (rawBusinessName.trim().length < 1 || rawBusinessName.trim().length > 150) {
    return NextResponse.json({ success: false, error: "Validation failed", field: "businessName" }, { status: 422 });
  }
  if (!isValidPhone(rawPhone)) {
    return NextResponse.json({ success: false, error: "Validation failed", field: "whatsapp" }, { status: 422 });
  }
  // Email is optional — only validated when provided.
  if (rawEmail.trim() && !isValidEmail(rawEmail)) {
    return NextResponse.json({ success: false, error: "Validation failed", field: "email" }, { status: 422 });
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ success: false, error: "Validation failed", field: "category" }, { status: 422 });
  }
  if (!VALID_REVENUE.includes(revenueBracket)) {
    return NextResponse.json({ success: false, error: "Validation failed", field: "revenueBracket" }, { status: 422 });
  }
  if (isNaN(totalScore) || totalScore < 0 || totalScore > 100) {
    return NextResponse.json({ success: false, error: "Validation failed", field: "totalScore" }, { status: 422 });
  }
  if (isNaN(levelIndex) || levelIndex < 1 || levelIndex > 4) {
    return NextResponse.json({ success: false, error: "Validation failed", field: "levelIndex" }, { status: 422 });
  }
  if (!VALID_PILLARS.includes(weakestPillar)) {
    return NextResponse.json({ success: false, error: "Validation failed", field: "weakestPillar" }, { status: 422 });
  }

  const payload = {
    action: "submitBil",
    ...body,
    name: sanitize(rawName),
    businessName: sanitize(rawBusinessName),
    whatsapp: sanitize(rawPhone),
    email: sanitize(rawEmail),
  };

  try {
    const webappUrl = process.env.GOOGLE_SCRIPT_WEBAPP_URL;

    if (!webappUrl) {
      console.warn("GOOGLE_SCRIPT_WEBAPP_URL environment variable is missing. BIL lead logged to server console:", payload);
      return NextResponse.json({ success: true, message: "Submission received" });
    }

    const response = await fetch(webappUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Google Web App returned status ${response.status}`);
    }

    return NextResponse.json({ success: true, message: "Submission received" });
  } catch (error: unknown) {
    console.error("Error submitting BIL lead to Google Sheets:", error);
    // Silent fail for write/server errors: return success to frontend.
    return NextResponse.json({ success: true, message: "Submission received" });
  }
}
