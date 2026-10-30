import React, { useState, useEffect } from 'react';
import { ApprenticeProfile, SectionId } from '../types/induction';
import { CheckCircle2, User, Building, BookOpen, Edit3, X, Cloud, RefreshCw } from 'lucide-react';
import { SenaLogo } from '../assets/senaLogo';
import { subscribeSyncStatus, SyncStatus } from '../services/google';

interface ApprenticeHeaderProps {
  apprentice: ApprenticeProfile;
  onUpdateApprentice: (updated: ApprenticeProfile) => void;
  progressPercent: number;
  hasPassedQuiz: boolean;
  onNavigateToQuiz: () => void;
  currentSection: SectionId;
}

export const ApprenticeHeader: React.FC<ApprenticeHeaderProps> = ({
  apprentice,
  onUpdateApprentice,
  progressPercent,
  hasPassedQuiz,
  onNavigateToQuiz
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ApprenticeProfile>(apprentice);
  const [syncInfo, setSyncInfo] = useState<SyncStatus>({
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

  useEffect(() => {
    const unsub = subscribeSyncStatus((s) => setSyncInfo(s));
    return () => unsub();
  }, []);

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateApprentice(formData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 overflow-hidden">
          {/* Left: Apprentice details */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700">
                <User className="w-6 h-6 text-emerald-800 dark:text-emerald-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5 shadow-xs border border-slate-200 dark:border-slate-700">
                <SenaLogo className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {apprentice.nombreCompleto}
                </h1>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {apprentice.tipoDocumento}: {apprentice.numeroDocumento}
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                  title="Personalizar datos para certificación"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Editar datos</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  Ficha {apprentice.ficha} · {apprentice.programa}
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  {apprentice.regional} · {apprentice.centroFormacion}
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                {syncInfo.isSyncing ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <RefreshCw className="w-3 h-3 animate-spin text-emerald-600 dark:text-emerald-400" />
                    <span>Sincronizando con Google Sheets...</span>
                  </span>
                ) : (syncInfo.isConnected || syncInfo.webhookUrl || syncInfo.spreadsheetId) ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800" title={`Sincronizado con Google Drive (${syncInfo.userEmail || 'Hoja central de ficha'})`}>
                    <Cloud className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Google Sheets en vivo ({syncInfo.totalSyncedCount} reg.)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700" title="Las respuestas se guardan en el búfer seguro local y se sincronizan con la hoja central">
                    <Cloud className="w-3 h-3 text-slate-400" />
                    <span>Búfer seguro (Google Drive activo)</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Circular Progress status & CTA */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl px-4 py-2.5 shrink-0 transition-colors">
            {/* Circular Animated Progress */}
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 flex items-center justify-center">
                <svg className="w-11 h-11 transform -rotate-90">
                  <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3.5"
                    className="text-slate-200 dark:text-slate-700 fill-none"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="text-emerald-600 dark:text-emerald-400 fill-none transition-all duration-500 ease-out"
                  />
                </svg>
                <span className="absolute text-[11px] font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {progressPercent}%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Progreso de Inducción</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {hasPassedQuiz ? 'Evaluación aprobada' : 'Módulos & Evaluación'}
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

            {hasPassedQuiz ? (
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Inducción Aprobada</span>
              </div>
            ) : (
              <button
                onClick={onNavigateToQuiz}
                className="text-xs px-3 py-1.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap shadow-sm cursor-pointer"
              >
                Presentar Evaluación
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Personalizar Datos del Aprendiz
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Nombre Completo del Aprendiz
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombreCompleto}
                  onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Tipo Doc.
                  </label>
                  <select
                    value={formData.tipoDocumento}
                    onChange={(e) => setFormData({ ...formData, tipoDocumento: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="CC">Cédula (CC)</option>
                    <option value="TI">Tarjeta Identidad (TI)</option>
                    <option value="PPT">Permiso Temp. (PPT)</option>
                    <option value="CE">Cédula Ext. (CE)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.numeroDocumento}
                    onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Número de Ficha
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ficha}
                    onChange={(e) => setFormData({ ...formData, ficha: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Programa de Formación
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.programa}
                    onChange={(e) => setFormData({ ...formData, programa: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Regional
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.regional}
                    onChange={(e) => setFormData({ ...formData, regional: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Centro de Formación
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.centroFormacion}
                    onChange={(e) => setFormData({ ...formData, centroFormacion: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow-sm cursor-pointer"
                >
                  Guardar Datos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
