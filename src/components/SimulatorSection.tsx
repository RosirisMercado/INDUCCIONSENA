import React, { useState } from 'react';
import { CASE_STUDIES } from '../data/senaData';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, ChevronRight, Check } from 'lucide-react';

interface SimulatorSectionProps {
  onMarkRead: () => void;
  isRead: boolean;
  onNextSection: () => void;
}

export const SimulatorSection: React.FC<SimulatorSectionProps> = ({
  onMarkRead,
  isRead,
  onNextSection
}) => {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [resolvedCases, setResolvedCases] = useState<Record<string, { optionId: string; isCorrect: boolean }>>({});

  const currentCase = CASE_STUDIES[currentCaseIndex];
  const selectedOption = currentCase.opciones.find(o => o.id === selectedOptionId);
  const isCaseAlreadyAnswered = !!resolvedCases[currentCase.id];

  const handleSelectOption = (optionId: string) => {
    if (showFeedback || isCaseAlreadyAnswered) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitDecision = () => {
    if (!selectedOptionId) return;
    const chosen = currentCase.opciones.find(o => o.id === selectedOptionId)!;
    setShowFeedback(true);
    setResolvedCases(prev => ({
      ...prev,
      [currentCase.id]: { optionId: selectedOptionId, isCorrect: chosen.esCorrecta }
    }));
  };

  const handleNextCase = () => {
    if (currentCaseIndex < CASE_STUDIES.length - 1) {
      setCurrentCaseIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setShowFeedback(false);
    }
  };

  const handlePreviousCase = () => {
    if (currentCaseIndex > 0) {
      setCurrentCaseIndex(prev => prev - 1);
      setSelectedOptionId(null);
      setShowFeedback(false);
    }
  };

  const handleResetSimulator = () => {
    setResolvedCases({});
    setSelectedOptionId(null);
    setShowFeedback(false);
    setCurrentCaseIndex(0);
  };

  const totalAnswered = Object.keys(resolvedCases).length;
  const totalCorrect = Object.values(resolvedCases).filter(c => c.isCorrect).length;

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Header */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase">
            Laboratorio de Toma de Decisiones
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Simulador de Dilemas y Casos Reales
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Afronta situaciones cotidianas vividas por aprendices en los centros de formación y empresas aliadas. Aprende a tomar las decisiones correctas con base en los principios éticos y el Reglamento del Aprendiz SENA.
          </p>
        </div>
      </section>

      {/* 2. Simulator Stage */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Stage Top Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">Dilema {currentCaseIndex + 1} de {CASE_STUDIES.length}:</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">{currentCase.titulo}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 dark:text-slate-400 font-mono">
              Resueltos: {totalAnswered}/{CASE_STUDIES.length} (Aciertos: {totalCorrect})
            </span>
            {totalAnswered > 0 && (
              <button
                onClick={handleResetSimulator}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar</span>
              </button>
            )}
          </div>
        </div>

        {/* Case Narrative */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 rounded-xl p-5">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block mb-1">
              Situación Planteada
            </span>
            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              "{currentCase.contexto}"
            </p>
            <div className="mt-3 pt-3 border-t border-emerald-100/80 dark:border-emerald-900/60 text-xs font-bold text-emerald-900 dark:text-emerald-300">
              Pregunta de Acción: {currentCase.situacion}
            </div>
          </div>

          {/* Decision Options */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              ¿Cuál camino eliges?
            </h4>

            <div className="space-y-2.5">
              {currentCase.opciones.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const answeredData = resolvedCases[currentCase.id];
                const isThisAnswered = answeredData?.optionId === option.id;
                const isCorrectOption = option.esCorrecta;

                let borderStyle = 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-800/60';
                if (showFeedback || isCaseAlreadyAnswered) {
                  if (isCorrectOption) {
                    borderStyle = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 ring-1 ring-emerald-500';
                  } else if (isThisAnswered || isSelected) {
                    borderStyle = 'border-rose-400 bg-rose-50/80 dark:bg-rose-950/50 ring-1 ring-rose-400';
                  }
                } else if (isSelected) {
                  borderStyle = 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/60 ring-2 ring-emerald-600';
                }

                return (
                  <button
                    key={option.id}
                    disabled={showFeedback || isCaseAlreadyAnswered}
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${borderStyle}`}
                  >
                    <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                      {isSelected && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />}
                    </div>
                    <div className="flex-1 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                      {option.texto}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          {!showFeedback && !isCaseAlreadyAnswered && (
            <div className="pt-2">
              <button
                disabled={!selectedOptionId}
                onClick={handleSubmitDecision}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  selectedOptionId
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                Confirmar Decisión
              </button>
            </div>
          )}

          {/* Feedback Card */}
          {(showFeedback || isCaseAlreadyAnswered) && (
            <div
              className={`p-5 rounded-xl border animate-in fade-in duration-200 space-y-3 ${
                (selectedOption?.esCorrecta || resolvedCases[currentCase.id]?.isCorrect)
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                  : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-100'
              }`}
            >
              <div className="flex items-center gap-2">
                {(selectedOption?.esCorrecta || resolvedCases[currentCase.id]?.isCorrect) ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-bold text-sm text-emerald-900 dark:text-emerald-300">
                      ¡Decisión Conforme al Reglamento del Aprendiz!
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span className="font-bold text-sm text-rose-900 dark:text-rose-300">
                      Decisión Incorrecta o Contraria al Reglamento
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedOption?.retroalimentacion ||
                  currentCase.opciones.find(o => o.id === resolvedCases[currentCase.id]?.optionId)?.retroalimentacion}
              </p>

              <div className="text-xs pt-2 border-t border-slate-200/60 dark:border-slate-800 font-medium text-slate-600 dark:text-slate-400">
                <span className="font-bold text-slate-900 dark:text-white">Fundamento Reglamentario: </span>
                {selectedOption?.fundamentoReglamento ||
                  currentCase.opciones.find(o => o.esCorrecta)?.fundamentoReglamento}
              </div>

              <div className="flex items-center justify-between pt-2">
                {currentCaseIndex > 0 ? (
                  <button
                    onClick={handlePreviousCase}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Dilema Anterior
                  </button>
                ) : <div />}

                {currentCaseIndex < CASE_STUDIES.length - 1 ? (
                  <button
                    onClick={handleNextCase}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <span>Siguiente Dilema</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={onNextSection}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <span>Ir a la Evaluación Oficial</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Action Footer */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg font-bold text-white">¿Listo para la Evaluación de Apropiación?</h4>
          <p className="text-xs text-slate-300 mt-1">
            Demuestra que interiorizaste los principios del SENA. Al obtener 80% o más, generarás tu Certificado Oficial de Inducción.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onMarkRead}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all ${
              isRead
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{isRead ? 'Simulador Completado' : 'Marcar como Completado'}</span>
          </button>

          <button
            onClick={onNextSection}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <span>Iniciar Evaluación</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
