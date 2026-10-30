import React, { useState } from 'react';
import { PROCEDURES_LIST } from '../data/senaData';
import { Heart, FileText, AlertTriangle, ShieldCheck, Clock, CheckCircle2, ChevronRight, Check } from 'lucide-react';

interface ProceduresBienestarSectionProps {
  onMarkRead: () => void;
  isRead: boolean;
  onNextSection: () => void;
}

export const ProceduresBienestarSection: React.FC<ProceduresBienestarSectionProps> = ({
  onMarkRead,
  isRead,
  onNextSection
}) => {
  const [activeProcedure, setActiveProcedure] = useState(PROCEDURES_LIST[0]);

  const bienestarPillars = [
    {
      title: 'Apoyos de Sostenimiento',
      desc: 'Subsidios económicos mensuales (apoyo regular y Fondo de la Industria de la Construcción - FIC) para aprendices en condiciones socioeconómicas vulnerables.',
      detail: 'Cubre gastos de transporte y alimentación durante las etapas lectiva y productiva.'
    },
    {
      title: 'Salud Integral y Prevención',
      desc: 'Jornadas de atención en medicina preventiva, salud oral, vacunación, salud mental y prevención de adicciones en los centros.',
      detail: 'Póliza de seguro estudiantil contra accidentes durante todas las actividades académicas.'
    },
    {
      title: 'Deporte y Recreación',
      desc: 'Juegos Nacionales de Aprendices SENA, torneos internos de fútbol, baloncesto, voleibol, atletismo y acondicionamiento físico.',
      detail: 'Fomenta el trabajo en equipo, la disciplina y el bienestar físico.'
    },
    {
      title: 'Arte y Expresión Cultural',
      desc: 'Grupos de danza folclórica, teatro, música, literatura y artes visuales representativos de la riqueza cultural colombiana.',
      detail: 'Espacios de integración que enriquecen la formación del ser humano.'
    },
    {
      title: 'Liderazgo y Habilidades Blandas',
      desc: 'Talleres de comunicación asertiva, resolución pacífica de conflictos, inteligencia emocional y formación para voceros.',
      detail: 'Prepara al aprendiz para destacar como líder en el entorno laboral.'
    },
    {
      title: 'Acompañamiento Psicosocial',
      desc: 'Orientación psicológica individual y grupal confidencial para la superación de barreras académicas y emocionales.',
      detail: 'Red de apoyo profesional disponible en la oficina de Bienestar al Aprendiz de tu Centro.'
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Header */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 transition-colors">
        <div className="max-w-3xl">
          <span className="text-xs font-bold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase">
            Gestión Académica & Desarrollo Humano · Acuerdo 009 de 2024
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Trámites de Matrícula y Bienestar al Aprendiz
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Conoce cómo tramitar novedades de matrícula formalmente para proteger tu estado académico, cómo funciona el Comité de Evaluación y el amplio catálogo de beneficios que el SENA te brinda a través de Bienestar.
          </p>
        </div>
      </section>

      {/* 2. Interactive Procedures Deck */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase">
            Novedades del Aprendiz
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
            Trámites Oficiales de Matrícula
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Selecciona el trámite para conocer los requisitos, plazos legales y consecuencias según el Reglamento.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Procedure List */}
          <div className="lg:col-span-5 space-y-2">
            {PROCEDURES_LIST.map((proc) => {
              const isSelected = activeProcedure.id === proc.id;
              return (
                <button
                  key={proc.id}
                  onClick={() => setActiveProcedure(proc)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-xs ring-1 ring-emerald-500 text-emerald-950 dark:text-emerald-200'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className={`w-4 h-4 ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}`} />
                    <span className={`text-sm font-semibold ${isSelected ? 'text-emerald-950 dark:text-white font-bold' : 'text-slate-900 dark:text-slate-200'}`}>
                      {proc.nombre}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Procedure Detail View */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-xs transition-colors">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Plazo Reglamentario:</span>
                <span>{activeProcedure.plazo}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeProcedure.nombre}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {activeProcedure.concepto}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                Requisitos y Documentación:
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {activeProcedure.requisitos.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs">
              <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                Impacto o Consecuencia Administrativa:
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {activeProcedure.consecuencia}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Medidas Formativas y Sanciones */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Debido Proceso y Convivencia
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Medidas Formativas y Sanciones Disciplinarias
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            El enfoque disciplinario del SENA es eminentemente pedagógico y formativo. Busca la reflexión y el mejoramiento continuo antes de imponer sanciones punitivas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80 space-y-2">
            <div className="text-emerald-400 text-xs font-bold uppercase">Nivel 1 · Preventivo</div>
            <h4 className="font-bold text-white text-base">Medidas Formativas</h4>
            <ul className="text-xs text-slate-300 space-y-2 pt-1">
              <li>• <strong className="text-white">Llamado de atención verbal:</strong> Reflexión directa y pedagógica con el instructor.</li>
              <li>• <strong className="text-white">Plan de Mejoramiento:</strong> Compromiso formal con tareas pedagógicas específicas para subsanar deficiencias en 15 a 30 días.</li>
            </ul>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80 space-y-2">
            <div className="text-amber-400 text-xs font-bold uppercase">Nivel 2 · Correctivo</div>
            <h4 className="font-bold text-white text-base">Sanciones Formales</h4>
            <ul className="text-xs text-slate-300 space-y-2 pt-1">
              <li>• <strong className="text-white">Llamado de atención escrito:</strong> Notificado con copia a la hoja de vida del aprendiz.</li>
              <li>• <strong className="text-white">Condicionamiento de matrícula:</strong> Pérdida transitoria de beneficios de bienestar y monitoreo estricto.</li>
            </ul>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80 space-y-2">
            <div className="text-rose-400 text-xs font-bold uppercase">Nivel 3 · Definitivo</div>
            <h4 className="font-bold text-white text-base">Cancelación de Matrícula</h4>
            <ul className="text-xs text-slate-300 space-y-2 pt-1">
              <li>• <strong className="text-white">Deserción o Falta Gravísima:</strong> Pérdida de la condición de aprendiz.</li>
              <li>• <strong className="text-white">Inhabilidad en Sofia Plus:</strong> Sanción de seis (6) meses o un (1) año sin poder ingresar a programas de formación en el SENA.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-slate-300 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white">Garantía del Comité de Evaluación y Seguimiento: </span>
            Ningún aprendiz puede ser sancionado de plano sin ser citado previamente por escrito, tener al menos tres (3) días para preparar sus descargos y ser acompañado por el Vocero de su Ficha.
          </div>
        </div>
      </section>

      {/* 4. Bienestar al Aprendiz */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase">
            Desarrollo Integral
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
            Pilares de Bienestar al Aprendiz
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Bienestar al Aprendiz es la estrategia institucional para garantizar tu permanencia exitosa y desarrollo humano integral durante todo tu ciclo formativo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bienestarPillars.map((p, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                  <span>Pilar 0{idx + 1}</span>
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {p.desc}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-300">Beneficio clave: </span>
                {p.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Module Completion Action */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg font-bold text-white">Completaste el Módulo de Trámites y Bienestar</h4>
          <p className="text-xs text-slate-300 mt-1">
            Pon a prueba tu criterio en el Simulador de Casos y Dilemas antes de la Evaluación de Certificación.
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
            <span>{isRead ? 'Módulo Completado' : 'Marcar como Leído'}</span>
          </button>

          <button
            onClick={onNextSection}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <span>Simulador de Casos</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
