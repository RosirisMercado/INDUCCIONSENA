import React from 'react';
import { SectionId, ApprenticeProfile } from '../types/induction';
import { 
  Compass, 
  BookOpen, 
  FileCheck2, 
  HelpCircle, 
  Award, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { SenaLogo } from '../assets/senaLogo';

const campusImg = '/src/assets/images/sena_campus_modern_1793115167926.jpg';

interface IntroduccionSectionProps {
  apprentice: ApprenticeProfile;
  onStartModule: (section: SectionId) => void;
  progressPercent: number;
  completedModules: Record<string, boolean>;
  hasPassedQuiz: boolean;
}

export const IntroduccionSection: React.FC<IntroduccionSectionProps> = ({
  apprentice,
  onStartModule,
  progressPercent,
  completedModules,
  hasPassedQuiz
}) => {
  const modules = [
    {
      id: 'identidad' as SectionId,
      step: '01',
      title: 'Identidad e Imagen Institucional',
      desc: 'Descubre la misión histórica del SENA, el significado del escudo, la bandera, el logo-símbolo y entona nuestro himno institucional.',
      icon: Compass,
      isCompleted: completedModules['identidad']
    },
    {
      id: 'derechos-deberes' as SectionId,
      step: '02',
      title: 'Derechos y Deberes del Aprendiz',
      desc: 'Domina el Acuerdo 009 de 2024 (Reglamento del Aprendiz Vigente). Conoce tus garantías académicas, enfoque diferencial, deberes y prohibiciones.',
      icon: BookOpen,
      isCompleted: completedModules['derechos-deberes']
    },
    {
      id: 'tramites-bienestar' as SectionId,
      step: '03',
      title: 'Trámites de Matrícula y Bienestar',
      desc: 'Aprende los plazos de aplazamiento, traslado, reingreso y accede a los 6 pilares de bienestar (salud, apoyos económicos, deporte y cultura).',
      icon: FileCheck2,
      isCompleted: completedModules['tramites-bienestar']
    },
    {
      id: 'simulador' as SectionId,
      step: '04',
      title: 'Simulador de Dilemas y Casos Reales',
      desc: 'Enfrenta situaciones prácticas cotidianas tomadas de la vida real de los aprendices y pon a prueba tu criterio ético y reglamentario.',
      icon: HelpCircle,
      isCompleted: completedModules['simulador']
    },
    {
      id: 'evaluacion' as SectionId,
      step: '05',
      title: 'Evaluación Interactiva de Apropiación',
      desc: 'Presenta el test de 12 preguntas para verificar la apropiación de tus competencias de inducción con retroalimentación inmediata.',
      icon: Award,
      isCompleted: hasPassedQuiz
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Welcome */}
      <section className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white shadow-sm">
        <div className="absolute inset-0">
          <img
            src={campusImg}
            alt="Campus SENA"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60" />
        </div>

        <div className="relative max-w-4xl px-6 py-12 sm:py-16">
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 mb-4">
            <SenaLogo className="w-5 h-5" />
            <span className="text-xs font-semibold text-emerald-300 tracking-wide uppercase">
              Sistema Integral de Inducción
            </span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span className="text-xs text-slate-300 font-mono">Ficha {apprentice.ficha}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            ¡Bienvenido al SENA, <br />
            <span className="text-emerald-400">{apprentice.nombreCompleto}</span>!
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Inicias una etapa transformadora en tu vida. Esta ruta interactiva te guiará para conocer la institución más querida de Colombia, tus derechos, tus deberes como aprendiz y certificar tu proceso de inducción.
          </p>

          <div className="mt-8 flex items-center gap-4 flex-wrap">
            <button
              onClick={() => onStartModule('identidad')}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-emerald-900/20"
            >
              <span>Comenzar Ruta de Inducción</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onStartModule('evaluacion')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl backdrop-blur-xs transition-colors"
            >
              Ir Directo a la Evaluación
            </button>
          </div>
        </div>
      </section>

      {/* Modules Roadmap Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <span className="text-xs font-bold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase">
              Ruta Formativa
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              Módulos de Inducción y Apropiación
            </h2>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Completa cada módulo antes de presentar la evaluación final
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-600/60 hover:shadow-xs transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/70 text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    {mod.isCompleted ? (
                      <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Completado
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                        {mod.step}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {mod.desc}
                  </p>
                </div>

                <button
                  onClick={() => onStartModule(mod.id)}
                  className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-slate-700 group-hover:border-emerald-600 dark:group-hover:border-emerald-600"
                >
                  <span>Explorar Módulo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Institutional Support Bar */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white block font-semibold mb-0.5">Marco Normativo Oficial:</strong>
              Acuerdo 009 de 2024 (Reglamento del Aprendiz SENA vigente) y directrices de la Dirección General para la Formación Profesional Integral.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white block font-semibold mb-0.5">Certificación Digital:</strong>
              Generación inmediata de constancia verificable con código único al superar el 80% en la evaluación.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white block font-semibold mb-0.5">Acompañamiento del Instructor:</strong>
              Resultados consolidados en tiempo real para que tu instructor líder oriente las sesiones presenciales.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
