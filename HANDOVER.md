# Developer Handover — Recent Changes

This document is the **starting point for a developer new to this codebase**. It explains
(1) what to read first, (2) every change made in the most recent round of work — *previous
behavior → new behavior* — and (3) the manual steps still pending.

> **To see the exact line-by-line "before vs after" code**, the changes in this round are
> **uncommitted in the working tree**. The "previous code" is the last git commit (`HEAD`).
> Run:
> ```bash
> git diff HEAD                      # all changes
> git diff HEAD -- app/bml/bml-client.tsx   # one file
> git stash list / git stash show   # if changes were stashed
> ```

---

## 1. Read these first (current state of the system)

| Order | File | What it explains |
| :--- | :--- | :--- |
| 1 | [README.md](README.md) | Project overview, tech stack, local dev, env vars, folder structure. |
| 2 | [ARCHITECTURE.md](ARCHITECTURE.md) | Data flow (reads/writes), caching, server vs client components, **and §6: the BML file structure**. |
| 3 | [GOOGLE_SHEETS_SOP.md](GOOGLE_SHEETS_SOP.md) | The exact Google Sheet tab/column schema (the database). |
| 4 | [GOOGLE_SHEET_SETUP.md](GOOGLE_SHEET_SETUP.md) | How to set up the sheet + Apps Script from scratch. |
| 5 | [google_apps_script.js](google_apps_script.js) | The Apps Script Web App that reads/writes the sheet. |
| 6 | **This file** | What changed in the latest round and why. |

The data backend is **Google Sheets via an Apps Script Web App** (no SQL DB). One env var wires
it up: `GOOGLE_SCRIPT_WEBAPP_URL`. The site degrades gracefully to hardcoded defaults if it's
missing.

---

## 2. Files changed this round

**New files (the BML feature was split out of one giant file):**
- `app/bml/bml-data.ts` — static quiz/UI data (questions, options, themes, levels, result copy).
- `app/bml/bml-scoring.ts` — pure scoring math (`computeDimensions`, ring geometry, band colors).
- `app/bml/bml-card.ts` — the downloadable PNG result card (Canvas).

**Modified files:**
- `app/bml/bml-client.tsx`, `app/booking/booking-client.tsx`, `app/vault/vault-client.tsx`
- `app/components/Nav.tsx`, `app/layout.tsx`, `app/globals.css`
- `app/page.tsx`, `app/vault/page.tsx`, `app/vault/[slug]/page.tsx`
- `app/api/bml-submit/route.ts`, `app/api/content-feed/route.ts`
- `google_apps_script.js`
- Docs: `README.md`, `ARCHITECTURE.md`, `GOOGLE_SHEETS_SOP.md`, `GOOGLE_SHEET_SETUP.md`

**Now orphaned (no longer imported):** `app/components/BookingNav.tsx` — safe to delete.

---

## 3. Changes by area (previous → new)

### A. Unified caching to 1-hour revalidation
Server-side reads from Google Sheets used **inconsistent** revalidation (some `60s`, some `600s`).
Because Next.js uses the *lowest* `revalidate` on a route, pages were effectively refreshing every
60s instead of the intended interval.
- **Now:** every read uses **`revalidate: 3600` (1 hour)** — `app/page.tsx`, `app/vault/page.tsx`,
  `app/vault/[slug]/page.tsx`, and `app/api/content-feed/route.ts` (whose in-memory cache was
  already 1 hour).

### B. BML Calculator split into focused files
`app/bml/bml-client.tsx` was a single ~1,540-line file mixing data, scoring, Canvas rendering, and
UI.
- **Now:** data → `bml-data.ts`, math → `bml-scoring.ts`, Canvas card → `bml-card.ts`; the client
  file holds only React state + JSX. Behavior is unchanged. Dead code removed (`totalScore`,
  `gapMappings`, `ringColor`). See **ARCHITECTURE.md §6** for the structure + diagram.

### C. BML lead-capture form expanded
- **Pain point question** was **single-select** → now **multi-select** (checkboxes, "select all
  that apply"). Scoring (`computeDimensions` in `bml-scoring.ts`) now takes an array: every selected
  problem forces its dimension down, and the **lowest** becomes the highlighted "weakest gap".
- **Four new required fields** added to the final step (`bml-client.tsx`): **Type of Business**,
  **Explain your business in brief**, **City/State**, **Are you ready to invest**.
- **Phone is now required** (was labeled optional, though the server already required it).
- Forwarded + sanitized in `app/api/bml-submit/route.ts`; written to the sheet by
  `google_apps_script.js`.
- **Sheet impact:** `Leads` tab went from **20 → 24 columns** (added Type of Business, Business
  Description, City/State, Investment Readiness).

### D. Booking form: revenue + call-slot booking + WhatsApp handoff
- Added a **monthly revenue** question (same options as the BML quiz, imported from `bml-data.ts`).
- Added **"05. Book Your Slot"**: a **date picker** (next 7 days, auto-generated in IST so past days
  never show) + **3 time slots** (2–3 PM, 10–11 PM, 11 PM–12 AM).
- **On submit:** the form (incl. date + slot) saves to the `Results` sheet, then the user is
  **redirected to WhatsApp** via a `wa.me` link with a **pre-filled message** that includes the
  chosen date + slot ("…please share the payment link…"). A confirmation screen with a "Continue on
  WhatsApp" button is the desktop fallback. Number is in `WHATSAPP_NUMBER` in `booking-client.tsx`.
- **Double-booking** is intentionally handled manually (slots are labels, not live availability);
  Raghav confirms + takes payment, first-to-pay wins. See the discussion in git history if needed.
- **Sheet impact:** `Results` tab went from **11 → 14 columns** (added Monthly Revenue, Preferred
  Date, Preferred Time Slot).

### E. Navigation unified
- The main `Nav` (`app/components/Nav.tsx`) is now used on **every** page, including BML and booking
  (which previously used a separate `BookingNav`).
- **Nav right side:** previously Process / Value / Vault / FAQ → **now Vault · BML Calculator ·
  Book Your Session**.
- **Footers (right side):** previously Privacy / Terms / Vault → **now BML Calculator · Vault**
  (both the global footer in `layout.tsx` and the booking page's own footer).

### F. UI / styling tweaks
- Footer height reduced (`py-12` → `py-8`) — `layout.tsx`, `booking-client.tsx`.
- BML **results page** mobile order changed to **Left → Right → Book button** (was Left → Button →
  Right); desktop unchanged.
- Reduced the large empty gap at the bottom of the BML results/lead-capture screens.
- Vault page: moved the **"Start Here: BML Calculator"** CTA section to sit **below** the resource
  list.
- Vault closing CTA ("Confused kahan se shuru karu?") font size increased; **hero is now bold on
  mobile** — fixed a missing CSS utility (`font-display-xl-mobile`) added in `globals.css`.
- Vault closing CTA button (now text **"System Kaise Banayein, Dekho →"**) redirect changed from `/bml` to `/` to direct users back to the landing page.
- BML Calculator results page CTA button (now text **"GET YOUR CUSTOM SYSTEMS ROADMAP →"**) redirect changed from `/booking` to `/` to direct users back to the landing page, and updated the subtext below it to reflect a paid session.
- Removed the redundant **AI Prompt Kit** card from the **Vault ke andar kya hai** resource library section (since the full interactive Prompt section already lives at the top of the Vault page).

### G. Documentation reconciled with the code
The docs had drifted from the actual code. Fixed in `GOOGLE_SHEETS_SOP.md` /
`GOOGLE_SHEET_SETUP.md`:
- The non-existent **"Questions" tab** → corrected to the real **"Reviews"** tab. (Quiz questions
  are hardcoded in `bml-data.ts`, **not** in the sheet.)
- `Leads` and `Results` column lists corrected to match what the code actually writes (now 24 and
  14 columns respectively).
- `biggest_gap`/Weakest System allowed values corrected to the long forms (`Operational Efficiency`,
  etc.).
- Removed the unused `session_price_label`; fixed the `pricing` → `pricing_amount` key.

---

## 4. ⚠️ Pending manual steps (the site won't capture new fields until these are done)

These are **outside the code** — they must be done in the Google Sheet / Apps Script:

1. **Redeploy the Apps Script:** open the sheet → Extensions → Apps Script, paste the latest
   `google_apps_script.js`, Save → **Deploy → Manage deployments → Edit → New version → Deploy**
   (keep the same URL).
2. **Add header columns** (the script writes by position, so order matters):
   - `Leads` tab, columns 21–24: `Type of Business | Business Description | City/State | Investment Readiness`
   - `Results` tab, columns 12–14: `Monthly Revenue | Preferred Date | Preferred Time Slot`

The full, authoritative column lists live in **GOOGLE_SHEETS_SOP.md**.

---

## 5. Housekeeping notes
- `app/components/BookingNav.tsx` is now unused — safe to delete.
- `test-results/` (untracked) is incidental and can be gitignored.
- Pre-existing lint warnings remain in `bml-client.tsx` (`let cls`, an unescaped apostrophe) and a
  custom-font warning in `layout.tsx` — these predate this round of work and don't block the build.
- Verify locally with `npx tsc --noEmit` (types) and `npm run dev` (runtime).
