import { NextResponse } from "next/server";

// Simple in-memory cache to prevent rate-limiting on high traffic
let cachedContent: any = null;
let lastFetchedTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const nocache = searchParams.get("nocache") === "true";
    const now = Date.now();
    
    // Serve cached content if it's still fresh and nocache is not requested
    if (!nocache && cachedContent && (now - lastFetchedTime < CACHE_DURATION)) {
      return NextResponse.json({
        ...cachedContent,
        cached: true,
        age: Math.round((now - lastFetchedTime) / 1000)
      });
    }

    const webappUrl = process.env.GOOGLE_SCRIPT_WEBAPP_URL;

    if (!webappUrl) {
      console.warn("GOOGLE_SCRIPT_WEBAPP_URL environment variable is missing. Serving default mock content.");
      return NextResponse.json({
        success: false,
        error: "Environment variable missing",
        settings: {},
        faqs: [],
        reviews: [],
        vault: []
      });
    }

    // Call Google Apps Script Web App with GET, bypassing cache if nocache is requested
    const fetchUrl = nocache 
      ? `${webappUrl}?action=fetchContent&t=${now}` 
      : `${webappUrl}?action=fetchContent`;
      
    const fetchOptions: RequestInit = nocache
      ? { cache: "no-store" }
      : { next: { revalidate: 3600 } }; // 1 hour — matches CACHE_DURATION and the rest of the site

    const response = await fetch(fetchUrl, {
      method: "GET",
      ...fetchOptions
    });

    if (!response.ok) {
      throw new Error(`Google Web App returned status ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      // Store in memory cache
      cachedContent = result;
      lastFetchedTime = now;
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error fetching content from Google Sheets:", error);
    
    // Serve stale cache if available as a robust fallback
    if (cachedContent) {
      console.log("Serving stale cache content as fallback.");
      return NextResponse.json({
        ...cachedContent,
        cached: true,
        stale: true
      });
    }

    // Fallback: return success false so client uses local default variables
    return NextResponse.json({
      success: false,
      error: error.message,
      settings: {},
      faqs: [],
      reviews: [],
      vault: []
    });
  }
}
