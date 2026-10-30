import { ApprenticeSyncRecord } from './types';
import { 
  getSyncStatus, 
  updateStatus, 
  QUEUE_STORAGE_KEY, 
  WEBHOOK_URL_KEY, 
  TOTAL_SYNCED_KEY, 
  SPREADSHEET_ID_KEY 
} from './status';
import { getCachedToken } from './auth';

function getLocalQueue(): ApprenticeSyncRecord[] {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalQueue(queue: ApprenticeSyncRecord[]) {
  try {
    if (queue.length === 0) {
      localStorage.removeItem(QUEUE_STORAGE_KEY);
    } else {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    }
    updateStatus({ pendingCount: queue.length });
  } catch (e) {
    console.error('Error guardando cola local:', e);
  }
}

function queueRecord(record: ApprenticeSyncRecord) {
  const existing = getLocalQueue();
  existing.push(record);
  setLocalQueue(existing);
}

function incrementSyncedCount(added: number) {
  const current = Number(localStorage.getItem(TOTAL_SYNCED_KEY) || '0');
  const updated = current + added;
  localStorage.setItem(TOTAL_SYNCED_KEY, String(updated));
  updateStatus({
    totalSyncedCount: updated,
    lastSyncTime: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  });
}

function recordToRow(record: ApprenticeSyncRecord): string[] {
  return [
    record.timestamp,
    record.documento,
    record.nombreAprendiz,
    record.ficha,
    record.programa,
    record.regionalCentro,
    record.tipoRegistro,
    record.moduloOPregunta,
    record.respuestaSeleccionada,
    record.resultado,
    record.progresoOPuntaje,
    record.estadoGeneral
  ];
}

/**
 * Appends a record immediately to Google Sheets or Webhook; if offline or unauthenticated,
 * queues the record in localStorage.
 */
export async function syncApprenticeRecord(record: ApprenticeSyncRecord): Promise<boolean> {
  const accessToken = getCachedToken();
  const status = getSyncStatus();
  const spreadsheetId = status.spreadsheetId || localStorage.getItem(SPREADSHEET_ID_KEY);
  const webhookUrl = status.webhookUrl || localStorage.getItem(WEBHOOK_URL_KEY);

  // 1. Google Apps Script Webhook (works from all learner devices without requiring login)
  if (webhookUrl) {
    try {
      updateStatus({ isSyncing: true });
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      incrementSyncedCount(1);
      updateStatus({ isSyncing: false, error: null });
      return true;
    } catch (whErr) {
      console.warn('Aviso sincronización webhook:', whErr);
    }
  }

  // 2. Direct Google Sheets API via OAuth Bearer token
  if (accessToken && spreadsheetId) {
    updateStatus({ isSyncing: true });
    try {
      const rowValues = recordToRow(record);
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [rowValues]
          })
        }
      );

      if (res.ok) {
        incrementSyncedCount(1);
        updateStatus({ isSyncing: false, error: null });
        return true;
      } else {
        const errText = await res.text();
        console.warn('Respuesta Sheets API no exitosa:', errText);
      }
    } catch (sheetErr) {
      console.warn('Fallo llamada a Sheets API:', sheetErr);
    }
  }

  // 3. Fallback: Queue locally in safe storage
  queueRecord(record);
  updateStatus({ isSyncing: false });
  return false;
}

/**
 * Flushes all queued records to Google Sheets or Webhook
 */
export async function flushQueue(): Promise<number> {
  const accessToken = getCachedToken();
  const status = getSyncStatus();
  const spreadsheetId = status.spreadsheetId || localStorage.getItem(SPREADSHEET_ID_KEY);
  const webhookUrl = status.webhookUrl || localStorage.getItem(WEBHOOK_URL_KEY);

  const queue = getLocalQueue();
  if (queue.length === 0) return 0;

  // Flush via Webhook
  if (webhookUrl) {
    updateStatus({ isSyncing: true });
    try {
      for (const item of queue) {
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      }
      setLocalQueue([]);
      incrementSyncedCount(queue.length);
      updateStatus({ isSyncing: false, error: null });
      return queue.length;
    } catch (e) {
      console.warn('Aviso vaciando cola por webhook:', e);
      updateStatus({ isSyncing: false });
      return 0;
    }
  }

  // Flush via Sheets API
  if (accessToken && spreadsheetId) {
    updateStatus({ isSyncing: true });
    try {
      const rows = queue.map(recordToRow);
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ values: rows })
        }
      );

      if (res.ok) {
        setLocalQueue([]);
        incrementSyncedCount(queue.length);
        updateStatus({ isSyncing: false, error: null });
        return queue.length;
      }
    } catch (e) {
      console.warn('Aviso vaciando cola por Sheets API:', e);
      updateStatus({ isSyncing: false, error: 'Error al vaciar registros en cola hacia Google Sheets' });
    }
  }

  updateStatus({ isSyncing: false });
  return 0;
}
