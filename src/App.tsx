import React, { useState, useEffect } from 'react';
import { ApprenticeProfile, QuizAttempt, SectionId } from './types/induction';
import { INITIAL_APPRENTICE, INITIAL_ATTEMPTS } from './data/senaData';
import { LandingPage } from './components/LandingPage';
import { DirectivoDashboard } from './components/DirectivoDashboard';
import { Navbar } from './components/Navbar';
import { ApprenticeHeader } from './components/ApprenticeHeader';
import { IntroduccionSection } from './components/IntroduccionSection';
import { IdentitySection } from './components/IdentitySection';
import { RightsDutiesSection } from './components/RightsDutiesSection';
import { ProceduresBienestarSection } from './components/ProceduresBienestarSection';
import { SimulatorSection } from './components/SimulatorSection';
import { EvaluationSection } from './components/EvaluationSection';
import { CertificateView } from './components/CertificateView';
import { InstructorDashboard } from './components/InstructorDashboard';
import { SenaLogo } from './assets/senaLogo';
import { initGoogleAuth, syncApprenticeRecord } from './services/google';

export default function App() {
  const [userRole, setUserRole] = useState<'landing' | 'aprendiz' | 'instructor' | 'directivo'>('landing');
  const [currentSection, setCurrentSection] = useState<SectionId>('introduccion');
  const [apprentice, setApprentice] = useState<ApprenticeProfile>(INITIAL_APPRENTICE);
  const [allAttempts, setAllAttempts] = useState<QuizAttempt[]>(INITIAL_ATTEMPTS);
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('sena_theme') === 'dark';
  });
  const [isTransitioningTheme, setIsTransitioningTheme] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Initialize Google Auth state listener
    const unsub = initGoogleAuth();
    return () => {
      if (unsub) unsub();
    };
  }, []);

  const handleToggleTheme = () => {
    setIsTransitioningTheme(true);
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('sena_theme', next ? 'dark' : 'light');
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });

    setTimeout(() => {
      setIsTransitioningTheme(false);
    }, 450);
  };
  
  // Track read modules
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>({
    'identidad': false,
    'derechos-deberes': false,
    'tramites-bienestar': false,
    'simulador': false
  });

  // Apprentice's own attempts
  const apprenticeAttempts = allAttempts.filter(a => a.aprendizId === apprentice.id);
  const latestApprenticeAttempt = apprenticeAttempts.length > 0
    ? apprenticeAttempts[apprenticeAttempts.length - 1]
    : null;

  const hasPassedQuiz = apprenticeAttempts.some(a => a.aprobado);

  // Compute progress percentage
  const totalSteps = 5; // 4 content modules + quiz
  let finishedSteps = 0;
  if (completedModules['identidad']) finishedSteps++;
  if (completedModules['derechos-deberes']) finishedSteps++;
  if (completedModules['tramites-bienestar']) finishedSteps++;
  if (completedModules['simulador']) finishedSteps++;
  if (hasPassedQuiz) finishedSteps++;
  const progressPercent = Math.round((finishedSteps / totalSteps) * 100);

  const handleSelectRole = (role: 'aprendiz' | 'instructor' | 'directivo') => {
    setUserRole(role);
    if (role === 'instructor') {
      setCurrentSection('gestion-instructor');
    } else {
      setCurrentSection('introduccion');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleInstructorMode = () => {
    if (userRole === 'instructor') {
      setUserRole('aprendiz');
      setCurrentSection('introduccion');
    } else {
      setUserRole('instructor');
      setCurrentSection('gestion-instructor');
    }
  };

  const handleSelectSection = (section: SectionId) => {
    if (section === 'gestion-instructor') {
      setUserRole('instructor');
    } else {
      setUserRole('aprendiz');
    }
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRecordAttempt = (attempt: QuizAttempt) => {
    setAllAttempts(prev => [attempt, ...prev]);
  };

  const handleSimulateApprenticeAttempt = (name: string, score: number) => {
    const passed = score >= 80;
    const newAttempt: QuizAttempt = {
      id: `att-${Date.now()}`,
      aprendizId: `apr-${Date.now()}`,
      nombreAprendiz: name,
      ficha: apprentice.ficha,
      programa: apprentice.programa,
      fecha: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }),
      puntaje: score,
      aprobado: passed,
      respuestas: {},
      desgloseEjes: {
        identidad: Math.min(100, score + 5),
        derechos: Math.max(50, score - 5),
        deberes: score,
        tramites: Math.min(100, score + 2)
      }
    };
    setAllAttempts(prev => [newAttempt, ...prev]);

    // Sync simulated learner to Google Sheets
    syncApprenticeRecord({
      timestamp: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }),
      documento: 'CC: Simulado',
      nombreAprendiz: name,
      ficha: apprentice.ficha,
      programa: apprentice.programa,
      regionalCentro: `${apprentice.regional} - ${apprentice.centroFormacion}`,
      tipoRegistro: 'EVALUACION_FINAL',
      moduloOPregunta: 'Evaluación Formativa de Inducción (Registro por Instructor)',
      respuestaSeleccionada: 'Registro de Calificación Cohorte',
      resultado: passed ? 'APROBADO' : 'NO_APROBADO',
      progresoOPuntaje: `${score}%`,
      estadoGeneral: passed ? 'Inducción Aprobada' : 'Requiere Plan de Mejoramiento'
    }).catch(() => {});
  };

  const markModuleCompleted = (key: string) => {
    setCompletedModules(prev => {
      if (prev[key]) return prev;
      return {
        ...prev,
        [key]: true
      };
    });

    const moduleTitles: Record<string, string> = {
      'identidad': 'Módulo 1: Identidad SENA (Historia, Símbolos, Regional Atlántico)',
      'derechos-deberes': 'Módulo 2: Derechos y Deberes (Acuerdo 009/2024 & 002/2026)',
      'tramites-bienestar': 'Módulo 3: Trámites Académicos y Servicios de Bienestar',
      'simulador': 'Módulo 4: Simulador de Faltas y Casos Prácticos'
    };

    syncApprenticeRecord({
      timestamp: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }),
      documento: `${apprentice.tipoDocumento}: ${apprentice.numeroDocumento}`,
      nombreAprendiz: apprentice.nombreCompleto,
      ficha: apprentice.ficha,
      programa: apprentice.programa,
      regionalCentro: `${apprentice.regional} - ${apprentice.centroFormacion}`,
      tipoRegistro: 'MODULO_COMPLETADO',
      moduloOPregunta: moduleTitles[key] || `Módulo ${key}`,
      respuestaSeleccionada: 'Módulo estudiado y aprobado',
      resultado: 'COMPLETADO',
      progresoOPuntaje: `${progressPercent}%`,
      estadoGeneral: 'En Proceso de Inducción'
    }).catch(() => {});
  };

  if (userRole === 'landing') {
    return (
      <LandingPage
        onSelectRole={handleSelectRole}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100 selection:bg-emerald-200 dark:selection:bg-emerald-900/60 transition-colors duration-300 relative ${
      isTransitioningTheme ? 'theme-blur-active' : ''
    }`}>
      {/* Visual blur effect scrim during theme transition */}
      {isTransitioningTheme && (
        <div 
          className="fixed inset-0 z-50 pointer-events-none backdrop-blur-md bg-white/20 dark:bg-black/30 transition-all duration-300 animate-in fade-in"
          aria-hidden="true"
        />
      )}

      {/* 1. Official Top Navigation Bar */}
      <Navbar
        currentSection={currentSection}
        onSelectSection={handleSelectSection}
        isInstructorMode={userRole === 'instructor'}
        onToggleInstructorMode={handleToggleInstructorMode}
        hasPassedQuiz={hasPassedQuiz}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Role Banner / Switcher bar */}
      <div className="bg-emerald-900 text-white py-2 px-4 text-xs font-medium flex items-center justify-between no-print">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Rol Activo: <strong className="uppercase">{userRole}</strong> (SENA Regional Atlántico)</span>
          </div>
          <button
            onClick={() => setUserRole('landing')}
            className="text-emerald-200 hover:text-white underline cursor-pointer font-bold"
          >
            ← Volver a Selección de Roles (Landing Page)
          </button>
        </div>
      </div>

      {/* 2. Apprentice Context Banner (visible in apprentice mode, hidden in print) */}
      {userRole === 'aprendiz' && currentSection !== 'certificado' && (
        <div className="no-print">
          <ApprenticeHeader
            apprentice={apprentice}
            onUpdateApprentice={setApprentice}
            progressPercent={progressPercent}
            hasPassedQuiz={hasPassedQuiz}
            onNavigateToQuiz={() => handleSelectSection('evaluacion')}
            currentSection={currentSection}
          />
        </div>
      )}

      {/* 3. Main Stage Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {userRole === 'directivo' ? (
          <DirectivoDashboard
            allAttempts={allAttempts}
            onSwitchRole={() => setUserRole('landing')}
          />
        ) : userRole === 'instructor' || currentSection === 'gestion-instructor' ? (
          <InstructorDashboard
            allAttempts={allAttempts}
            onSimulateApprenticeAttempt={handleSimulateApprenticeAttempt}
          />
        ) : (
          <>
            {currentSection === 'introduccion' && (
              <IntroduccionSection
                apprentice={apprentice}
                onStartModule={handleSelectSection}
                progressPercent={progressPercent}
                completedModules={completedModules}
                hasPassedQuiz={hasPassedQuiz}
              />
            )}

            {currentSection === 'identidad' && (
              <IdentitySection
                onMarkRead={() => markModuleCompleted('identidad')}
                isRead={!!completedModules['identidad']}
                onNextSection={() => {
                  markModuleCompleted('identidad');
                  handleSelectSection('derechos-deberes');
                }}
              />
            )}

            {currentSection === 'derechos-deberes' && (
              <RightsDutiesSection
                onMarkRead={() => markModuleCompleted('derechos-deberes')}
                isRead={!!completedModules['derechos-deberes']}
                onNextSection={() => {
                  markModuleCompleted('derechos-deberes');
                  handleSelectSection('tramites-bienestar');
                }}
              />
            )}

            {currentSection === 'tramites-bienestar' && (
              <ProceduresBienestarSection
                onMarkRead={() => markModuleCompleted('tramites-bienestar')}
                isRead={!!completedModules['tramites-bienestar']}
                onNextSection={() => {
                  markModuleCompleted('tramites-bienestar');
                  handleSelectSection('simulador');
                }}
              />
            )}

            {currentSection === 'simulador' && (
              <SimulatorSection
                onMarkRead={() => markModuleCompleted('simulador')}
                isRead={!!completedModules['simulador']}
                onNextSection={() => {
                  markModuleCompleted('simulador');
                  handleSelectSection('evaluacion');
                }}
              />
            )}

            {currentSection === 'evaluacion' && (
              <EvaluationSection
                apprentice={apprentice}
                onRecordAttempt={handleRecordAttempt}
                lastAttempt={latestApprenticeAttempt}
                onViewCertificate={() => handleSelectSection('certificado')}
                onNavigateToSection={handleSelectSection}
              />
            )}

            {currentSection === 'certificado' && latestApprenticeAttempt && (
              <CertificateView
                apprentice={apprentice}
                attempt={latestApprenticeAttempt}
                onBack={() => handleSelectSection('introduccion')}
              />
            )}
          </>
        )}
      </main>

      {/* 4. Footer */}
      <footer className="no-print bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SenaLogo className="w-7 h-7" />
            <span className="font-medium text-slate-700 dark:text-slate-200">
              Servicio Nacional de Aprendizaje SENA · Colombia · Ministerio del Trabajo
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-slate-400 dark:text-slate-500">Reglamento del Aprendiz (Acuerdo 009 de 2024 Vigente)</span>
            <span className="text-slate-400 dark:text-slate-500">Sofia Plus / Zajuna</span>
            <span className="text-slate-400 dark:text-slate-500">Línea gratuita nacional: 018000 910270</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
