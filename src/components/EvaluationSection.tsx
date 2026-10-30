import React, { useState } from 'react';
import { ApprenticeProfile, QuizAttempt, QuizQuestion } from '../types/induction';
import { QUIZ_QUESTIONS } from '../data/senaData';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, ArrowLeft, BookOpen, GraduationCap, ChevronRight, Cloud, RefreshCw } from 'lucide-react';
import { syncApprenticeRecord } from '../services/google';

interface EvaluationSectionProps {
  apprentice: ApprenticeProfile;
  onRecordAttempt: (attempt: QuizAttempt) => void;
  lastAttempt: QuizAttempt | null;
  onViewCertificate: () => void;
  onNavigateToSection: (sectionId: any) => void;
}

export const EvaluationSection: React.FC<EvaluationSectionProps> = ({
  apprentice,
  onRecordAttempt,
  lastAttempt,
  onViewCertificate,
  onNavigateToSection
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeAttempt, setActiveAttempt] = useState<QuizAttempt | null>(lastAttempt);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const isQuestionAnswered = selectedAnswers[currentQuestion.id] !== undefined;

  const handleSelectAnswer = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));

    // Trigger instant synchronization with Google Sheets in Google Drive
    setSyncNotice('Sincronizando con Google Sheets...');
    const isCorrect = optionIndex === currentQuestion.indiceCorrecto;
    syncApprenticeRecord({
      timestamp: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }),
      documento: `${apprentice.tipoDocumento}: ${apprentice.numeroDocumento}`,
      nombreAprendiz: apprentice.nombreCompleto,
      ficha: apprentice.ficha,
      programa: apprentice.programa,
      regionalCentro: `${apprentice.regional} - ${apprentice.centroFormacion}`,
      tipoRegistro: 'RESPUESTA_EVALUACION',
      moduloOPregunta: `Pregunta ${currentQuestionIndex + 1}: ${currentQuestion.enunciado}`,
      respuestaSeleccionada: currentQuestion.opciones[optionIndex],
      resultado: isCorrect ? 'CORRECTA' : 'INCORRECTA',
      progresoOPuntaje: `${Object.keys(selectedAnswers).length + (isQuestionAnswered ? 0 : 1)}/${totalQuestions}`,
      estadoGeneral: 'En Curso de Evaluación'
    }).then((synced) => {
      if (synced) {
        setSyncNotice('✓ Guardado en Google Sheets');
      } else {
        setSyncNotice('✓ Guardado en búfer local');
      }
      setTimeout(() => setSyncNotice(null), 2500);
    }).catch(() => {
      setSyncNotice('✓ Guardado en búfer local');
      setTimeout(() => setSyncNotice(null), 2500);
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateResults = (): QuizAttempt => {
    let totalCorrect = 0;
    const ejeCorrectCounts = {
      identidad: { total: 0, correct: 0 },
      derechos: { total: 0, correct: 0 },
      deberes: { total: 0, correct: 0 },
      tramites: { total: 0, correct: 0 },
    };

    QUIZ_QUESTIONS.forEach(q => {
      ejeCorrectCounts[q.eje].total += 1;
      const userChoice = selectedAnswers[q.id];
      if (userChoice === q.indiceCorrecto) {
        totalCorrect += 1;
        ejeCorrectCounts[q.eje].correct += 1;
      }
    });

    const score = Math.round((totalCorrect / totalQuestions) * 100);
    const passed = score >= 80;

    const desgloseEjes = {
      identidad: Math.round((ejeCorrectCounts.identidad.correct / ejeCorrectCounts.identidad.total) * 100),
      derechos: Math.round((ejeCorrectCounts.derechos.correct / ejeCorrectCounts.derechos.total) * 100),
      deberes: Math.round((ejeCorrectCounts.deberes.correct / ejeCorrectCounts.deberes.total) * 100),
      tramites: Math.round((ejeCorrectCounts.tramites.correct / ejeCorrectCounts.tramites.total) * 100),
    };

    const attempt: QuizAttempt = {
      id: `att-${Date.now()}`,
      aprendizId: apprentice.id,
      nombreAprendiz: apprentice.nombreCompleto,
      ficha: apprentice.ficha,
      programa: apprentice.programa,
      fecha: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }),
      puntaje: score,
      aprobado: passed,
      respuestas: selectedAnswers,
      desgloseEjes
    };

    return attempt;
  };

  const handleSubmitQuiz = () => {
    const attempt = calculateResults();
    setActiveAttempt(attempt);
    setIsSubmitted(true);
    onRecordAttempt(attempt);

    // Sync final exam attempt to Google Sheets
    syncApprenticeRecord({
      timestamp: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }),
      documento: `${apprentice.tipoDocumento}: ${apprentice.numeroDocumento}`,
      nombreAprendiz: apprentice.nombreCompleto,
      ficha: apprentice.ficha,
      programa: apprentice.programa,
      regionalCentro: `${apprentice.regional} - ${apprentice.centroFormacion}`,
      tipoRegistro: 'EVALUACION_FINAL',
      moduloOPregunta: 'Evaluación Formativa de Inducción SENA (Calificación Global)',
      respuestaSeleccionada: `${totalQuestions}/${totalQuestions} Preguntas Evaluadas`,
      resultado: attempt.aprobado ? 'APROBADO' : 'NO_APROBADO',
      progresoOPuntaje: `${attempt.puntaje}%`,
      estadoGeneral: attempt.aprobado ? 'Inducción Aprobada - Certificación Emitida' : 'Requiere Plan de Mejoramiento Formativo'
    }).catch(e => console.warn('Sync attempt queued:', e));

    if (attempt.aprobado) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setActiveAttempt(null);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === totalQuestions;

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Header Banner */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase">
              Evaluación Formativa de Apropiación
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Verificación de Conocimientos de Inducción
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Esta evaluación interactiva identifica si has interiorizado los principios institucionales, el Reglamento del Aprendiz vigente (Acuerdo 009 de 2024), tus derechos, deberes y trámites del SENA. Requiere un mínimo del <strong>80% (10 de 12 preguntas)</strong> para aprobar y obtener tu certificación.
            </p>
          </div>

          {!isSubmitted && (
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center shrink-0">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Respondidas</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                {answeredCount} / {totalQuestions}
              </span>
              <div className="w-28 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 mx-auto overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. Question View OR Results View */}
      {!isSubmitted ? (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          {/* Question Stepper Indicator */}
          <div className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">
                Eje: {currentQuestion.eje.toUpperCase()}
              </span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-slate-600 dark:text-slate-300 font-semibold">
                Pregunta {currentQuestionIndex + 1} de {totalQuestions}
              </span>
              {syncNotice && (
                <>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 text-[11px] animate-in fade-in">
                    <Cloud className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    {syncNotice}
                  </span>
                </>
              )}
            </div>

            {/* Quick Question Jump Buttons */}
            <div className="hidden sm:flex items-center gap-1">
              {QUIZ_QUESTIONS.map((q, idx) => {
                const answered = selectedAnswers[q.id] !== undefined;
                const isCurrent = currentQuestionIndex === idx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-6 h-6 rounded-md text-xs font-semibold flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-slate-900 dark:bg-emerald-600 text-white ring-2 ring-slate-900 dark:ring-emerald-500'
                        : answered
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              {currentQuestion.contextoOpcional && (
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mb-1">
                  Contexto: {currentQuestion.contextoOpcional}
                </span>
              )}
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {currentQuestion.enunciado}
              </h2>
            </div>

            {/* Options list */}
            <div className="space-y-3">
              {currentQuestion.opciones.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectAnswer(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 ring-2 ring-emerald-600 text-slate-900 dark:text-white'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {isSelected ? (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-medium leading-relaxed">
                      {option}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={handlePrevious}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  currentQuestionIndex === 0
                    ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>

              <div className="flex items-center gap-3">
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Siguiente</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    disabled={!isAllAnswered}
                    onClick={handleSubmitQuiz}
                    className={`px-6 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm ${
                      isAllAnswered
                        ? 'bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white cursor-pointer'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <span>Finalizar y Calificar</span>
                    <Award className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {!isAllAnswered && currentQuestionIndex === totalQuestions - 1 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 text-right">
                * Aún tienes preguntas sin responder ({totalQuestions - answeredCount} pendientes).
              </p>
            )}
          </div>
        </section>
      ) : (
        /* Results View */
        <section className="space-y-8 animate-in fade-in duration-200">
          {/* Result Score Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Score circle */}
              <div className="md:col-span-4 text-center border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
                <div
                  className={`w-32 h-32 rounded-full mx-auto flex flex-col items-center justify-center border-4 ${
                    activeAttempt?.aprobado
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100'
                      : 'border-rose-400 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100'
                  }`}
                >
                  <span className="text-3xl font-extrabold tabular-nums">
                    {activeAttempt?.puntaje}%
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Puntaje Final
                  </span>
                </div>

                <div className="mt-4">
                  {activeAttempt?.aprobado ? (
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/50 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>APROPIACIÓN LOGRADA</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-900/50 px-3 py-1 rounded-full">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>REQUIERE REFUERZO (MÍNIMO 80%)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Diagnosis and details */}
              <div className="md:col-span-8 space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {activeAttempt?.aprobado
                    ? '¡Felicitaciones! Has apropiado con éxito la Inducción SENA'
                    : 'Has completado la evaluación, pero aún requieres reforzar conceptos clave'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeAttempt?.aprobado
                    ? `Aprendiz ${apprentice.nombreCompleto}, has demostrado un dominio sólido de la identidad, derechos y normas de convivencia del SENA. Tu constancia oficial de inducción ya se encuentra disponible.`
                    : 'Para garantizar que disfrutes plenamente de tu etapa lectiva y cumplas con tus compromisos, te sugerimos revisar los módulos temáticos indicados a continuación y presentar nuevamente la evaluación.'}
                </p>

                {/* Ejes Breakdown */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                    Apropiación por Ejes Temáticos:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Identidad</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm tabular-nums">
                        {activeAttempt?.desgloseEjes.identidad}%
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Derechos</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm tabular-nums">
                        {activeAttempt?.desgloseEjes.derechos}%
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Deberes</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm tabular-nums">
                        {activeAttempt?.desgloseEjes.deberes}%
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Trámites</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm tabular-nums">
                        {activeAttempt?.desgloseEjes.tramites}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 pt-3 flex-wrap">
                  {activeAttempt?.aprobado && (
                    <button
                      onClick={onViewCertificate}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Ver y Descargar Certificado Oficial</span>
                    </button>
                  )}

                  <button
                    onClick={handleRetake}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Presentar Nueva Evaluación</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Revisión Pedagógica Pregunta por Pregunta
            </h4>

            <div className="space-y-4">
              {QUIZ_QUESTIONS.map((q, idx) => {
                const userChoice = activeAttempt?.respuestas[q.id];
                const isCorrect = userChoice === q.indiceCorrecto;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 ${
                      isCorrect 
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60' 
                        : 'bg-rose-50/40 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                        )}
                        <span className="font-bold text-slate-900 dark:text-white">
                          {idx + 1}. {q.enunciado}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono uppercase shrink-0">
                        {q.eje}
                      </span>
                    </div>

                    <div className="pl-6 space-y-1">
                      <div className="text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">Tu respuesta: </span>
                        {userChoice !== undefined ? q.opciones[userChoice] : 'Sin responder'}
                      </div>
                      {!isCorrect && (
                        <div className="text-emerald-800 dark:text-emerald-400 font-semibold">
                          <span>Respuesta correcta: </span>
                          {q.opciones[q.indiceCorrecto]}
                        </div>
                      )}
                      <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                        <strong>Fundamento: </strong> {q.explicacion} ({q.articuloReglamento})
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
