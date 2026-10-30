import React, { useState, useEffect } from 'react';
import { FichaSummary, QuizAttempt, QuizQuestion } from '../types/induction';
import { FICHAS_SAMPLE, INITIAL_ATTEMPTS, QUIZ_QUESTIONS } from '../data/senaData';
import { 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Plus, 
  Search, 
  BarChart3, 
  BookOpen, 
  TrendingUp, 
  Eye, 
  X, 
  FileSpreadsheet,
  Filter,
  Cloud,
  ExternalLink,
  RefreshCw,
  LogOut,
  CheckCircle,
  Link as LinkIcon,
  Send,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { SenaLogo } from '../assets/senaLogo';
import { 
  subscribeSyncStatus, 
  signInWithGoogle, 
  signOutGoogle, 
  flushQueue, 
  SyncStatus, 
  SPREADSHEET_TITLE,
  linkCustomSpreadsheet,
  syncApprenticeRecord,
  saveWebhookUrl,
  getWebhookUrl,
  getCachedToken,
  updateStatus,
  unlinkSpreadsheet
} from '../services/google';

interface InstructorDashboardProps {
  allAttempts: QuizAttempt[];
  onAddCustomQuestion?: (q: QuizQuestion) => void;
  onSimulateApprenticeAttempt: (name: string, score: number) => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  allAttempts,
  onSimulateApprenticeAttempt
}) => {
  const [fichas, setFichas] = useState<FichaSummary[]>(FICHAS_SAMPLE);
  const [selectedFicha, setSelectedFicha] = useState<string>('2824901');
  const [searchLearner, setSearchLearner] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [selectedAttemptDetail, setSelectedAttemptDetail] = useState<QuizAttempt | null>(null);

  // New apprentice quick-add simulation
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLearnerName, setNewLearnerName] = useState('');
  const [newLearnerScore, setNewLearnerScore] = useState(85);

  // Google Sheets & Drive state
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: false,
    userEmail: null,
    spreadsheetId: null,
    spreadsheetUrl: null,
    webhookUrl: null,
    isSyncing: false,
    lastSyncTime: null,
    pendingCount: 0,
    totalSyncedCount: 0,
    error: null
  });
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [manualSyncMsg, setManualSyncMsg] = useState<string | null>(null);

  // Custom sheet linking state
  const [customSheetUrl, setCustomSheetUrl] = useState('');
  const [showCustomLinkInput, setShowCustomLinkInput] = useState(false);
  const [isLinkingCustom, setIsLinkingCustom] = useState(false);
  const [customLinkError, setCustomLinkError] = useState<string | null>(null);
  const [isTestingSync, setIsTestingSync] = useState(false);

  // Webhook state
  const [webhookUrlInput, setWebhookUrlInput] = useState(getWebhookUrl() || '');
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const APPS_SCRIPT_TEMPLATE = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Fecha y Hora', 'Documento', 'Nombre del Aprendiz', 'Ficha', 'Programa de Formación', 'Regional / Centro', 'Tipo de Registro', 'Módulo / Pregunta Evaluada', 'Respuesta Seleccionada', 'Resultado', 'Puntaje / Progreso (%)', 'Estado General del Aprendiz']);
  }
  sheet.appendRow([data.timestamp, data.documento, data.nombreAprendiz, data.ficha, data.programa, data.regionalCentro, data.tipoRegistro, data.moduloOPregunta, data.respuestaSeleccionada, data.resultado, data.progresoOPuntaje, data.estadoGeneral]);
  return ContentService.createTextOutput(JSON.stringify({result: 'success'})).setMimeType(ContentService.MimeType.JSON);
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    saveWebhookUrl(webhookUrlInput);
    setShowWebhookModal(false);
    setManualSyncMsg('✓ Webhook de sincronización guardado correctamente.');
    setTimeout(() => setManualSyncMsg(null), 3500);
  };

  useEffect(() => {
    const unsub = subscribeSyncStatus((s) => setSyncStatus(s));
    return () => unsub();
  }, []);

  const handleConnectGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      setManualSyncMsg('¡Conectado exitosamente con Google!');
      setTimeout(() => setManualSyncMsg(null), 3500);
    } catch (err: any) {
      updateStatus({ error: err.message || 'Error al iniciar sesión' });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleConfirmDisconnect = async () => {
    try {
      await signOutGoogle();
      setShowDisconnectModal(false);
      setManualSyncMsg('Sesión de Google Drive desconectada.');
      setTimeout(() => setManualSyncMsg(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualFlush = async () => {
    setIsGoogleLoading(true);
    try {
      const flushed = await flushQueue();
      setManualSyncMsg(`✓ Sincronizados ${flushed} registros a la hoja central.`);
      setTimeout(() => setManualSyncMsg(null), 3500);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLinkCustomSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSheetUrl.trim()) return;
    setIsLinkingCustom(true);
    setCustomLinkError(null);
    try {
      const res = await linkCustomSpreadsheet(customSheetUrl.trim(), getCachedToken() || '');
      setManualSyncMsg(`¡Hoja vinculada con éxito! ID: ${res.id.slice(0, 8)}...`);
      setShowCustomLinkInput(false);
      setCustomSheetUrl('');
      setTimeout(() => setManualSyncMsg(null), 4000);
    } catch (err: any) {
      setCustomLinkError(err.message || 'Error vinculando la hoja de cálculo');
    } finally {
      setIsLinkingCustom(false);
    }
  };

  const handleUnlinkSheet = () => {
    unlinkSpreadsheet();
    setManualSyncMsg('Hoja desvinculada. Puedes vincular una nueva hoja limpia.');
    setShowCustomLinkInput(true);
    setTimeout(() => setManualSyncMsg(null), 3500);
  };

  const handleSendTestRow = async () => {
    setIsTestingSync(true);
    try {
      const success = await syncApprenticeRecord({
        timestamp: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }),
        documento: 'PRUEBA-INSTRUCTOR',
        nombreAprendiz: 'Instructor Prueba de Sincronización',
        ficha: selectedFicha,
        programa: currentFichaData.programa,
        regionalCentro: `${currentFichaData.regional} - ${currentFichaData.centro}`,
        tipoRegistro: 'MODULO_COMPLETADO',
        moduloOPregunta: 'Verificación de Conexión en Vivo con Google Sheets',
        respuestaSeleccionada: 'Conexión verificada exitosamente',
        resultado: 'COMPLETADO',
        progresoOPuntaje: '100%',
        estadoGeneral: 'Verificado por Instructor'
      });
      if (success) {
        setManualSyncMsg('✓ Fila de prueba enviada exitosamente a tu Google Sheet en Drive.');
      } else {
        setManualSyncMsg('✓ Registro guardado en la cola local para sincronización.');
      }
      setTimeout(() => setManualSyncMsg(null), 4000);
    } catch (err: any) {
      setManualSyncMsg(`Error: ${err.message}`);
    } finally {
      setIsTestingSync(false);
    }
  };

  const currentFichaData = fichas.find(f => f.codigoFicha === selectedFicha) || fichas[0];

  // Filter attempts for this ficha or general
  const filteredAttempts = allAttempts.filter((att) => {
    const matchesSearch = att.nombreAprendiz.toLowerCase().includes(searchLearner.toLowerCase()) ||
      att.ficha.includes(searchLearner);
    const matchesStatus = statusFilter === 'all' 
      ? true 
      : statusFilter === 'passed' ? att.aprobado : !att.aprobado;
    return matchesSearch && matchesStatus;
  });

  const totalCohort = filteredAttempts.length;
  const passedCount = filteredAttempts.filter(a => a.aprobado).length;
  const passRate = totalCohort > 0 ? Math.round((passedCount / totalCohort) * 100) : 0;
  const avgScore = totalCohort > 0 
    ? Math.round(filteredAttempts.reduce((acc, curr) => acc + curr.puntaje, 0) / totalCohort) 
    : 0;

  // Calculate weak axis in this cohort
  const axisAverages = {
    identidad: 0,
    derechos: 0,
    deberes: 0,
    tramites: 0
  };

  if (totalCohort > 0) {
    filteredAttempts.forEach(a => {
      axisAverages.identidad += a.desgloseEjes.identidad;
      axisAverages.derechos += a.desgloseEjes.derechos;
      axisAverages.deberes += a.desgloseEjes.deberes;
      axisAverages.tramites += a.desgloseEjes.tramites;
    });
    axisAverages.identidad = Math.round(axisAverages.identidad / totalCohort);
    axisAverages.derechos = Math.round(axisAverages.derechos / totalCohort);
    axisAverages.deberes = Math.round(axisAverages.deberes / totalCohort);
    axisAverages.tramites = Math.round(axisAverages.tramites / totalCohort);
  }

  // Find lowest axis
  const lowestAxisEntry = Object.entries(axisAverages).sort((a, b) => a[1] - b[1])[0] || ['deberes', 75];

  const handleExportCSV = () => {
    const headers = ['Nombre Aprendiz', 'Ficha', 'Programa', 'Fecha Examen', 'Puntaje', 'Estado', 'Identidad %', 'Derechos %', 'Deberes %', 'Tramites %'];
    const rows = filteredAttempts.map(a => [
      `"${a.nombreAprendiz}"`,
      a.ficha,
      `"${a.programa}"`,
      `"${a.fecha}"`,
      a.puntaje,
      a.aprobado ? 'Aprobado' : 'Requiere Refuerzo',
      a.desgloseEjes.identidad,
      a.desgloseEjes.derechos,
      a.desgloseEjes.deberes,
      a.desgloseEjes.tramites
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SENA_Induccion_Ficha_${selectedFicha}_Resultados.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddLearner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLearnerName.trim()) return;
    onSimulateApprenticeAttempt(newLearnerName.trim(), Number(newLearnerScore));
    setNewLearnerName('');
    setIsAddModalOpen(false);
  };

  return (
    <div id="instructor-pdf-print-area" className="space-y-8 pb-16">
      {/* 1. Header & Ficha Selection */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <SenaLogo className="w-12 h-12 shrink-0" />
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
                <span>Gestión Docente & Coordinación Misional</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Panel de Control de Inducción SENA
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Monitorea el progreso de apropiación del proceso de inducción de tus aprendices, identifica falencias curriculares tempranas y emite constancias oficiales.
              </p>
            </div>
          </div>

          {/* Ficha switcher */}
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shrink-0">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Seleccionar Ficha de Caracterización:
            </label>
            <select
              value={selectedFicha}
              onChange={(e) => setSelectedFicha(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 w-full"
            >
              {fichas.map(f => (
                <option key={f.codigoFicha} value={f.codigoFicha}>
                  Ficha {f.codigoFicha} - {f.programa}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 2. KPI Metrics Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Aprendices Evaluados</span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {totalCohort}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ficha {currentFichaData.codigoFicha} · {currentFichaData.regional}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Tasa de Aprobación</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
            {passRate}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {passedCount} de {totalCohort} con puntaje $\ge$ 80%
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Promedio de Apropiación</span>
            <TrendingUp className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {avgScore} / 100
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Escala cualitativa: Nivel Superior
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Eje de Mayor Refuerzo</span>
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-700 dark:text-amber-400 capitalize">
            {lowestAxisEntry[0]} ({lowestAxisEntry[1]}%)
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sugerencia: Reforzar en sesión presencial
          </div>
        </div>
      </section>

      {/* 2.5. Google Drive & Sheets Real-time Synchronization Card */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 p-6 shadow-xs relative overflow-hidden">
        {/* Top green accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950/80 rounded-lg text-emerald-800 dark:text-emerald-300">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Sincronización en Tiempo Real con Google Drive & Google Sheets
              </h2>
              {syncStatus.isConnected && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Conectado en Vivo
                </span>
              )}
              {syncStatus.webhookUrl && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                  <Check className="w-3 h-3 text-sky-600" />
                  Webhook Multi-Dispositivo
                </span>
              )}
              <button
                type="button"
                onClick={() => setShowWebhookModal(true)}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Configurar webhook de Google Apps Script para sincronizar desde cualquier dispositivo de aprendices"
              >
                ⚙️ Webhook Apps Script
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {syncStatus.isConnected ? (
                <>
                  La hoja de cálculo centralizada <strong>"{SPREADSHEET_TITLE}"</strong> está vinculada en tu cuenta de Google Drive. A medida que los aprendices responden preguntas de la evaluación y completan módulos, cada registro se sincroniza en tiempo real.
                </>
              ) : (
                <>
                  Vincula tu cuenta de Google para crear y sincronizar automáticamente la hoja de cálculo oficial en tu Google Drive. Cada respuesta de los aprendices se almacena de inmediato en tiempo real sin requerir exportaciones manuales.
                </>
              )}
            </p>

            {/* Notification message */}
            {manualSyncMsg && (
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{manualSyncMsg}</span>
              </div>
            )}

            {/* Diagnostic Error Box with Clear Action */}
            {syncStatus.error && (
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl p-4 text-xs space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                      ¿Por qué no aparecen casillas de permiso y Google dice "The caller does not have permission"?
                    </p>
                    <p className="text-amber-800 dark:text-amber-300 leading-relaxed text-xs">
                      1. <strong>No aparecen casillas</strong> porque tu cuenta de Google ya autorizó la aplicación anteriormente (el consentimiento ya está otorgado en tu cuenta).<br />
                      2. El error <em>"The caller does not have permission"</em> ocurre porque en tu proyecto de Google Cloud (<code>starlit-oven-455401-h7</code>) aún no se ha activado la <strong>Google Sheets API</strong>, o puedes usar el <strong>Webhook de Apps Script</strong> para sincronizar inmediatamente sin tocar Google Cloud.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <a
                    href="https://console.cloud.google.com/apis/library/sheets.googleapis.com?project=starlit-oven-455401-h7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                  >
                    <span>1. Activar Google Sheets API en GCP (1 clic)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setShowWebhookModal(true)}
                    className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                  >
                    <span>2. O Usar Webhook Apps Script (Instantáneo)</span>
                  </button>

                  <a
                    href="https://sheets.new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg font-medium text-xs inline-flex items-center gap-1.5 transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Crear hoja (sheets.new)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Custom Sheet Linker Form (Always accessible or when opened) */}
            {(showCustomLinkInput || (syncStatus.error && !syncStatus.spreadsheetId)) && (
              <form onSubmit={handleLinkCustomSheet} className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Vincular Hoja de Google Drive (Pega tu enlace o ID):</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCustomLinkInput(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    ✕ Cerrar
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSheetUrl}
                    onChange={(e) => setCustomSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/1.../edit"
                    className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isLinkingCustom || !customSheetUrl.trim()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer disabled:opacity-50 shrink-0 shadow-xs"
                  >
                    {isLinkingCustom ? 'Vinculando...' : 'Vincular Hoja'}
                  </button>
                </div>
                {customLinkError && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">{customLinkError}</p>
                )}
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span>Pega cualquier URL de Google Sheets donde tengas acceso de edición.</span>
                  <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-semibold underline inline-flex items-center gap-1">
                    <span>Crear nueva hoja en blanco ahora</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Right Action Box */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3">
            {syncStatus.isConnected ? (
              <>
                <div className="text-right text-xs text-slate-500 dark:text-slate-400 hidden lg:block">
                  <div>Cuenta: <span className="font-semibold text-slate-800 dark:text-slate-200">{syncStatus.userEmail}</span></div>
                  <div>Registros sincronizados: <span className="font-bold text-emerald-600 dark:text-emerald-400">{syncStatus.totalSyncedCount}</span></div>
                  {syncStatus.lastSyncTime && <div>Último registro: <span className="font-mono">{syncStatus.lastSyncTime}</span></div>}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {syncStatus.spreadsheetUrl && (
                    <a
                      href={syncStatus.spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-sm transition-all"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Abrir Hoja en Google Drive</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    onClick={handleSendTestRow}
                    disabled={isTestingSync || syncStatus.isSyncing}
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Enviar una fila de prueba para comprobar la sincronización con Google Sheets"
                  >
                    <Send className={`w-3.5 h-3.5 ${isTestingSync ? 'animate-pulse' : ''}`} />
                    <span>{isTestingSync ? 'Enviando...' : 'Probar Envío'}</span>
                  </button>

                  <button
                    onClick={handleManualFlush}
                    disabled={isGoogleLoading || syncStatus.isSyncing}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Forzar envío de registros en cola"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
                    <span>Sincronizar ({syncStatus.pendingCount})</span>
                  </button>

                  <button
                    onClick={() => setShowDisconnectModal(true)}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:border-rose-300 dark:hover:text-rose-400 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Desconectar cuenta de Google Drive"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Desconectar</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 self-end flex-wrap">
                  <button
                    type="button"
                    onClick={handleUnlinkSheet}
                    className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline font-medium cursor-pointer"
                    title="Desvincular esta hoja si genera error al abrirse en Google Docs"
                  >
                    ✕ Desvincular hoja actual
                  </button>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <button
                    type="button"
                    onClick={() => setShowCustomLinkInput(true)}
                    className="text-[11px] text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 underline cursor-pointer"
                  >
                    ¿Vincular otra hoja?
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-stretch sm:items-end gap-2">
                <button
                  type="button"
                  onClick={handleConnectGoogle}
                  disabled={isGoogleLoading}
                  className="gsi-material-button shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                >
                  <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                      {isGoogleLoading ? (
                        <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
                      ) : (
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                          <path fill="none" d="M0 0h48v48H0z" />
                        </svg>
                      )}
                    </div>
                    <span className="gsi-material-button-contents font-semibold text-slate-800 dark:text-slate-100">
                      {isGoogleLoading ? 'Conectando con Google y creando hoja...' : 'Vincular Google Drive & Sheets'}
                    </span>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Crea la hoja central automáticamente
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <button
                    type="button"
                    onClick={() => setShowCustomLinkInput(!showCustomLinkInput)}
                    className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                  >
                    Vincular hoja existente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Cohort Table & Actions */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar aprendiz por nombre..."
                value={searchLearner}
                onChange={(e) => setSearchLearner(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === 'all' 
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Todos ({allAttempts.length})
              </button>
              <button
                onClick={() => setStatusFilter('passed')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === 'passed' 
                    ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 shadow-xs font-bold' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Aprobados ({allAttempts.filter(a => a.aprobado).length})
              </button>
              <button
                onClick={() => setStatusFilter('failed')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === 'failed' 
                    ? 'bg-white dark:bg-slate-900 text-rose-800 dark:text-rose-300 shadow-xs font-bold' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Requiere Refuerzo ({allAttempts.filter(a => !a.aprobado).length})
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="Generar e imprimir reporte PDF de aprendices"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Generar PDF Información de Aprendices</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simular Aprendiz</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Exportar Reporte (CSV)</span>
            </button>
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Aprendiz</th>
                <th className="py-3 px-4">Ficha</th>
                <th className="py-3 px-4">Fecha Examen</th>
                <th className="py-3 px-4 text-center">Identidad</th>
                <th className="py-3 px-4 text-center">Derechos</th>
                <th className="py-3 px-4 text-center">Deberes</th>
                <th className="py-3 px-4 text-center">Trámites</th>
                <th className="py-3 px-4 text-center">Calificación</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAttempts.map((attempt) => (
                <tr key={attempt.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {attempt.nombreAprendiz}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {attempt.ficha}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                    {attempt.fecha}
                  </td>
                  <td className="py-3.5 px-4 text-center tabular-nums text-slate-700 dark:text-slate-300">
                    {attempt.desgloseEjes.identidad}%
                  </td>
                  <td className="py-3.5 px-4 text-center tabular-nums text-slate-700 dark:text-slate-300">
                    {attempt.desgloseEjes.derechos}%
                  </td>
                  <td className="py-3.5 px-4 text-center tabular-nums text-slate-700 dark:text-slate-300">
                    {attempt.desgloseEjes.deberes}%
                  </td>
                  <td className="py-3.5 px-4 text-center tabular-nums text-slate-700 dark:text-slate-300">
                    {attempt.desgloseEjes.tramites}%
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-900 dark:text-white tabular-nums">
                    {attempt.puntaje}%
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {attempt.aprobado ? (
                      <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md text-[11px] border border-emerald-200 dark:border-emerald-800">
                        Aprobado
                      </span>
                    ) : (
                      <span className="text-rose-700 dark:text-rose-300 font-bold bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-md text-[11px] border border-rose-200 dark:border-rose-800">
                        Refuerzo
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedAttemptDetail(attempt)}
                      className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                      title="Ver respuestas del aprendiz"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredAttempts.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    No se encontraron aprendices con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detail Modal for an Attempt */}
      {selectedAttemptDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Detalle de Evaluación: {selectedAttemptDetail.nombreAprendiz}
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Ficha {selectedAttemptDetail.ficha} · {selectedAttemptDetail.fecha} · Calificación: {selectedAttemptDetail.puntaje}%
                </span>
              </div>
              <button
                onClick={() => setSelectedAttemptDetail(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-4 gap-2 text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Identidad</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedAttemptDetail.desgloseEjes.identidad}%</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Derechos</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedAttemptDetail.desgloseEjes.derechos}%</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Deberes</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedAttemptDetail.desgloseEjes.deberes}%</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Trámites</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedAttemptDetail.desgloseEjes.tramites}%</span>
                </div>
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white pt-2">Respuestas Registradas:</h4>
              <div className="space-y-2">
                {QUIZ_QUESTIONS.map((q) => {
                  const userAns = selectedAttemptDetail.respuestas[q.id];
                  const isCorrect = userAns === q.indiceCorrecto;
                  return (
                    <div
                      key={q.id}
                      className={`p-3 rounded-lg border ${
                        isCorrect 
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60' 
                          : 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60'
                      }`}
                    >
                      <div className="font-semibold text-slate-900 dark:text-white mb-1">
                        {q.enunciado}
                      </div>
                      <div className="text-slate-600 dark:text-slate-300">
                        Respuesta del aprendiz: {userAns !== undefined ? q.opciones[userAns] : 'No respondió'}
                      </div>
                      {!isCorrect && (
                        <div className="text-emerald-800 dark:text-emerald-400 font-semibold mt-0.5">
                          Correcta: {q.opciones[q.indiceCorrecto]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                onClick={() => setSelectedAttemptDetail(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg text-xs font-semibold"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulate apprentice modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Simular Evaluación de Nuevo Aprendiz
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLearner} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Nombre Completo del Aprendiz
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Laura Sofía Caicedo"
                  value={newLearnerName}
                  onChange={(e) => setNewLearnerName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Puntaje Obtenido en la Evaluación ({newLearnerScore}%)
                </label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="5"
                  value={newLearnerScore}
                  onChange={(e) => setNewLearnerScore(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px] mt-1">
                  <span>40% (Reprobado)</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">80% (Mínimo aprobatorio)</span>
                  <span>100% (Excelente)</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow-sm"
                >
                  Registrar Intento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Disconnecting Google Drive */}
      {showDisconnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 mb-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-950 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ¿Desconectar cuenta de Google Drive?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Se cerrará la sesión de la cuenta <strong>{syncStatus.userEmail}</strong>. Las nuevas respuestas de los aprendices se seguirán guardando de forma segura en la cola local de este navegador hasta que vuelvas a vincular una cuenta de Google.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowDisconnectModal(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDisconnect}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer"
              >
                Sí, Desconectar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webhook Apps Script Modal */}
      {showWebhookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/80 rounded-xl text-emerald-800 dark:text-emerald-300">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Sincronización Webhook (Google Apps Script)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sincroniza aprendices en tiempo real desde cualquier dispositivo o navegador
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWebhookModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-3.5 space-y-2">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                  Pasos sencillos para configurar en 1 minuto:
                </span>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  <li>Abre tu hoja en Google Sheets (o crea una nueva en <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-bold">sheets.new</a>).</li>
                  <li>Ve al menú superior: <strong>Extensiones &gt; Apps Script</strong>.</li>
                  <li>Borra el código que aparezca y pega el siguiente script:</li>
                </ol>

                <div className="relative">
                  <pre className="p-2.5 bg-slate-900 text-emerald-300 rounded-lg text-[10px] font-mono overflow-x-auto max-h-36">
                    {APPS_SCRIPT_TEMPLATE}
                  </pre>
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="absolute top-2 right-2 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedScript ? '¡Copiado!' : 'Copiar Código'}</span>
                  </button>
                </div>

                <ol start={4} className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  <li>Haz clic en el icono de guardar 💾 y luego en <strong>Implementar &gt; Nueva implementación</strong>.</li>
                  <li>Selecciona tipo <strong>Aplicación web</strong>, en <em>"Quién tiene acceso"</em> elige <strong>Cualquier usuario</strong> y haz clic en <strong>Implementar</strong>.</li>
                  <li>Copia la <strong>URL de la aplicación web</strong> y pégala aquí abajo:</li>
                </ol>
              </div>

              <form onSubmit={handleSaveWebhook} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    URL de la aplicación web (Webhook de Apps Script):
                  </label>
                  <input
                    type="url"
                    value={webhookUrlInput}
                    onChange={(e) => setWebhookUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {syncStatus.webhookUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        saveWebhookUrl(null);
                        setWebhookUrlInput('');
                        setShowWebhookModal(false);
                        setManualSyncMsg('Webhook desvinculado.');
                      }}
                      className="text-rose-600 hover:text-rose-700 text-xs font-medium underline"
                    >
                      Desvincular Webhook
                    </button>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => setShowWebhookModal(false)}
                      className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!webhookUrlInput.trim()}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Guardar Webhook
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
