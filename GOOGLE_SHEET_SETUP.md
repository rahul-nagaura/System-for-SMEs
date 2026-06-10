# Google Sheets Database Setup Guide

This guide explains how to set up the Google Sheet database and Google Apps Script connector from scratch.

---

## Step 1: Create a New Google Sheet
1. Open [Google Sheets](https://sheets.google.com).
2. Create a blank spreadsheet.
3. Rename the sheet to `Systems for SME Database` (or any name you prefer).

---

## Step 2: Create Spreadsheet Tabs
Create exactly **six tabs** in your spreadsheet. The tab names must match these exactly (case-sensitive):

1. `GlobalSettings`
2. `FAQs`
3. `Vault`
4. `Reviews`
5. `Leads`
6. `Results`

---

## Step 3: Configure Table Schemas & Headers
Type the following exact column headers into **Row 1** of each respective tab:

### 1. `GlobalSettings` Tab
Acts as a key-value store for global configurations.
* **Headers**: `Key`, `Value`
* **Purpose**:
  * `Key`: The variable name (e.g. `pricing`, `owner_photo_url`).
  * `Value`: The actual value (e.g. `2499`, `/raghav.jpg`).

### 2. `FAQs` Tab
Stores dynamic questions and answers shown on the landing page FAQ section.
* **Headers**: `Question`, `Answer`

### 3. `Vault` Tab
Stores guide contents, AI prompt templates, and resource cards displayed in the Vault.
* **Headers**: `Slug`, `Title`, `Tag`, `Icon`, `Intro`, `Content`, `Section`
* **Purpose**:
  * `Slug`: The unique path URL (e.g. `systems-starter-guide`).
  * `Title`: Name of the resource.
  * `Tag`: Tag label (e.g. `Guide`, `Prompt`, `Template`).
  * `Icon`: [Material Symbols icon name](https://fonts.google.com/icons) (e.g. `rocket_launch`, `factory`).
  * `Intro`: Short card summary.
  * `Content`: The body text. For Guides/Templates, save it as a JSON array of sections:
    `[{"heading": "Step 1", "body": "Details..."}, {"heading": "Step 2", "body": "Details..."}]`. For Prompts, save the prompt text.
  * `Section`: `vault` (for Guides/Templates) or `ai_prompts` (for AI Prompts).

### 4. `Reviews` Tab
Stores student or client testimonials.
* **Headers**: `Name`, `Role`, `Text`, `Rating`

### 5. `Leads` Tab
Logs submissions from the BML Quiz.
* **Headers**:
  `Timestamp`, `Name`, `Business Name`, `Email`, `WhatsApp`, `Monthly Revenue`, `Biggest Pain Point`, `Overall Score %`, `Maturity Level`, `Weakest System`, `Q1`, `Q1_Details`, `Q2`, `Q2_Details`, `Q3`, `Q3_Details`, `Q4`, `Q4_Details`, `Q5`, `Q5_Details`

### 6. `Results` Tab
Logs submissions from the Booking Onboarding Form.
* **Headers**:
  `Timestamp`, `Full Name`, `Phone Number`, `Business Name`, `Description`, `Team Size`, `Tracking`, `Problems`, `Other Problem`, `Fixed Before`, `Authority`

---

## Step 4: Install the Google Apps Script
1. Inside your Google Sheet, click **Extensions** in the top menu, then select **Apps Script**.
2. Delete any default code in the editor (usually a blank `myFunction` block).
3. Open the file [google_apps_script.js](file:///c:/Users/asus/Desktop/sme_web/website/google_apps_script.js) in this project repository, copy its entire contents, and paste it into the Apps Script editor.
4. Click the **Save** disk icon (or press `Ctrl+S`).

---

## Step 5: Deploy the Web App
1. Click the **Deploy** button (top right of the editor) and select **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configure the settings exactly as follows:
   * **Description**: `Systems for SME Website Connector`
   * **Execute as**: **Me** (your Google account)
   * **Who has access**: **Anyone** *(Crucial: if this is set to "Only myself", Vercel will not be authorized to communicate with your sheet).*
4. Click **Deploy**.
5. Google will ask you to authorize permissions. Click **Authorize access**, choose your Google account, select **Advanced** (at the bottom), click **Go to Systems for SME Script (unsafe)**, and approve the permissions.
6. Once deployed, copy the **Web app URL** provided in the popup. It should look like:
   `https://script.google.com/macros/s/AKfycby.../exec`

---

## Step 6: Connect to Next.js
Add the copied URL as an environment variable in your Next.js project.

* **Locally**: Paste it inside `.env.local`:
  ```env
  GOOGLE_SCRIPT_WEBAPP_URL=https://script.google.com/macros/s/AKfycb.../exec
  ```
* **Production**: Add it in your Vercel Dashboard under **Settings > Environment Variables** with the name `GOOGLE_SCRIPT_WEBAPP_URL`.

---

## Step 7: Sample Data (To Test Immediately)
Copy and paste this sample row data into your spreadsheet to verify the connection:

### `GlobalSettings` Tab Sample
| Key | Value |
| :--- | :--- |
| `pricing` | `2499` |
| `owner_photo_url` | `/raghav.jpg` |

### `FAQs` Tab Sample
| Question | Answer |
| :--- | :--- |
| `What is BML?` | `Business Maturity Level is a metric showing how independent your business is.` |

### `Vault` Tab Sample
| Slug | Title | Tag | Icon | Intro | Content | Section |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `systems-starter-guide` | `Systems Starter` | `Guide` | `rocket_launch` | `Roadmap guide.` | `[{"heading":"Audit Time","body":"Check details."}]` | `vault` |
| `sop` | `SOP Generator` | `Prompt` | `smart_toy` | `Act as manager.` | `Act as an operations manager. I will describe a manual process...` | `ai_prompts` |
