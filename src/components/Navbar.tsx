import React from 'react';
import { SectionId } from '../types/induction';
import { ShieldCheck, UserCheck, GraduationCap, Sun, Moon } from 'lucide-react';
import { SenaLogo } from '../assets/senaLogo';

interface NavbarProps {
  currentSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  isInstructorMode: boolean;
  onToggleInstructorMode: () => void;
  hasPassedQuiz: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onSelectSection,
  isInstructorMode,
  onToggleInstructorMode,
  hasPassedQuiz,
  isDarkMode,
  onToggleTheme
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-6 lg:gap-8 h-16 overflow-hidden">
          {/* Zone 1: Single text element brand wordmark with official SENA logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectSection('introduccion')}
              className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
            >
              <SenaLogo className="w-9 h-9" />
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                SENA <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Inducción</span>
              </span>
            </button>
          </div>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onSelectSection('identidad')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 cursor-pointer ${
                currentSection === 'identidad'
                  ? 'border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              Identidad SENA
            </button>

            <button
              onClick={() => onSelectSection('derechos-deberes')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 cursor-pointer ${
                currentSection === 'derechos-deberes'
                  ? 'border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              Derechos y Deberes
            </button>

            <button
              onClick={() => onSelectSection('tramites-bienestar')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 cursor-pointer ${
                currentSection === 'tramites-bienestar'
                  ? 'border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              Trámites y Bienestar
            </button>

            <button
              onClick={() => onSelectSection('simulador')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 cursor-pointer ${
                currentSection === 'simulador'
                  ? 'border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              Simulador de Casos
            </button>

            <button
              onClick={() => onSelectSection('evaluacion')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 cursor-pointer ${
                currentSection === 'evaluacion'
                  ? 'border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              Evaluación Interactiva
            </button>

            {hasPassedQuiz && (
              <button
                onClick={() => onSelectSection('certificado')}
                className={`whitespace-nowrap transition-colors py-1 border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  currentSection === 'certificado'
                    ? 'border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Certificado
              </button>
            )}
          </nav>

          {/* Zone 3: Actions + Theme Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs"
              title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-90 duration-200" />
              )}
            </button>

            <button
              onClick={onToggleInstructorMode}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all shadow-sm cursor-pointer ${
                isInstructorMode
                  ? 'bg-slate-900 dark:bg-slate-800 border border-transparent dark:border-slate-700 text-white hover:bg-slate-800'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              } whitespace-nowrap`}
            >
              {isInstructorMode ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Volver a Modo Aprendiz</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Panel Gestión Instructor</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
