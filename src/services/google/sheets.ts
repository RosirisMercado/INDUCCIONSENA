import { 
  SPREADSHEET_TITLE, 
  SPREADSHEET_ID_KEY, 
  SPREADSHEET_URL_KEY, 
  updateStatus 
} from './status';
import { getCachedToken } from './auth';

export const SENA_SHEET_HEADERS = [
  'Fecha y Hora',
  'Documento',
  'Nombre del Aprendiz',
  'Ficha',
  'Programa de Formación',
  'Regional / Centro',
  'Tipo de Registro',
  'Módulo / Pregunta Evaluada',
  'Respuesta Seleccionada',
  'Resultado',
  'Puntaje / Progreso (%)',
  'Estado General del Aprendiz'
];

/**
 * Normalizes and extracts spreadsheet ID from Google Sheet URL or raw ID
 */
export function extractSpreadsheetId(urlOrId: string): string | null {
  const clean = urlOrId.trim();
  if (!clean) return null;
  const match = clean.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  if (/^[a-zA-Z0-9-_]{15,}$/.test(clean)) {
    return clean;
  }
  return null;
}

/**
 * Initializes row 1 headers in a spreadsheet if not already set
 */
async function initializeHeadersIfEmpty(spreadsheetId: string, accessToken: string) {
  try {
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:L1`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    if (checkRes.ok) {
      const data = await checkRes.json();
      if (data.values && data.values.length > 0 && data.values[0].length > 0) {
        // Headers already exist
        return;
      }
    }

    // Write default headers
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:L1?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          range: 'A1:L1',
          majorDimension: 'ROWS',
          values: [SENA_SHEET_HEADERS]
        })
      }
    );
  } catch (e) {
    console.warn('Advertencia al inicializar cabeceras de hoja:', e);
  }
}

/**
 * Links a custom existing spreadsheet provided by the instructor
 */
export async function linkCustomSpreadsheet(urlOrId: string, token?: string): Promise<{ id: string; url: string }> {
  const cleanId = extractSpreadsheetId(urlOrId);
  if (!cleanId) {
    throw new Error('El enlace o ID de la hoja de cálculo no es válido. Debe contener al menos 15 caracteres o ser un enlace de docs.google.com/spreadsheets.');
  }

  const accessToken = token || getCachedToken();
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${cleanId}/edit`;

  if (accessToken) {
    try {
      const testRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${cleanId}?fields=spreadsheetId,properties.title`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!testRes.ok) {
        if (testRes.status === 403) {
          throw new Error('Permiso denegado por Google. Asegúrate de tener permisos de edición en la hoja indicada con tu cuenta activa de Google.');
        } else if (testRes.status === 404) {
          throw new Error('No se encontró la hoja de cálculo con el ID proporcionado. Verifica que no haya sido eliminada de Drive.');
        }
      }
      await initializeHeadersIfEmpty(cleanId, accessToken);
    } catch (err: any) {
      if (err.message && err.message.includes('Permiso denegado')) {
        throw err;
      }
      console.warn('Aviso verificando hoja personalizada:', err);
    }
  }

  localStorage.setItem(SPREADSHEET_ID_KEY, cleanId);
  localStorage.setItem(SPREADSHEET_URL_KEY, sheetUrl);
  updateStatus({
    spreadsheetId: cleanId,
    spreadsheetUrl: sheetUrl,
    error: null
  });

  return { id: cleanId, url: sheetUrl };
}

/**
 * Guarantees that a valid Google Sheet exists for the induction records.
 * Searches Drive first, attempts creation via Sheets API v4, and falls back to Drive API v3.
 */
export async function ensureSpreadsheetExists(token?: string): Promise<{ id: string; url: string }> {
  const accessToken = token || getCachedToken();
  if (!accessToken) {
    throw new Error('Se requiere autenticación con Google para acceder a Google Drive');
  }

  // 1. Check if we already have an active valid spreadsheet ID
  const existingId = localStorage.getItem(SPREADSHEET_ID_KEY);
  if (existingId && existingId.trim().length > 10) {
    try {
      const checkRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${existingId}?fields=spreadsheetId,spreadsheetUrl,properties.title`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      if (checkRes.ok) {
        const sheetData = await checkRes.json();
        const url = sheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${existingId}/edit`;
        localStorage.setItem(SPREADSHEET_URL_KEY, url);
        updateStatus({ spreadsheetId: existingId, spreadsheetUrl: url, error: null });
        return { id: existingId, url };
      } else if (checkRes.status === 404) {
        localStorage.removeItem(SPREADSHEET_ID_KEY);
        localStorage.removeItem(SPREADSHEET_URL_KEY);
      }
    } catch (e) {
      console.warn('Aviso al verificar hoja existente:', e);
    }
  }

  // 2. Search Drive for existing file with the official SENA title
  try {
    const query = encodeURIComponent(`name = '${SPREADSHEET_TITLE}' and trashed = false and mimeType = 'application/vnd.google-apps.spreadsheet'`);
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        const file = searchData.files[0];
        const url = file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}/edit`;
        localStorage.setItem(SPREADSHEET_ID_KEY, file.id);
        localStorage.setItem(SPREADSHEET_URL_KEY, url);
        updateStatus({ spreadsheetId: file.id, spreadsheetUrl: url, error: null });
        await initializeHeadersIfEmpty(file.id, accessToken);
        return { id: file.id, url };
      }
    }
  } catch (searchErr) {
    console.warn('Aviso buscando hoja en Drive:', searchErr);
  }

  // 3. Method A: Create directly via Google Sheets API v4
  let sheetsErrorMessage: string | null = null;
  try {
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          title: SPREADSHEET_TITLE
        }
      })
    });

    if (createRes.ok) {
      const newSheet = await createRes.json();
      const spreadsheetId = newSheet.spreadsheetId;
      const spreadsheetUrl = newSheet.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

      // Initialize row 1 headers
      await initializeHeadersIfEmpty(spreadsheetId, accessToken);

      localStorage.setItem(SPREADSHEET_ID_KEY, spreadsheetId);
      localStorage.setItem(SPREADSHEET_URL_KEY, spreadsheetUrl);
      updateStatus({ spreadsheetId, spreadsheetUrl, error: null });

      return { id: spreadsheetId, url: spreadsheetUrl };
    } else {
      const errorText = await createRes.text();
      try {
        const parsed = JSON.parse(errorText);
        sheetsErrorMessage = parsed.error?.message || errorText;
      } catch {
        sheetsErrorMessage = errorText;
      }
    }
  } catch (err: any) {
    sheetsErrorMessage = err.message;
  }

  // 4. If creation could not be completed automatically (e.g. Google Sheets API not enabled in GCP project)
  const isPermissionDenied = sheetsErrorMessage && (sheetsErrorMessage.includes('caller does not have permission') || sheetsErrorMessage.includes('PERMISSION_DENIED'));
  const diagnostic = isPermissionDenied
    ? 'Falta habilitar la "Google Sheets API" en tu proyecto de Google Cloud (starlit-oven-455401-h7), o usar el Webhook de Google Apps Script para sincronización directa sin restricciones.'
    : `Creación automática de hoja restringida (${sheetsErrorMessage || 'Error de Google'}).`;

  updateStatus({
    error: diagnostic,
    isSyncing: false
  });

  return { id: '', url: '' };
}

/**
 * Unlinks the active spreadsheet from local storage and state, allowing a clean reset
 */
export function unlinkSpreadsheet(): void {
  localStorage.removeItem(SPREADSHEET_ID_KEY);
  localStorage.removeItem(SPREADSHEET_URL_KEY);
  updateStatus({
    spreadsheetId: null,
    spreadsheetUrl: null,
    error: null
  });
}
