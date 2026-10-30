export interface ApprenticeSyncRecord {
  id?: string;
  timestamp: string;
  documento: string;
  nombreAprendiz: string;
  ficha: string;
  programa: string;
  regionalCentro: string;
  tipoRegistro: 'RESPUESTA_EVALUACION' | 'MODULO_COMPLETADO' | 'EVALUACION_FINAL';
  moduloOPregunta: string;
  respuestaSeleccionada: string;
  resultado: 'CORRECTA' | 'INCORRECTA' | 'COMPLETADO' | 'APROBADO' | 'NO_APROBADO';
  progresoOPuntaje: string;
  estadoGeneral: string;
}

export interface SyncStatus {
  isConnected: boolean;
  userEmail: string | null;
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  webhookUrl: string | null;
  isSyncing: boolean;
  lastSyncTime: string | null;
  pendingCount: number;
  totalSyncedCount: number;
  error: string | null;
}
