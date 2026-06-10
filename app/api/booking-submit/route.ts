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

// Helper to recursively sanitize strings inside any object or array
const sanitizeValue = (val: any): any => {
  if (typeof val === "string") {
    return sanitize(val);
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  }
  if (val !== null && typeof val === "object") {
    const res: any = {};
    for (const key of Object.keys(val)) {
      res[key] = sanitizeValue(val[key]);
    }
    return res;
  }
  return val;
};

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

  // Map fields dynamically based on presence
  const rawName = body.fullName !== undefined ? body.fullName : (body.name || "");
  const nameField = body.fullName !== undefined ? "fullName" : "name";

  const rawPhone = body.phone !== undefined ? body.phone : (body.whatsapp || "");
  const phoneField = body.phone !== undefined ? "phone" : "whatsapp";

  let rawEmail = body.email;
  // If request contains fullName but no name or email, it's a website frontend request.
  // Assign default email to bypass validation.
  if (!rawEmail && body.fullName && !body.name) {
    rawEmail = "no-email@systemsforsme.com";
  } else {
    rawEmail = rawEmail || "";
  }

  // Step 3: Validate required fields
  // Validate Name
  if (typeof rawName !== "string" || rawName.trim().length < 2 || rawName.trim().length > 100) {
    return NextResponse.json(
      { success: false, error: "Validation failed", field: nameField, message: "Name must be between 2 and 100 characters" },
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
      { success: false, error: "Validation failed", field: phoneField, message: "Invalid phone format" },
      { status: 422 }
    );
  }

  // Step 4: Sanitize all inputs recursively
  const sanitizedBody = sanitizeValue(body);

  // Apply constraints for optional fields
  if (body.businessName !== undefined) {
    if (typeof body.businessName !== "string") {
      sanitizedBody.businessName = String(body.businessName);
    }
    sanitizedBody.businessName = sanitize(sanitizedBody.businessName);
    if (sanitizedBody.businessName.length > 150) {
      sanitizedBody.businessName = sanitizedBody.businessName.substring(0, 150);
    }
  }

  if (body.description !== undefined) {
    if (typeof body.description !== "string") {
      sanitizedBody.description = String(body.description);
    }
    sanitizedBody.description = sanitize(sanitizedBody.description);
    if (sanitizedBody.description.length > 500) {
      sanitizedBody.description = sanitizedBody.description.substring(0, 500);
    }
  }

  if (body.teamSize !== undefined) {
    if (typeof body.teamSize !== "string" && typeof body.teamSize !== "number") {
      sanitizedBody.teamSize = String(body.teamSize);
    }
    if (typeof sanitizedBody.teamSize === "string") {
      sanitizedBody.teamSize = sanitize(sanitizedBody.teamSize);
    }
  }

  const sanitizedName = sanitize(rawName);
  const sanitizedPhone = sanitize(rawPhone);

  // Construct final payload to send to Google Sheets Apps Script
  const payload = {
    action: "submitBooking",
    ...sanitizedBody,
    fullName: sanitizedBody.fullName || sanitizedBody.name || sanitizedName,
    phone: sanitizedBody.phone || sanitizedBody.whatsapp || sanitizedPhone,
  };

  try {
    const webappUrl = process.env.GOOGLE_SCRIPT_WEBAPP_URL;

    if (!webappUrl) {
      console.warn("GOOGLE_SCRIPT_WEBAPP_URL environment variable is missing. Booking logged to server console:", payload);
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
    console.error("Error submitting Booking lead to Google Sheets:", error);
    // Silent fail for write/server errors: return success to frontend
    return NextResponse.json({ success: true, message: "Submission received" });
  }
}
