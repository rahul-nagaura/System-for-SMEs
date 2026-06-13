# Google Sheets SOP — Systems for SME

This Standard Operating Procedure (SOP) defines the structure, column definitions, and data entry rules for the Google Sheets spreadsheet that powers the **Systems for SME** website.

---

## Tab 1 — GlobalSettings
* **What it is**: Global key-value configurations that control static text, prices, and assets across the entire website dynamically.
* **Database Actions**: Manual updates only.

| Key | Value (Example) | What it controls (Description) |
| :--- | :--- | :--- |
| `pricing_amount` | `2499` | The numeric checkout price shown on the landing page (e.g. ₹2,499). |
| `owner_photo_url` | `/raghav.jpg` | The image path or external URL for Raghav's profile photo. |
| `session_price_label` | `INR 2,499` | The text label displayed next to pricing or within CTA buttons. |

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

## Tab 4 — Questions
* **What it is**: The questions, answer options, and point configurations that drive the BML Quiz.
* **Database Actions**: Manual edits only. Each row represents a single answer option.

| Column Header | Description / Content | Data Type & Formatting Rules |
| :--- | :--- | :--- |
| `id` | Unique identifier for the BML question. | String ID (e.g., `Q1`, `Q2`) |
| `section` | The business maturity category being assessed. | Must be exactly: **`Operations`**, **`Finance`**, **`Human`**, or **`Digital`** |
| `question_text` | The question statement displayed on the quiz card. | Plain text string |
| `option_label` | The text label representing a single answer option. | Plain text |
| `option_points` | The score weight assigned if this option is selected. | Numeric integer (usually `0`, `1`, `2`, or `3`) |
| `order` | The sorting weight determining the question sequence. | Numeric integer |

---

## Tab 5 — Leads
* **What it is**: Lead details captured automatically upon BML Quiz completion.
* **Database Actions**: **READ-ONLY**. The website appends rows automatically. Never edit manually.

| Column Header | Description / Content | Data Type & Source |
| :--- | :--- | :--- |
| `timestamp` | The date and time when the quiz was completed. | ISO DateTime string (automated) |
| `name` | The full name submitted by the user. | String (user input) |
| `email` | The contact email address. | Valid email string (validated on server) |
| `phone` | The contact phone number. | Numeric digits (10 to 15 digits, validated on server) |
| `operations` | The score percentage achieved in the Operations section. | Numeric percentage value |
| `finance` | The score percentage achieved in the Finance section. | Numeric percentage value |
| `human` | The score percentage achieved in the Human Capital section. | Numeric percentage value |
| `digital` | The score percentage achieved in the Digital Maturity section. | Numeric percentage value |
| `score_15` | The total overall score calculated out of 15 points. | Numeric score (0 to 15) |
| `level` | The calculated Business Maturity Level. | String category (e.g. `L1`, `L2`, `L3`, `L4`, `L5`) |
| `biggest_gap` | The largest operational gap identified. | Must be: `Operations`, `Finance`, `Human`, or `Digital` |

---

## Tab 6 — Results
* **What it is**: User onboarding answers collected when booking a Systems Strategy Session.
* **Database Actions**: **READ-ONLY**. The website appends rows automatically. Never edit manually.

| Column Header | Description / Content | Data Type & Source |
| :--- | :--- | :--- |
| `timestamp` | The date and time when the booking form was submitted. | ISO DateTime string (automated) |
| `name` | The full name of the business owner. | String (user input) |
| `phone` | The contact phone number. | String (user input, validated on server) |
| `businessName` | The registered or commercial name of the business. | String (user input) |
| `description` | Description of business operations and workflows. | Plain text (user input) |
| `teamSize` | The size range of their current workforce. | String choice (e.g., `Just me`, `2-5`, `6-15`, `16-30`, `30+`) |

---

> [!WARNING]
> ### Common Mistakes to Avoid
> * **Do not delete rows from Leads or Results tabs**: If you need to clean up records, move the rows to a separate "Archive" tab. Deleting rows corrupts the Apps Script pointer row index.
> * **Strict Section Formatting**: The `section` column in the Vault tab only accepts exactly **`vault`** or **`ai_prompts`** in lowercase. Any other value prevents the resource from rendering.
> * **Slug Restrictions**: Slugs in the Vault tab must contain **lowercase letters, numbers, and hyphens only** (no spaces, spaces break route navigation).
> * **Busting Cache**: Content edits to the Google Sheet can take up to 1 hour to propagate. To see changes immediately, navigate to: `https://yourdomain.com/api/content-feed?nocache=true`.

---
*Systems for SME · @systems_for_sme · Internal SOP*
