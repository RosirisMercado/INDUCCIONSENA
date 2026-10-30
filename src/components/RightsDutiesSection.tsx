import React, { useState } from 'react';
import { RIGHTS_LIST, DUTIES_LIST, PROHIBITIONS_LIST, SENA_REGULATION_INFO } from '../data/senaData';
import { RightOrDuty } from '../types/induction';
import { Search, ShieldAlert, CheckCircle, HelpCircle, ChevronRight, Check, Sparkles, ShieldCheck, Info } from 'lucide-react';

interface RightsDutiesSectionProps {
  onMarkRead: () => void;
  isRead: boolean;
  onNextSection: () => void;
}

export const RightsDutiesSection: React.FC<RightsDutiesSectionProps> = ({
  onMarkRead,
  isRead,
  onNextSection
}) => {
  const [activeTab, setActiveTab] = useState<'derechos' | 'deberes' | 'prohibiciones'>('derechos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Mini-game state for rapid practice
  const [miniGameIndex, setMiniGameIndex] = useState(0);
  const [miniGameFeedback, setMiniGameFeedback] = useState<{
    status: 'correct' | 'wrong' | null;
    message: string;
  }>({ status: null, message: '' });
  const [miniGameScore, setMiniGameScore] = useState(0);

  const practiceChallenges = [
    {
      statement: 'Recibir retroalimentación y evaluación de evidencias dentro de los cinco (5) días hábiles siguientes a la entrega.',
      correctType: 'derecho',
      explanation: 'Acuerdo 009 de 2024, Cap. II: Es un DERECHO del aprendiz conocer oportunamente el resultado de sus evaluaciones y observaciones.'
    },
    {
      statement: 'Informar y justificar oportunamente inasistencias dentro de los tres (3) días hábiles posteriores al hecho.',
      correctType: 'deber',
      explanation: 'Acuerdo 009 de 2024, Cap. III: Es un DEBER ineludible radicar soportes válidos para evitar apertura de proceso por deserción.'
    },
    {
      statement: 'Ingresar o comercializar bebidas alcohólicas o sustancias psicoactivas en el centro de formación o ambientes de práctica.',
      correctType: 'prohibicion',
      explanation: 'Acuerdo 009 de 2024, Cap. III: Es una PROHIBICIÓN taxativa y falta gravísima causal de cancelación de matrícula.'
    },
    {
      statement: 'Ser escuchado en descargos y contar con el acompañamiento de voceros en el Comité de Evaluación y Seguimiento.',
      correctType: 'derecho',
      explanation: 'Acuerdo 009 de 2024, Cap. II: Es un DERECHO al debido proceso y legítima defensa constitucional en el SENA.'
    },
    {
      statement: 'Utilizar obligatoriamente los Elementos de Protección Personal (EPP) y respetar protocolos de bioseguridad en talleres.',
      correctType: 'deber',
      explanation: 'Acuerdo 009 de 2024, Cap. III: Es un DEBER prioritario de autocuidado y preservación de la vida en ambientes de aprendizaje.'
    },
    {
      statement: 'Recibir trato digno con enfoque diferencial, sin discriminación de ninguna índole y con entornos seguros libres de violencia y acoso.',
      correctType: 'derecho',
      explanation: 'Acuerdo 009 de 2024, Cap. II: Es un DERECHO fundamental que garantiza la inclusión, ajustes razonables y protección integral.'
    }
  ];

  const handleMiniGameAnswer = (chosenType: 'derecho' | 'deber' | 'prohibicion') => {
    const currentChallenge = practiceChallenges[miniGameIndex];
    if (chosenType === currentChallenge.correctType) {
      setMiniGameFeedback({
        status: 'correct',
        message: `¡Correcto! ${currentChallenge.explanation}`
      });
      setMiniGameScore(prev => prev + 1);
    } else {
      setMiniGameFeedback({
        status: 'wrong',
        message: `Incorrecto. ${currentChallenge.explanation}`
      });
    }
  };

  const nextChallenge = () => {
    setMiniGameFeedback({ status: null, message: '' });
    setMiniGameIndex((prev) => (prev + 1) % practiceChallenges.length);
  };

  // Filter current list
  const getRawList = () => {
    if (activeTab === 'derechos') return RIGHTS_LIST;
    if (activeTab === 'deberes') return DUTIES_LIST;
    return PROHIBITIONS_LIST;
  };

  const filteredList = getRawList().filter((item) => {
    const matchesCategory = selectedCategory === 'Todos' || item.categoria === selectedCategory;
    const matchesSearch =
      item.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.articulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.implicacionPractica.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['Todos', 'Académico', 'Convivencia y Ética', 'Bienestar y Salud', 'Institucional'];

  return (
    <div className="space-y-10 pb-16">
      {/* Header banner */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 transition-colors space-y-4">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Reglamento del Aprendiz SENA · {SENA_REGULATION_INFO.acuerdoVigente} (Vigente)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Derechos, Deberes y Prohibiciones
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            El Reglamento del Aprendiz es la carta de navegación de tu permanencia en el SENA. Define las garantías que protegen tu formación integral, la inclusión, el enfoque diferencial y los compromisos éticos que asumes como futuro profesional de Colombia.
          </p>
        </div>

        {/* Regulatory Update Callout */}
        <div className="bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl p-4 flex items-start gap-3 text-xs">
          <Info className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-emerald-900 dark:text-emerald-200">
              Marco Normativo Actualizado: {SENA_REGULATION_INFO.acuerdoVigente} ({SENA_REGULATION_INFO.fechaExpedicion})
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Expedido por el {SENA_REGULATION_INFO.organoEmisor}, <strong>deroga en su totalidad el antiguo Acuerdo 007 de 2012</strong>. Incorpora explícitamente el enfoque diferencial, equidad de género, prevención integral de violencias (Ley 2365 de 2024), modalidades formativas actualizadas y fortalecimiento del debido proceso pedagógico.
            </p>
          </div>
        </div>
      </section>

      {/* Mini-Game: Clasificador de Convivencia */}
      <section className="bg-emerald-950 text-white rounded-2xl border border-emerald-900/60 p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Desafío Rápido de Apropiación
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Aciertos: {miniGameScore} · Caso {miniGameIndex + 1} de {practiceChallenges.length}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
            ¿Es un Derecho, un Deber o una Prohibición?
          </h3>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-emerald-800/50 my-4 text-sm sm:text-base text-slate-100 font-medium">
            "{practiceChallenges[miniGameIndex].statement}"
          </div>

          {miniGameFeedback.status === null ? (
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => handleMiniGameAnswer('derecho')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Es un DERECHO
              </button>
              <button
                onClick={() => handleMiniGameAnswer('deber')}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Es un DEBER
              </button>
              <button
                onClick={() => handleMiniGameAnswer('prohibicion')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Es una PROHIBICIÓN
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div
                className={`p-3 rounded-lg text-xs leading-relaxed ${
                  miniGameFeedback.status === 'correct'
                    ? 'bg-emerald-900/50 text-emerald-200 border border-emerald-600/50'
                    : 'bg-rose-900/50 text-rose-200 border border-rose-600/50'
                }`}
              >
                {miniGameFeedback.message}
              </div>
              <button
                onClick={nextChallenge}
                className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Siguiente Caso de Práctica
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Tab Controls & Filters */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Segmented controls (functional buttons) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors">
            <button
              onClick={() => setActiveTab('derechos')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'derechos'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Derechos ({RIGHTS_LIST.length})
            </button>
            <button
              onClick={() => setActiveTab('deberes')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'deberes'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Deberes ({DUTIES_LIST.length})
            </button>
            <button
              onClick={() => setActiveTab('prohibiciones')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'prohibiciones'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Prohibiciones ({PROHIBITIONS_LIST.length})
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por artículo o palabra..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">Filtrar por eje:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">{item.articulo}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.categoria}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {item.titulo}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.descripcion}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 -mx-6 -mb-6 p-4 rounded-b-2xl transition-colors">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  ¿Cómo se vive en la práctica?
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {item.implicacionPractica}
                </p>
              </div>
            </div>
          ))}

          {filteredList.length === 0 && (
            <div className="col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400">
              No se encontraron artículos que coincidan con la búsqueda "{searchQuery}".
            </div>
          )}
        </div>
      </section>

      {/* Module Completion Action */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg font-bold text-white">Has explorado el Reglamento del Aprendiz</h4>
          <p className="text-xs text-slate-300 mt-1">
            Conoce ahora los trámites de novedades de matrícula y los programas de Bienestar al Aprendiz.
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
            <span>Trámites y Bienestar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
