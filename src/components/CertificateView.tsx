import React, { useState } from 'react';
import { ApprenticeProfile, QuizAttempt } from '../types/induction';
import { Printer, Copy, Check, ArrowLeft, ShieldCheck } from 'lucide-react';
import { SenaLogo, SenaShield } from '../assets/senaLogo';

interface CertificateViewProps {
  apprentice: ApprenticeProfile;
  attempt: QuizAttempt;
  onBack: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  apprentice,
  attempt,
  onBack
}) => {
  const [copied, setCopied] = useState(false);
  const certCode = `SENA-IND-2026-${apprentice.ficha}-${attempt.id.slice(-5).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`Constancia SENA: ${certCode} - Aprendiz: ${apprentice.nombreCompleto}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top action bar (hidden during print) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al menú</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyCode}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Código copiado' : 'Copiar Registro'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / Guardar PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Certificate Frame */}
      <div
        id="certificate-print-area"
        className="bg-white border-8 border-emerald-800 p-8 sm:p-12 rounded-2xl shadow-md max-w-4xl mx-auto relative overflow-hidden"
      >
        {/* Subtle decorative watermark/border */}
        <div className="border-2 border-emerald-600 p-6 sm:p-8 rounded-lg relative">
          {/* Header */}
          <div className="text-center space-y-2 pb-6 border-b border-emerald-800/20">
            <div className="flex items-center justify-center gap-8 mb-3">
              <SenaShield className="w-18 h-18 sm:w-20 sm:h-20" />
              <div className="h-12 w-px bg-slate-300" />
              <SenaLogo className="w-18 h-18 sm:w-20 sm:h-20" />
            </div>
            <div className="text-xs font-bold tracking-widest text-slate-700 uppercase">
              República de Colombia · Ministerio del Trabajo
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight">
              SERVICIO NACIONAL DE APRENDIZAJE - SENA
            </h2>
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              {apprentice.regional} · {apprentice.centroFormacion}
            </div>
          </div>

          {/* Body */}
          <div className="py-8 text-center space-y-6">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-900 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              Constancia Oficial de Apropiación e Inducción
            </span>

            <p className="text-sm text-slate-600">
              La Coordinación Académica y el Equipo de Inducción del Centro certifican que:
            </p>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 underline decoration-emerald-600 decoration-2 underline-offset-8">
                {apprentice.nombreCompleto}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 pt-2 font-mono">
                Identificado(a) con {apprentice.tipoDocumento} No. {apprentice.numeroDocumento}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed">
              Ha cursado, participado y aprobado satisfactoriamente el proceso de <strong>Inducción Institucional Integral</strong>, evidenciando apropiación del valor y la imagen institucional, símbolos del SENA, el Reglamento del Aprendiz vigente (<strong>Acuerdo 009 de 2024</strong>: derechos, deberes, prohibiciones y enfoque diferencial), los canales de Bienestar y los procedimientos de novedades de matrícula, con una calificación del <strong className="text-emerald-800 text-base">{attempt.puntaje}%</strong>.
            </p>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left max-w-2xl mx-auto pt-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Programa de Formación:</span>
                <span className="font-semibold text-slate-900">{apprentice.programa}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Ficha de Caracterización:</span>
                <span className="font-semibold text-slate-900">{apprentice.ficha}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Fecha de Aprobación:</span>
                <span className="font-semibold text-slate-900">{attempt.fecha}</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 mt-4 border-t border-emerald-800/20 text-center">
            <div className="space-y-1">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif italic text-emerald-800 font-bold text-lg">Rodrigo Mercado V.</span>
              </div>
              <div className="w-48 h-px bg-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-800">Líder / Gestor de Inducción</div>
              <div className="text-[11px] text-slate-500">Coordinación de Formación Profesional</div>
            </div>

            <div className="space-y-1">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif italic text-emerald-800 font-bold text-lg">Claudia Patricia Silva</span>
              </div>
              <div className="w-48 h-px bg-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-800">Subdirección de Centro</div>
              <div className="text-[11px] text-slate-500">SENA · Regional {apprentice.regional}</div>
            </div>
          </div>

          {/* Verification footer */}
          <div className="pt-6 mt-6 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Código Único de Registro: <strong className="font-mono text-slate-800">{certCode}</strong></span>
            </div>
            <div>
              Verificación válida en el Sistema de Gestión de Inducción SENA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
