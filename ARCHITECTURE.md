# Architecture & Data Flow

This document describes the high-level design, data flow, and components of the **Systems for SME** website.

---

## 1. User Journey Flow

The user flows through the site in a sequential marketing and onboarding funnel:

```text
  [ Landing Page (/) ]
         │
         ▼
  [ BML Quiz steps 0 to 5 (/bml) ]
         │
         ▼
  [ Lead Capture Form (Step 6) ] ────► (Submits to /api/bml-submit)
         │
         ▼
  [ Results Page (Step 7) ]
         │
         ▼
  [ Onboarding Booking Form (/booking) ] ──► (Submits to /api/booking-submit)
         │
         ▼
  [ Confirmation Screen ]
```

1. **Landing Page (`/`)**: Introduces Systems for SME, showcasing reviews, FAQs, pricing, and the core diagnostic offering.
2. **BML Calculator (`/bml`)**: A 5-minute interactive quiz analyzing business dependence on the owner across 4 key dimensions (Operations, Finance, Human Capital, Digital).
3. **Lead Capture (Step 6)**: Secures user contact details before showing results.
4. **Results (Step 7)**: Displays BML score, maturity rung (L1-L5), weakest dimension (forced lowest), cost stagnation calculations, and downloadable Brutalist cards.
5. **Booking Form (`/booking`)**: A quick 2-minute questionnaire preparing the user for a 1-on-1 Systems Strategy Session.

---

## 2. Dynamic Content Flow (Reads)

Content configured by the business owner (pricing values, Raghav's portrait URL, FAQs, and Vault guides) is loaded dynamically from Google Sheets:

```text
[ Google Sheet ] ──► [ Apps Script (fetchContent) ] ──► [ Next.js Server (/api/content-feed) ] ──► [ Pages ]
```

* **Caching Strategy**: To keep page loads instantaneous and bypass Google rate limits, content is cached in-memory on the Next.js server.
* **Busting the Cache**: You can bypass the cache and fetch fresh values from the spreadsheet immediately by appending `?nocache=true` to the request (e.g. `http://localhost:3000/api/content-feed?nocache=true`). In development mode (`NODE_ENV === "development"`), the cache duration is set to 0 seconds, so pages always load fresh sheet content.

---

## 3. Submission Data Flow (Writes)

Form submission data flows through server-side validation layers before ever reaching the spreadsheet:

```text
  [ User Form Submit ]
           │
           ▼
  [ Next.js API Submit Route ]
           ├── 1. POST Method Validation
           ├── 2. Safe JSON Body Parsing
           ├── 3. In-Memory Rate Limiting (max 5 requests per 60s per IP)
           ├── 4. Field Type, Format & Range Validation (Returns 422 on error)
           └── 5. HTML Tag Stripping and Trim Sanitization
           │
           ▼
  [ Google Apps Script POST Web App ]
           │
           ▼
  [ Google Sheet (Leads/Results Tab) ]
```

* **Validation Rules**:
  * **BML Lead Form**: Checks `name` (2-100 chars), `email` (regex valid), `phone` (10-15 digits), `score` (0-15), `level` (L1-L5), and `biggest_gap`.
  * **Booking Onboarding Form**: Checks `name`/`fullName` (2-100 chars), `phone` (10-15 digits), and `email`. If from the frontend, email is automatically bypassed and assigned `no-email@systemsforsme.com`.
  * **Sanitization**: Strips any HTML tags (e.g. `<script>` tags) to prevent scripting injections, and trims surrounding whitespaces.
* **Silent Outage Fallback**: If the fetch to Google Apps Script fails, the Next.js server logs the error locally but returns a success status (`200 OK`) with `{ success: true }` to the client. This guarantees that user onboarding is **never blocked** by Google service outages.

---

## 4. Server vs. Client Components

We use Next.js's dual component model to maximize SEO crawling indexability while supporting rich UI interactions:

| Page Route | Component Type | Reason |
| :--- | :--- | :--- |
| **Landing Page (`/`)** | Server Wrapper + Client Content | Page wrapper (`page.tsx`) runs on the server to fetch pricing, reviews, and FAQs, eliminating layout shift. Client component (`home-client.tsx`) manages navigation and toggle state. |
| **BML Page (`/bml`)** | Server Wrapper + Client Content | Server wrapper exports custom SEO metadata. Client component (`bml-client.tsx`) manages complex step transitions, quiz answers, SVG ring rendering, and Canvas image downloading. |
| **Booking Page (`/booking`)** | Server Wrapper + Client Content | Server wrapper exports custom SEO metadata. Client component (`booking-client.tsx`) manages multi-section onboarding form fields and submission state. |
| **Vault Page (`/vault`)** | Server Wrapper + Client Content | Server wrapper fetches vault list directly from sheets with ISR. Client component (`vault-client.tsx`) handles tag filters, pagination limits, and "Show More" expansion. |
| **Vault Article (`/vault/[slug]`)** | Server Component | Fetches article content on the server and renders static HTML immediately for maximum SEO crawler visibility. |

---

## 5. Environment Config Reference

* **`GOOGLE_SCRIPT_WEBAPP_URL`**: Used by `/api/content-feed`, `/api/bml-submit`, `/api/booking-submit`, and `/vault/[slug]/page.tsx` on the Next.js server side to connect with the Google Sheets Apps Script.
