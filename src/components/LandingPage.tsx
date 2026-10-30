import React, { useState } from 'react';
import { BookOpen, ShieldCheck, BarChart3, ArrowRight, Award, Compass, Users, CheckCircle2, Lock, X, AlertCircle, Play, Video } from 'lucide-react';
import { SenaLogo } from '../assets/senaLogo';
import { SENA_REGULATION_INFO } from '../data/senaData';

interface LandingPageProps {
  onSelectRole: (role: 'aprendiz' | 'instructor' | 'directivo') => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const campusImg = '/src/assets/images/sena_campus_modern_1793115167926.jpg';
const regionalAtlanticoImg = '/src/assets/images/sena_regional_atlantico_1793199157647.jpg';

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  isDarkMode,
  onToggleTheme
}) => {
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleInstructorLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default password for instructor profile
    if (passwordInput === 'instructor2026' || passwordInput === 'Sena2026*') {
      setShowInstructorModal(false);
      setPasswordInput('');
      setLoginError(false);
      onSelectRole('instructor');
    } else {
      setLoginError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SenaLogo className="w-10 h-10" />
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white block leading-none">
                SENA <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Inducción Institucional</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {SENA_REGULATION_INFO.acuerdoVigente} · Regional Atlántico
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowVideoModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer hover:shadow-md hover:scale-102"
              title="Ver vídeo tutorial de la plataforma"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Vídeo Tutorial</span>
            </button>

            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs text-xs font-medium flex items-center gap-1.5"
            >
              <span>{isDarkMode ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 z-0">
          <img
            src={campusImg}
            alt="SENA Campus"
            className="w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Plataforma Oficial de Inducción de Aprendices</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Gestión Integral y Apropiación del <span className="text-emerald-400">Reglamento del Aprendiz</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Selecciona tu rol institucional para acceder a los contenidos, herramientas pedagógicas, simuladores normativos y tableros de control directivo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setShowVideoModal(true)}
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-105 cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-slate-950/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5 text-slate-950" />
              </div>
              <span>Vídeo Tutorial</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 text-xs text-slate-300 flex-wrap">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {SENA_REGULATION_INFO.acuerdoVigente}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Acuerdo 002 de 2026 (Debido Proceso)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              SENA Regional Atlántico
            </span>
          </div>
        </div>
      </section>

      {/* Role Selection Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-24">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            ¿Cuál es tu rol en la comunidad SENA?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Selecciona una opción para ingresar a la plataforma especializada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Soy Aprendiz */}
          <div
            onClick={() => onSelectRole('aprendiz')}
            className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 p-8 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
            
            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/80 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                  Perfil Estudiantil
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Soy Aprendiz
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Conoce tus derechos, deberes, la historia institucional, los símbolos del SENA, explora trámites de matrícula y presenta la evaluación interactiva para obtener tu certificación.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-bold text-sm relative z-10">
              <span>Ingresar como Aprendiz</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Soy Instructor (Protected with password modal) */}
          <div
            onClick={() => {
              setPasswordInput('');
              setLoginError(false);
              setShowInstructorModal(true);
            }}
            className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 p-8 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />

            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-emerald-400 flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:scale-110 transition-transform relative">
                <ShieldCheck className="w-7 h-7" />
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 rounded-full p-1 shadow-xs" title="Perfil protegido con clave">
                  <Lock className="w-3 h-3" />
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  Perfil Pedagógico (Requiere Clave)
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Soy Instructor
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Gestiona y monitorea el avance de inducción de tus fichas, revisa calificaciones de aprendices, simula intentos evaluativos y haz seguimiento a las evidencias normativas.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-slate-900 dark:text-white font-bold text-sm relative z-10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                Ingresar como Instructor
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Soy Directivo */}
          <div
            onClick={() => onSelectRole('directivo')}
            className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 p-8 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />

            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/80 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                  Perfil Gerencial & Observatorio
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Soy Directivo
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Accede al observatorio de gestión institucional, indicadores de cobertura departamental (Atlántico), consolidado de aprobación de inducción y cumplimiento normativo del Reglamento.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-bold text-sm relative z-10">
              <span>Ingresar como Directivo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Regional Spotlight Banner */}
      <section className="bg-emerald-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-emerald-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-emerald-800 shadow-lg">
            <img
              src={regionalAtlanticoImg}
              alt="SENA Regional Atlántico"
              className="w-full h-64 object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>SENA Regional Atlántico · Barranquilla</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Comprometidos con la Educación y la Productividad del Caribe
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Formación profesional integral con pertinencia, innovación y enfoque diferencial. Garantizamos que cada aprendiz apropie los valores y normas institucionales para su inserción exitosa en el sector productivo.
            </p>
            <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-emerald-200">
              <span>✓ Centros Especializados</span>
              <span>✓ Contrato de Aprendizaje</span>
              <span>✓ Bienestar al Aprendiz</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SenaLogo className="w-6 h-6" />
            <span className="font-medium text-slate-700 dark:text-slate-200">
              Servicio Nacional de Aprendizaje SENA · Colombia
            </span>
          </div>
          <div>
            Reglamento del Aprendiz ({SENA_REGULATION_INFO.acuerdoVigente} y Acuerdo 002 de 2026)
          </div>
        </div>
      </footer>

      {/* Instructor Password Modal */}
      {showInstructorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Acceso Restringido - Perfil Instructor
                </h3>
              </div>
              <button
                onClick={() => setShowInstructorModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInstructorLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Contraseña de Instructor SENA
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Ingrese la clave (ej. instructor2026)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-slate-400 dark:text-slate-500 text-xs mt-1.5 block">
                  Sugerencia de acceso para pruebas: <code className="font-mono text-emerald-700 dark:text-emerald-400">instructor2026</code>
                </span>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                  <span>Contraseña incorrecta. Intente nuevamente.</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInstructorModal(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm cursor-pointer"
                >
                  Ingresar al Panel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Tutorial Floating Modal */}
      {showVideoModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowVideoModal(false);
            }
          }}
        >
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-700/80 shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>Vídeo Tutorial: Guía de Navegación</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Oficial SENA
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 hidden sm:block">
                    Plataforma de Inducción Institucional · Regional Atlántico
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowVideoModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                title="Cerrar vídeo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Container with full playback controls */}
            <div className="relative bg-black aspect-video w-full flex items-center justify-center overflow-hidden">
              <video
                src="/assets/aistudio/2026__11_51_78e6e464.mp4"
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              >
                Tu navegador no soporta la reproducción de vídeo HTML5.
              </video>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:px-6 bg-slate-950/80 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 text-slate-300 flex-wrap justify-center sm:justify-start">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> 4 Módulos Normativos
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Reto Evaluativo (80% Mínimo)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Certificado con QR
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl font-medium transition-colors cursor-pointer text-xs"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowVideoModal(false);
                    onSelectRole('aprendiz');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer text-xs flex items-center gap-1.5"
                >
                  <span>Comenzar como Aprendiz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
