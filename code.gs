/**
 * Google Apps Script - Backend per Coffe-o-matric
 *
 * ISTRUZIONI:
 * 1. Apri un Google Foglio (Google Sheets)
 * 2. Rinomina il primo foglio in "Log" (o lascia "Foglio1" e aggiorna SHEET_NAME sotto)
 * 3. Nella riga 1, scrivi le intestazioni: A1 = "Data/Ora", B1 = "Azione"
 * 4. Vai su Estensioni > Apps Script
 * 5. Incolla questo codice nell'editor e salva
 * 6. Fai Deploy > Nuova distribuzione > Tipo: App Web
 *    - Esegui come: "Io" (il tuo account)
 *    - Chi ha accesso: "Chiunque"
 * 7. Copia l'URL generato e incollalo nella costante APPS_SCRIPT_URL in index.html
 */

const SHEET_NAME = 'Log';

/**
 * Gestisce le richieste POST inviate dalla SPA.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const azione = data.azione || 'Sconosciuto';
    const timestamp = data.timestamp || new Date().toLocaleString('it-IT');

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) {
      // Se il foglio "Log" non esiste, crealo con le intestazioni
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const newSheet = ss.insertSheet(SHEET_NAME);
      newSheet.appendRow(['Data/Ora', 'Azione']);
      newSheet.appendRow([timestamp, azione]);
    } else {
      sheet.appendRow([timestamp, azione]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Gestisce le richieste GET (utile per test nel browser).
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Coffe-o-matric backend attivo.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
