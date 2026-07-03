# Google Sheets SOP — Systems for SME

This Standard Operating Procedure (SOP) defines the structure, column definitions, and data entry rules for the Google Sheets spreadsheet that powers the **Systems for SME** website.

---

## Tab 1 — GlobalSettings
* **What it is**: Global key-value configurations that control static text, prices, and assets across the entire website dynamically.
* **Database Actions**: Manual updates only.

> **Note**: Only the two keys below are read by the website. Any other key you add here is ignored.

| Key | Value (Example) | What it controls (Description) |
| :--- | :--- | :--- |
| `pricing_amount` | `2499` | The numeric checkout price shown on the landing page. The site automatically prefixes `₹` if you don't include it (e.g. `2499` → ₹2,499). |
| `owner_photo_url` | `/raghav.jpg` | The image path or external URL for Raghav's profile photo. |

---

## Tab 2 — FAQs
* **What it is**: The list of frequently asked questions and answers displayed in the accordion on the landing page.
* **Database Actions**: Manual additions and edits. Each row represents one FAQ card.

| Column Header | Description / Content | Data Type & Formatting |
| :--- | :--- | :--- |
| `question` | The question text displayed on the collapsed accordion header. | Plain text string (must end with `?`) |
| `answer` | The detailed answer revealed when the accordion header is clicked. | Plain text paragraph |

---

## Tab 3 — Vault
* **What it is**: The resource templates, delegation checklists, and AI prompts displayed in the Vault.
* **Database Actions**: Manual additions and edits. Each row represents one resource item.

| Column Header | Description / Content | Data Type & Formatting Rules |
| :--- | :--- | :--- |
| `slug` | The URL-friendly page path identifier. | **Hyphens only, lowercase, no spaces** (e.g., `job-scorecard-template`) |
| `title` | The main title of the resource card. | Plain text string |
| `tag` | The tag label displayed at the top of the card. | Single category word (e.g., `SOP`, `Checklist`, `AI Prompt`) |
| `section` | Categorization group determining which tab it appears in. | Must be exactly: **`vault`** or **`ai_prompts`** (lowercase) |
| `icon` | Material Symbols icon name shown on the card. | Valid icon name (e.g. `description`, `terminal`, `menu_book`) |
| `intro` | A short 1-2 sentence description shown in grid lists. | Plain text |
| `content` | The full-text article body shown on the detail page. | Markdown syntax (supports `# Headers`, `**bold**`, bullet lists) |
| `downloadUrl` | Optional Google Drive link to download the PDF guide. | Valid HTTP/HTTPS link (e.g. `https://drive.google.com/file/...`) |

---

## Tab 4 — Reviews
* **What it is**: Customer testimonials shown in the reviews section of the landing page.
* **Database Actions**: Manual additions and edits. Each row represents one testimonial card. *(Optional: if this tab is missing or empty, the site falls back to its built-in default reviews.)*

| Column Header | Description / Content | Data Type & Formatting |
| :--- | :--- | :--- |
| `Name` | The reviewer's name. | Plain text string |
| `Role` | The reviewer's role or business type (e.g. `Retail Chain Owner`). | Plain text string |
| `Text` | The testimonial body. | Plain text paragraph |
| `Rating` | Star rating out of 5. | Numeric integer `1`–`5` (defaults to `5` if blank) |

> [!NOTE]
> **The BML Quiz questions are NOT stored in the spreadsheet.** They are defined in code (`app/bml/bml-data.ts`). There is no "Questions" tab. To change quiz wording, options, or point weights, edit `bml-data.ts` — not the sheet.

---

## Tab 5 — Leads
* **What it is**: Lead details captured automatically upon BML Quiz completion.
* **Database Actions**: **READ-ONLY**. The website appends rows automatically. Never edit manually.

The website appends these **24 columns**, in this exact order:

| Column Header | Description / Content | Data Type & Source |
| :--- | :--- | :--- |
| `Timestamp` | The date and time when the quiz was completed. | DateTime (automated) |
| `Name` | The full name submitted by the user. | String (user input) |
| `Business Name` | The user's business name. | String (user input) |
| `Email` | The contact email address. | Valid email string (validated on server) |
| `WhatsApp` | The contact phone/WhatsApp number. | 10–15 digits (required, validated on server) |
| `Monthly Revenue` | The selected average monthly revenue band. | String (e.g. `₹5L - ₹20L`) |
| `Biggest Pain Point` | The problem(s) the user selected on the intro step (multi-select). | Comma-separated string (e.g. `Sales low hain, Staff leaves quickly`) |
| `Overall Score %` | The overall maturity percentage. | Percentage string (e.g. `62%`) |
| `Maturity Level` | The calculated Business Maturity Level. | String (e.g. `Level 2 - Owner-Dependent`) |
| `Weakest System` | The weakest dimension identified. | Must be: `Operational Efficiency`, `Financial Control`, `Human Capital`, or `Digital Maturity` |
| `Q1` | The answer chosen for Question 1. | String (`label - text`) |
| `Q1_Details` | Free-text detail if "Other" was chosen for Q1. | String (may be blank) |
| `Q2` | The answer chosen for Question 2. | String (`label - text`) |
| `Q2_Details` | Free-text detail if "Other" was chosen for Q2. | String (may be blank) |
| `Q3` | The answer chosen for Question 3. | String (`label - text`) |
| `Q3_Details` | Free-text detail if "Other" was chosen for Q3. | String (may be blank) |
| `Q4` | The answer chosen for Question 4. | String (`label - text`) |
| `Q4_Details` | Free-text detail if "Other" was chosen for Q4. | String (may be blank) |
| `Q5` | The answer chosen for Question 5. | String (`label - text`) |
| `Q5_Details` | Free-text detail if "Other" was chosen for Q5. | String (may be blank) |
| `Type of Business` | The business type selected on the lead-capture step. | String: `Manufacturing`, `Digital Service/Product`, `Retail`, `Wholesale/Trader`, or `Other` |
| `Business Description` | The user's brief description of their business. | Plain text (user input) |
| `City/State` | The user's city and state. | String (user input) |
| `Investment Readiness` | Whether the user is ready to invest to solve their problems. | String (one of the 4 readiness options) |

---

## Tab 6 — Results
* **What it is**: User onboarding answers collected when booking a Systems Strategy Session.
* **Database Actions**: **READ-ONLY**. The website appends rows automatically. Never edit manually.

The website appends these **14 columns**, in this exact order:

| Column Header | Description / Content | Data Type & Source |
| :--- | :--- | :--- |
| `Timestamp` | The date and time when the booking form was submitted. | DateTime (automated) |
| `Full Name` | The full name of the business owner. | String (user input) |
| `Phone Number` | The contact phone number. | String (user input, validated on server) |
| `Business Name` | The registered or commercial name of the business. | String (user input) |
| `Description` | Description of business operations and workflows. | Plain text (user input) |
| `Team Size` | The size range of their current workforce. | String choice: `Just me`, `2–5`, `6–15`, `16–30`, `30+` |
| `Tracking` | How they currently track daily tasks/sales. | String choice: `registers`, `whatsapp`, `excel`, `software`, `none` |
| `Problems` | The bottleneck areas selected (multi-select). | Comma-separated values from: `staff`, `data`, `owner_dependency`, `sales`, `scale` |
| `Other Problem` | Free-text "other" bottleneck, if provided. | String (may be blank) |
| `Fixed Before` | Whether they've tried fixing this before. | String choice: `yes`, `no`, `other` (Partial Attempt) |
| `Authority` | Their decision-making authority. | String choice: `owner`, `partner`, `representative` |
| `Monthly Revenue` | The selected average monthly revenue band (same options as the BML quiz). | String (e.g. `₹5L - ₹20L`) |
| `Preferred Date` | The date the user picked for the call (one of the next 7 days). | String (e.g. `Mon, 16 Jun`) |
| `Preferred Time Slot` | The time slot the user picked. | String: `2:00–3:00 PM`, `10:00–11:00 PM`, or `11:00 PM–12:00 AM` |


---

## Tab 7 — BlockedSlots (availability overrides)
* **What it is**: One-time **overrides** to the booking calendar — used to **block** (close) or **open** specific dates/slots.
* **How the calendar normally works**: Your usual weekly schedule is **automatic** (set in code): **Sat & Sun** all 4 slots open, **Friday** 9–10 PM & 10–11 PM open, and **Mon–Thu** shown as "Booked". **You do NOT maintain the normal schedule here.**
* **Database Actions**: **You only add a row when you want to change the usual pattern for a specific date.** A normal week = this tab can be empty. Each row is one override.

| Column Header | Description / Content | Data Type & Formatting |
| :--- | :--- | :--- |
| `Date` | The date you want to override. | Date Cell (e.g. `2026-06-27`) |
| `TimeSlot` | The specific slot, or **`All`** for the whole day. | String: `All`, `2:00-3:00 PM`, `3:00-4:00 PM`, `9:00-10:00 PM`, or `10:00-11:00 PM` |
| `Action` | **`block`** = close this slot, **`open`** = open a normally-closed slot. Blank = `block`. | String: `block` or `open` |

**Examples:**

| Date | TimeSlot | Action | Effect |
| :--- | :--- | :--- | :--- |
| `2026-07-11` | `All` | `block` | Away that Saturday → freeze the whole day |
| `2026-07-12` | `2:00-3:00 PM` | `block` | Freeze just one weekend slot |
| `2026-07-15` | `9:00-10:00 PM` | `open` | Free that Wednesday night → open a normally-closed weekday slot |
| `2026-07-16` | `All` | `open` | Whole Thursday free → open all 4 slots that day |

> [!TIP]
> * **Block wins:** if a slot has both a `block` and an `open` row, it stays blocked (safer).
> * **No cleanup needed:** the form only looks at the next 7 days, so rows with past dates are ignored automatically. Delete them occasionally just to stay tidy.
> * **To change your *permanent* weekly pattern** (e.g. "Thursdays are always open now"), that's a small code change — ask your developer; it's not done from this sheet.

---

> [!WARNING]
> ### Common Mistakes to Avoid
> * **Do not delete rows from Leads or Results tabs**: If you need to clean up records, move the rows to a separate "Archive" tab. Deleting rows corrupts the Apps Script pointer row index.
> * **Strict Section Formatting**: The `section` column in the Vault tab only accepts exactly **`vault`** or **`ai_prompts`** in lowercase. Any other value prevents the resource from rendering.
> * **Slug Restrictions**: Slugs in the Vault tab must contain **lowercase letters, numbers, and hyphens only** (no spaces, spaces break route navigation).
> * **Busting Cache**: Content edits to the Google Sheet can take up to 1 hour to propagate. To see changes immediately, navigate to: `https://yourdomain.com/api/content-feed?nocache=true`.

---
*Systems for SME · @systems_for_sme · Internal SOP*
