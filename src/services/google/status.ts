import { SyncStatus } from './types';

export const SPREADSHEET_TITLE = 'SENA Regional Atlántico - Registro y Respuestas Inducción 2026';
export const SPREADSHEET_ID_KEY = 'sena_active_spreadsheet_id';
export const SPREADSHEET_URL_KEY = 'sena_active_spreadsheet_url';
export const WEBHOOK_URL_KEY = 'sena_sheets_webhook_url';
export const QUEUE_STORAGE_KEY = 'sena_sheets_sync_queue';
export const TOTAL_SYNCED_KEY = 'sena_total_synced_count';

const listeners: Array<(status: SyncStatus) => void> = [];

let syncStatus: SyncStatus = {
  isConnected: false,
  userEmail: null,
  spreadsheetId: localStorage.getItem(SPREADSHEET_ID_KEY),
  spreadsheetUrl: localStorage.getItem(SPREADSHEET_URL_KEY),
  webhookUrl: localStorage.getItem(WEBHOOK_URL_KEY),
  isSyncing: false,
  lastSyncTime: null,
  pendingCount: getQueueLength(),
  totalSyncedCount: Number(localStorage.getItem(TOTAL_SYNCED_KEY) || '0'),
  error: null
};

function getQueueLength(): number {
  try {
    const list = JSON.parse(localStorage.getItem(QUEUE_STORAGE_KEY) || '[]');
    return Array.isArray(list) ? list.length : 0;
  } catch {
    return 0;
  }
}

export function updateStatus(patch: Partial<SyncStatus>) {
  syncStatus = { ...syncStatus, ...patch };
  listeners.forEach((fn) => {
    try {
      fn(syncStatus);
    } catch (e) {
      console.warn('Error in sync listener:', e);
    }
  });
}

export function subscribeSyncStatus(callback: (status: SyncStatus) => void): () => void {
  listeners.push(callback);
  callback(syncStatus);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

export function getSyncStatus(): SyncStatus {
  return syncStatus;
}

export function getWebhookUrl(): string | null {
  return localStorage.getItem(WEBHOOK_URL_KEY);
}

export function saveWebhookUrl(url: string | null): void {
  if (url && url.trim()) {
    const clean = url.trim();
    localStorage.setItem(WEBHOOK_URL_KEY, clean);
    updateStatus({ webhookUrl: clean, error: null });
  } else {
    localStorage.removeItem(WEBHOOK_URL_KEY);
    updateStatus({ webhookUrl: null });
  }
}
