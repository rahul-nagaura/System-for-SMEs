import { NextResponse } from "next/server";

// Rate limiting map
interface RateLimitInfo {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitInfo>();

const isValidEmail = (email: string) => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone: string) => 
  /^\d{10,15}$/.test(phone.replace(/[\s\-\+]/g, ""));

const sanitize = (str: string) => 
  str.trim().replace(/<[^>]*>/g, "");

export async function POST(request: Request) {
  // Step 1: Check request method
  if (request.method !== "POST") {
    return NextResponse.json(
      { success: false, error: "Method not allowed" },
      { status: 405 }
    );
  }

  // Step 7: Rate limit basic protection (max 5 requests in 60s)
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  const now = Date.now();
  const limitInfo = rateLimitMap.get(ip);
  if (limitInfo) {
    if (now < limitInfo.resetTime) {
      limitInfo.count += 1;
      if (limitInfo.count > 5) {
        return NextResponse.json(
          { success: false, error: "Too many requests" },
          { status: 429 }
        );
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
  }

  // Step 2: Parse body safely
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // Map fields from both frontend and test request formats
  const rawName = body.name || body.fullName || "";
  const rawEmail = body.email || "";
  const rawPhone = body.phone || body.whatsapp || "";
  
  let rawScore = body.score;
  if (rawScore === undefined && body.averagePercentage !== undefined) {
    rawScore = Math.round((Number(body.averagePercentage) / 100) * 15);
  }
  
  let rawLevel = body.level || "";
  if (!rawLevel && body.currentLevel) {
    const match = String(body.currentLevel).match(/Level\s*(\d)/i);
    rawLevel = match ? `L${match[1]}` : "";
  }
  
  const rawBiggestGap = body.biggest_gap || body.weakestDim || "";

  // Step 3: Validate required fields
  // Validate Name
  if (typeof rawName !== "string" || rawName.trim().length < 2 || rawName.trim().length > 100) {
    return NextResponse.json(
      { success: false, error: "Validation failed", field: "name", message: "Name must be between 2 and 100 characters" },
      { status: 422 }
    );
  }

  // Validate Email
  if (typeof rawEmail !== "string" || !isValidEmail(rawEmail)) {
    return NextResponse.json(
      { success: false, error: "Validation failed", field: "email", message: "Invalid email format" },
      { status: 422 }
    );
  }

  // Validate Phone
  if (typeof rawPhone !== "string" || !isValidPhone(rawPhone)) {
    return NextResponse.json(
      { success: false, error: "Validation failed", field: "phone", message: "Invalid phone format" },
      { status: 422 }
    );
  }

  // Validate Score
  const scoreNum = Number(rawScore);
  if (rawScore === undefined || isNaN(scoreNum) || scoreNum < 0 || scoreNum > 15) {
    return NextResponse.json(
      { success: false, error: "Validation failed", field: "score", message: "Score must be between 0 and 15" },
      { status: 422 }
    );
  }

  // Validate Level
  if (typeof rawLevel !== "string" || !["L1", "L2", "L3", "L4", "L5"].includes(rawLevel)) {
    return NextResponse.json(
      { success: false, error: "Validation failed", field: "level", message: "Level must be one of: L1, L2, L3, L4, L5" },
      { status: 422 }
    );
  }

  // Validate Biggest Gap
  if (typeof rawBiggestGap !== "string" || !["Operational Efficiency", "Financial Control", "Human Capital", "Digital Maturity"].includes(rawBiggestGap)) {
    return NextResponse.json(
      { success: false, error: "Validation failed", field: "biggest_gap", message: "Invalid biggest gap value" },
      { status: 422 }
    );
  }

  // Step 4: Sanitize string inputs before forwarding
  const sanitizedName = sanitize(rawName);
  const sanitizedEmail = sanitize(rawEmail);
  const sanitizedPhone = sanitize(rawPhone);
  const sanitizedLevel = sanitize(rawLevel);
  const sanitizedBiggestGap = sanitize(rawBiggestGap);

  // Sanitize optional dimensions if present
  let sanitizedOps = body.operations;
  let sanitizedFin = body.finance;
  let sanitizedHum = body.human;
  let sanitizedDig = body.digital;

  if (sanitizedOps !== undefined && (typeof sanitizedOps !== "number" || sanitizedOps < 0 || sanitizedOps > 100)) {
    sanitizedOps = undefined;
  }
  if (sanitizedFin !== undefined && (typeof sanitizedFin !== "number" || sanitizedFin < 0 || sanitizedFin > 100)) {
    sanitizedFin = undefined;
  }
  if (sanitizedHum !== undefined && (typeof sanitizedHum !== "number" || sanitizedHum < 0 || sanitizedHum > 100)) {
    sanitizedHum = undefined;
  }
  if (sanitizedDig !== undefined && (typeof sanitizedDig !== "number" || sanitizedDig < 0 || sanitizedDig > 100)) {
    sanitizedDig = undefined;
  }

  // Construct final payload to send to Google Sheets Apps Script
  const payload = {
    action: "submitBml",
    ...body,
    name: sanitizedName,
    email: sanitizedEmail,
    whatsapp: sanitizedPhone,
    averagePercentage: body.averagePercentage !== undefined ? body.averagePercentage : Math.round((scoreNum / 15) * 100),
    currentLevel: body.currentLevel || `Level ${sanitizedLevel.substring(1)} - ${sanitizedLevel}`,
    weakestDim: sanitizedBiggestGap,
    operations: sanitizedOps,
    finance: sanitizedFin,
    human: sanitizedHum,
    digital: sanitizedDig
  };

  try {
    const webappUrl = process.env.GOOGLE_SCRIPT_WEBAPP_URL;

    if (!webappUrl) {
      console.warn("GOOGLE_SCRIPT_WEBAPP_URL environment variable is missing. BML lead logged to server console:", payload);
      return NextResponse.json({ success: true, message: "Submission received" });
    }

    const response = await fetch(webappUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Google Web App returned status ${response.status}`);
    }

    return NextResponse.json({ success: true, message: "Submission received" });

  } catch (error: any) {
    console.error("Error submitting BML lead to Google Sheets:", error);
    // Silent fail for write/server errors: return success to frontend
    return NextResponse.json({ success: true, message: "Submission received" });
  }
}
