/**
 * Systems for SME - Google Sheets Connector
 * 
 * Paste this script in your Google Sheet under: Extensions > Apps Script.
 * 
 * To Deploy:
 * 1. Click "Deploy" (top right) > "New deployment".
 * 2. Select type: "Web app".
 * 3. Configure:
 *    - Description: "Systems for SME Website Connector"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (crucial for API access)
 * 4. Click "Deploy" and authorize the permissions.
 * 5. Copy the generated Web App URL and paste it in your Next.js project
 *    as the GOOGLE_SCRIPT_WEBAPP_URL environment variable.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // ACTION 1: Submit BML Quiz results
    if (action === 'submitBml') {
      var leadsSheet = sheet.getSheetByName('Leads');
      if (!leadsSheet) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Leads sheet not found" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Append row: Timestamp, Name, Business Name, Email, WhatsApp, Monthly Revenue, Biggest Pain Point, Overall Score %, Maturity Level, Weakest System, Q1, Q1_Details, Q2, Q2_Details, Q3, Q3_Details, Q4, Q4_Details, Q5, Q5_Details, Type of Business, Business Description, City/State, Investment Readiness
      leadsSheet.appendRow([
        new Date(),
        data.name || '',
        data.businessName || '',
        data.email || '',
        data.whatsapp || '',
        data.revenue || '',
        data.biggestProblem || '',
        data.averagePercentage ? data.averagePercentage + '%' : '',
        data.currentLevel || '',
        data.weakestDim || '',
        data.q1 || '',
        data.q1_details || '',
        data.q2 || '',
        data.q2_details || '',
        data.q3 || '',
        data.q3_details || '',
        data.q4 || '',
        data.q4_details || '',
        data.q5 || '',
        data.q5_details || '',
        data.typeOfBusiness || '',
        data.businessDescription || '',
        data.cityState || '',
        data.investmentReadiness || ''
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // ACTION 2: Submit Onboarding Booking details
    if (action === 'submitBooking') {
      var resultsSheet = sheet.getSheetByName('Results');
      if (!resultsSheet) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Results sheet not found" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Append row: Timestamp, Full Name, Phone Number, Business Name, Description, Team Size, Tracking, Problems, Other Problem, Fixed Before, Authority, Monthly Revenue, Preferred Date, Preferred Time Slot
      resultsSheet.appendRow([
        new Date(),
        data.fullName || '',
        data.phone || '',
        data.businessName || '',
        data.description || '',
        data.teamSize || '',
        data.tracking || '',
        data.problems ? data.problems.join(', ') : '',
        data.otherProblem || '',
        data.fixedBefore || '',
        data.authority || '',
        data.revenue || '',
        data.bookingDate || '',
        data.slot || ''
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Unknown action" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Read GlobalSettings (Key-Value)
    var settingsSheet = sheet.getSheetByName('GlobalSettings');
    var settings = {};
    if (settingsSheet) {
      var settingsRows = settingsSheet.getDataRange().getValues();
      for (var i = 1; i < settingsRows.length; i++) {
        var key = settingsRows[i][0];
        var val = settingsRows[i][1];
        if (key) {
          settings[key] = val;
        }
      }
    }
    
    // 2. Read FAQs
    var faqsSheet = sheet.getSheetByName('FAQs');
    var faqs = [];
    if (faqsSheet) {
      var faqsRows = faqsSheet.getDataRange().getValues();
      for (var i = 1; i < faqsRows.length; i++) {
        var q = faqsRows[i][0];
        var a = faqsRows[i][1];
        if (q && a) {
          faqs.push({ question: q, answer: a });
        }
      }
    }
    
    // 3. Read Reviews (Optional reviews tab, fallback handled on site)
    var reviewsSheet = sheet.getSheetByName('Reviews') || sheet.getSheetByName('GlobalSettings');
    var reviews = [];
    if (reviewsSheet && reviewsSheet.getName() === 'Reviews') {
      var reviewsRows = reviewsSheet.getDataRange().getValues();
      for (var i = 1; i < reviewsRows.length; i++) {
        var name = reviewsRows[i][0];
        var role = reviewsRows[i][1];
        var text = reviewsRows[i][2];
        var rating = reviewsRows[i][3];
        if (name && text) {
          reviews.push({ name: name, role: role || '', text: text, rating: rating || 5 });
        }
      }
    }

    // 4. Read Vault
    var vaultSheet = sheet.getSheetByName('Vault');
    var vault = [];
    if (vaultSheet) {
      var vaultRows = vaultSheet.getDataRange().getValues();
      var headers = vaultRows[0];
      
      // Dynamic header mapping
      var colIndices = {};
      for (var col = 0; col < headers.length; col++) {
        var hName = String(headers[col]).toLowerCase().trim();
        colIndices[hName] = col;
      }
      
      var getIndex = function(name, defaultIdx) {
        return colIndices[name] !== undefined ? colIndices[name] : defaultIdx;
      };
      
      var idxSlug = getIndex('slug', 0);
      var idxTitle = getIndex('title', 1);
      var idxTag = getIndex('tag', 2);
      var idxIcon = getIndex('icon', 3);
      var idxIntro = getIndex('intro', 4);
      var idxContent = getIndex('content', 5);
      var idxSection = getIndex('section', 6);
      var idxDownloadUrl = getIndex('downloadurl', -1);
      if (idxDownloadUrl === -1) {
        idxDownloadUrl = getIndex('download_url', -1);
      }
      if (idxDownloadUrl === -1) {
        idxDownloadUrl = getIndex('download link', -1);
      }
      
      for (var i = 1; i < vaultRows.length; i++) {
        var row = vaultRows[i];
        var slug = row[idxSlug];
        var title = row[idxTitle];
        var tag = row[idxTag];
        var icon = row[idxIcon];
        var intro = row[idxIntro];
        var contentVal = row[idxContent];
        var section = row[idxSection];
        var downloadUrl = idxDownloadUrl !== -1 ? row[idxDownloadUrl] : '';
        
        if (slug && title) {
          vault.push({
            slug: slug,
            title: title,
            tag: tag || '',
            icon: icon || 'rocket_launch',
            intro: intro || '',
            content: contentVal || '',
            section: section || 'vault',
            downloadUrl: downloadUrl || ''
          });
        }
      }
    }
    
    var response = {
      success: true,
      settings: settings,
      faqs: faqs,
      reviews: reviews,
      vault: vault
    };
    
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
