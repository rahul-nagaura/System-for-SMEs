# Systems for SME Website & BML Calculator

Welcome to the **Systems for SME** project repository. This is a high-performance, responsive web application designed for small and medium enterprise (SME) owners. It includes an interactive **Business Maturity Level (BML) Calculator**, an **Onboarding Booking Flow**, and a curated **Vault** of resources, templates, and AI prompts.

The site is built with dynamic server-side data fetching directly integrated with Google Sheets as a lightweight headless CMS.

---

## Tech Stack

This project is built using modern, stable, and high-performance technologies:
1. **Frontend Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
2. **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict static typing)
3. **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Utility-first styling) and standard CSS variables
4. **Database & CMS**: [Google Sheets](https://www.google.com/sheets/about/) acting as a database, connected securely using a Google Apps Script Web App API
5. **Hosting & Deployment**: [Vercel](https://vercel.com/) (Serverless edge deployment)

---

## Quick Start (Local Development)

Follow these steps to get the project running locally on your computer:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher recommended) and `npm` installed.

### Step 1: Clone or Navigate to the Directory
Open your terminal and make sure you are in the `website/` directory (where `package.json` resides):
```bash
cd website
```

### Step 2: Install Dependencies
Install all required package dependencies:
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a file named `.env.local` in the root of the `website/` directory:
```env
GOOGLE_SCRIPT_WEBAPP_URL=https://script.google.com/macros/s/YOUR_DEPLOID_APPS_SCRIPT_ID/exec
```
*(Replace `YOUR_DEPLOID_APPS_SCRIPT_ID` with your actual Google Apps Script Web App deployment URL. See `GOOGLE_SHEET_SETUP.md` for a guide on how to set this up.)*

### Step 4: Run Development Server
Start the Next.js development server:
```bash
npm run dev
```

### Step 5: Open the Application
Open your browser and navigate to:
[http://localhost:3000](http://localhost:3000)

The pages will load immediately, pulling dynamic content and FAQs directly from your Google Sheet (or falling back to hardcoded default values if the Sheets environment variable is missing or unreachable).

---

## Environment Variables

The project uses one core environment variable for all dynamic database operations:

| Variable Name | Purpose | Example Value |
| :--- | :--- | :--- |
| `GOOGLE_SCRIPT_WEBAPP_URL` | The secure API endpoint pointing to your deployed Google Apps Script. It handles both database reads (CMS content feed) and writes (lead and booking submissions). | `https://script.google.com/macros/s/AKfycb.../exec` |

---

## Folder Structure

Here is an overview of the key folders and files in this codebase:

```text
website/
├── app/                      # Next.js App Router root folder
│   ├── api/                  # Server-side API endpoints
│   │   ├── bml-submit/       # Handles BML lead submissions & validation
│   │   ├── booking-submit/   # Handles booking onboarding submissions & validation
│   │   └── content-feed/     # Fetches & caches CMS content from Google Sheets
│   ├── bml/                  # BML Calculator route & levels configuration
│   ├── booking/              # Onboarding Booking page route
│   ├── components/           # Shared UI components (Navbars, Toggles, Copyboxes)
│   ├── vault/                # Vault page and dynamic articles/prompt routes
│   ├── globals.css           # Global stylesheets, Tailwind configuration, & themes
│   ├── layout.tsx            # Global layout shell and metadata definitions
│   └── page.tsx              # Landing page wrapper (fetches data on the server)
├── public/                   # Static media assets (optimized pictures, icons)
├── scratch/                  # Test scripts and temporary developer tools
├── README.md                 # This file (Project instructions)
├── ARCHITECTURE.md           # End-to-end data flow and architectural design
├── GOOGLE_SHEET_SETUP.md     # Step-by-step Google Sheet setup and script template
├── tsconfig.json             # TypeScript compiler settings
└── package.json              # Project dependencies and script shortcuts
```

---

## How the Google Sheets Connection Works

Instead of hosting an expensive SQL database, this application uses **Google Sheets** as a database:
1. **Reads (Content Feed)**: When a user visits the homepage or the Vault, Next.js calls our `/api/content-feed` API route. This route sends a secure `GET` request to your Google Apps Script Web App. The script reads your Google Sheet tabs (`GlobalSettings`, `FAQs`, `Vault`) and returns them as a clean JSON payload.
2. **Writes (Form Submissions)**: When a user submits a form (e.g. the BML calculator or booking form), our API routes perform strict validation checks (regex formats, lengths, rate limiting) and sanitize the input. If the validation passes, the server sends a secure `POST` request to the Apps Script, which immediately appends the lead as a new row in the `Leads` or `Results` tab.

To optimize load times and prevent API limits, the read feeds are wrapped in an in-memory cache that updates every 10 minutes in production (or instantly on requests containing the `?nocache=true` parameter).

---

## Deploying to Vercel

To host this website live in production, Vercel is recommended:

### Step 1: Install Vercel CLI (or connect Git)
You can connect your GitHub repository directly in the [Vercel Dashboard](https://vercel.com) for automatic deployments on push, or run via the terminal:
```bash
npx vercel
```

### Step 2: Configure Project settings
Follow the command prompts to log in (if not already logged in), select your team, link the directory, and accept default build settings.

### Step 3: Add the Environment Variable
Set the environment variable using the Vercel CLI:
```bash
"https://script.google.com/macros/s/YOUR_DEPLOID_APPS_SCRIPT_ID/exec" | npx vercel env add GOOGLE_SCRIPT_WEBAPP_URL production
```
*(Alternatively, log in to the Vercel Web Dashboard, navigate to **Project Settings > Environment Variables**, and add `GOOGLE_SCRIPT_WEBAPP_URL` manually).*

### Step 4: Promote to Production
Trigger a production build to activate the environment variable:
```bash
npx vercel --prod
```
Vercel will output a live URL (e.g., `https://your-project.vercel.app`) representing your live production build.

---

## Common Issues & Troubleshooting

### 1. "Environment variable missing" error on build or load
* **Cause**: Your Next.js app doesn't have the `GOOGLE_SCRIPT_WEBAPP_URL` configured in its environment.
* **Fix**: Create a `.env.local` file locally containing the key, or configure it in your Vercel Project dashboard, and restart the dev server or trigger a rebuild.

### 2. Form submits return successfully but no rows appear in Google Sheet
* **Cause**: The Google Apps Script is not deployed with public access, or tab names in the sheet do not match exactly.
* **Fix**: Ensure your Apps Script Web App is deployed as **Execute as: Me** and **Who has access: Anyone** (not "Only myself"). Ensure your spreadsheet has tabs named exactly `Leads` and `Results`.

### 3. API returns 429 status code
* **Cause**: The built-in rate-limiting protection is triggering. You are making more than 5 submissions from the same IP address within a 60-second window.
* **Fix**: Wait 60 seconds for the rate limiter window to reset.
