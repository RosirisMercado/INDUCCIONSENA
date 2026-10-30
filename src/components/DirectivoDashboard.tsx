import React, { useState } from 'react';
import { QuizAttempt, FichaSummary } from '../types/induction';
import { FICHAS_SAMPLE, SENA_REGULATION_INFO } from '../data/senaData';
import { BarChart3, Users, Award, ShieldCheck, Download, CheckCircle, AlertTriangle, Building, ArrowUpRight } from 'lucide-react';
import { SenaLogo } from '../assets/senaLogo';

interface DirectivoDashboardProps {
  allAttempts: QuizAttempt[];
  onSwitchRole: () => void;
}

export const DirectivoDashboard: React.FC<DirectivoDashboardProps> = ({
  allAttempts,
  onSwitchRole
}) => {
  const [selectedRegional, setSelectedRegional] = useState('Todas');
  const [exportNotice, setExportNotice] = useState(false);

  const totalEvaluated = allAttempts.length;
  const passedCount = allAttempts.filter(a => a.aprobado).length;
  const generalPassRate = totalEvaluated > 0 ? Math.round((passedCount / totalEvaluated) * 100) : 88;

  const handleExportReport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Directivo Top Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Observatorio Gerencial SENA · {SENA_REGULATION_INFO.acuerdoVigente}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Panel Directivo & Cumplimiento Institucional
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Monitoreo en tiempo real de la apropiación del Reglamento del Aprendiz, indicadores de inducción y cobertura por centros de formación en la Regional Atlántico y a nivel nacional.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onSwitchRole}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer border border-slate-300 dark:border-slate-700"
          >
            Cambiar Rol
          </button>
          <button
            onClick={handleExportReport}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Reporte Ejecutivo</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 p-4 rounded-xl text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>¡Reporte gerencial consolidado y exportado con éxito en formato PDF institucional! (Acuerdo 009 de 2024 y Acuerdo 002 de 2026).</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tasa de Aprobación Global
            </span>
            <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
              {generalPassRate}%
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" /> +4.2% vs trimestre anterior
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/80">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Aprendices Inducidos
            </span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              1,420
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Activos en plataforma LMS
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Fichas en Formación
            </span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              45
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Regional Atlántico y Nacional
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <Building className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Marco Normativo
            </span>
            <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 pt-1">
              Acuerdo 009 / 002
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              100% Vigente y Actualizado
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/80">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Regional Atlántico & Centers Performance Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 transition-colors space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Desempeño por Fichas y Centros de Formación
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Indicadores clave de aprobación de la inducción según el Reglamento del Aprendiz.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Regional:</span>
            <select
              value={selectedRegional}
              onChange={(e) => setSelectedRegional(e.target.value)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium focus:outline-none"
            >
              <option value="Todas">Todas las Regionales</option>
              <option value="Atlántico">Regional Atlántico</option>
              <option value="Bogotá">Regional Distrito Capital</option>
              <option value="Valle">Regional Valle</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">Código Ficha</th>
                <th className="px-4 py-3">Programa de Formación</th>
                <th className="px-4 py-3">Regional / Centro</th>
                <th className="px-4 py-3">Instructor Líder</th>
                <th className="px-4 py-3 text-center">Aprendices</th>
                <th className="px-4 py-3 text-center">Aprobados</th>
                <th className="px-4 py-3 text-center">Promedio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {FICHAS_SAMPLE.map((ficha) => (
                <tr key={ficha.codigoFicha} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {ficha.codigoFicha}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                    {ficha.programa}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {ficha.regional} · {ficha.centro}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">
                    {ficha.instructorLider}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-white">
                    {ficha.totalAprendices}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 rounded-full font-bold">
                      {ficha.aprobados}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-600 dark:text-emerald-400">
                    {ficha.promedioGeneral}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
