import React, { useState, useRef, useEffect } from 'react';
import { SENA_HISTORY, SENA_MISSION, SENA_VISION, SENA_VALUES, SENA_SYMBOLS } from '../data/senaData';
import { Volume2, VolumeX, Play, Pause, Compass, Award, Users, BookOpen, ChevronRight, Check } from 'lucide-react';
import { SenaLogo, SenaShield } from '../assets/senaLogo';

const campusImg = '/src/assets/images/sena_campus_modern_1793115167926.jpg';
const workshopImg = '/src/assets/images/sena_apprentices_workshop_1793115169087.jpg';
const regionalAtlanticoImg = '/src/assets/images/sena_regional_atlantico_1793199157647.jpg';

interface IdentitySectionProps {
  onMarkRead: () => void;
  isRead: boolean;
  onNextSection: () => void;
}

export const IdentitySection: React.FC<IdentitySectionProps> = ({
  onMarkRead,
  isRead,
  onNextSection
}) => {
  const [activeSymbolTab, setActiveSymbolTab] = useState<'escudo' | 'bandera' | 'logosimbolo' | 'himno'>('escudo');
  const [isPlayingAnthem, setIsPlayingAnthem] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const notesTimeoutRef = useRef<number[]>([]);

  // Simple synthesized solemn melody representation for SENA anthem
  const startAnthemAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // Melody notes (freq, duration ms): "Es-tu-dian-tes del SE-NA a-de-lan-te..."
      const melody = [
        { f: 392, d: 400 }, // G4
        { f: 523.25, d: 500 }, // C5
        { f: 587.33, d: 350 }, // D5
        { f: 659.25, d: 500 }, // E5
        { f: 587.33, d: 350 }, // D5
        { f: 523.25, d: 450 }, // C5
        { f: 392, d: 400 }, // G4
        { f: 523.25, d: 700 }, // C5
        { f: 587.33, d: 400 }, // D5
        { f: 659.25, d: 400 }, // E5
        { f: 698.46, d: 600 }, // F5
        { f: 659.25, d: 400 }, // E5
        { f: 587.33, d: 700 }, // D5
      ];

      let currentTime = ctx.currentTime + 0.1;

      melody.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, currentTime);

        gain.gain.setValueAtTime(0.001, currentTime);
        gain.gain.exponentialRampToValueAtTime(0.18, currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, currentTime + (note.d / 1000) - 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(currentTime);
        osc.stop(currentTime + (note.d / 1000));

        currentTime += note.d / 1000;
      });

      const totalDuration = (currentTime - ctx.currentTime) * 1000;
      setIsPlayingAnthem(true);

      const timerId = window.setTimeout(() => {
        setIsPlayingAnthem(false);
      }, totalDuration);
      notesTimeoutRef.current.push(timerId);

    } catch (err) {
      console.warn('Audio not allowed without gesture', err);
      setIsPlayingAnthem(false);
    }
  };

  const stopAnthemAudio = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    notesTimeoutRef.current.forEach(t => clearTimeout(t));
    notesTimeoutRef.current = [];
    setIsPlayingAnthem(false);
  };

  useEffect(() => {
    return () => {
      stopAnthemAudio();
    };
  }, []);

  const activeSymbol = SENA_SYMBOLS.find(s => s.id === activeSymbolTab)!;

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Institutional Banner */}
      <section className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white shadow-sm">
        <div className="absolute inset-0">
          <img
            src={campusImg}
            alt="Campus de Formación SENA Colombia"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wide uppercase mb-3">
            <span>Inducción Institucional</span>
            <span aria-hidden="true">·</span>
            <span>Reglamento & Cultura</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight text-balance">
            El Orgullo de Ser Aprendiz del <span className="text-emerald-400">SENA</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Bienvenido a la institución más querida por los colombianos. Conoce nuestra misión transformadora, los símbolos patrios de nuestra formación y los principios que guiarán tu camino.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Fundado en 1957</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>33 Regionales en Colombia</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Formación Gratuita e Integral</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Misión, Visión e Historia */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="text-xs font-bold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase mb-2">
              Propósito Superior
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Misión Institucional
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {SENA_MISSION}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Inversión estatal en el desarrollo técnico del talento humano colombiano</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="text-xs font-bold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase mb-2">
              Rumbo Estratégico
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Visión del SENA
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {SENA_VISION}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Referente en innovación pedagógica y transformación productiva</span>
          </div>
        </div>
      </section>

      {/* 3. Origen e Historia: Rodolfo Martínez Tono */}
      <section className="bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-800/60 p-6 sm:p-8 transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              Memoria Histórica
            </span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              El Legado de Rodolfo Martínez Tono (1957)
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              El SENA nació mediante el {SENA_HISTORY.decreto}, fruto de la visión del cartagenero Rodolfo Martínez Tono, quien soñó una institución tripartita donde el Estado, los trabajadores y los empresarios unieran esfuerzos para capacitar técnicamente a los colombianos, brindándoles oportunidades de empleo digno.
            </p>
            <div className="text-xs text-emerald-900 dark:text-emerald-300 font-semibold italic">
              "{SENA_HISTORY.lemaHistorico}"
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 shadow-xs space-y-3 text-xs">
            <div className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
              Ficha Técnica de Creación
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Año de Fundación:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">21 de junio de 1957 (69 años de trayectoria)</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Adscripción:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Ministerio del Trabajo de Colombia</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Modelo de Formación:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Formación Profesional Integral (Lectiva + Productiva)</span>
            </div>
          </div>
        </div>
      </section>

      {/* SENA Regional Atlántico Spotlight */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
            <img
              src={regionalAtlanticoImg}
              alt="SENA Regional Atlántico - Centros de Formación e Innovación Tecnológica en Barranquilla"
              referrerPolicy="no-referrer"
              className="w-full h-72 sm:h-80 object-cover"
            />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>SENA Regional Atlántico</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Liderazgo Tecnológico, Industrial y de Servicios en el Caribe Colombiano
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              La Regional Atlántico del SENA, con sede principal en Barranquilla, articula la educación técnica y tecnológica con los sectores productivos de la región. Cuenta con centros especializados como el <strong>Centro Nacional Colombo Alemán</strong>, el <strong>Centro de Comercio y Servicios</strong>, el <strong>Centro Industrial y de Aviación</strong> y el <strong>Centro para el Desarrollo Agroecológico y Agroindustrial</strong>.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">Barranquilla y Municipios</span>
                <span className="text-slate-600 dark:text-slate-300">Cobertura departamental en 23 municipios.</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">Industria 4.0 & AVIACIÓN</span>
                <span className="text-slate-600 dark:text-slate-300">Laboratorios avanzados y bilingüismo.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Símbolos Institucionales Interactivos */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase">
            Identidad Gráfica y Simbólica
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Los Símbolos que Nos Representan
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            Cada elemento gráfico del SENA encierra un profundo significado histórico, social y formativo.
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center justify-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-xl mx-auto transition-colors">
          {(['escudo', 'bandera', 'logosimbolo', 'himno'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSymbolTab(tab)}
              className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeSymbolTab === tab
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab === 'escudo' && 'Escudo'}
              {tab === 'bandera' && 'Bandera'}
              {tab === 'logosimbolo' && 'Logo-Símbolo'}
              {tab === 'himno' && 'Himno'}
            </button>
          ))}
        </div>

        {/* Tab Content Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 sm:p-8 transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              {activeSymbolTab === 'escudo' && (
                <div className="w-72 sm:w-80 h-72 sm:h-80 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col items-center justify-center shadow-xs transition-all">
                  <SenaShield className="w-60 h-60" />
                  <span className="text-xs text-slate-500 font-semibold mt-3 text-center">
                    Escudo Oficial SENA
                  </span>
                </div>
              )}

              {activeSymbolTab === 'bandera' && (
                <div className="w-full max-w-xs h-72 sm:h-80 rounded-2xl bg-white border-2 border-slate-300 p-6 flex flex-col items-center justify-center shadow-sm relative overflow-hidden transition-all">
                  <div className="w-28 h-28 rounded-full bg-white border border-slate-200 p-2 flex items-center justify-center shadow-xs">
                    <SenaShield className="w-24 h-24" />
                  </div>
                  <span className="text-xs text-slate-500 mt-4 text-center font-medium">
                    Lienzo blanco inmaculado con el escudo oficial en el centro (Paz y Trabajo)
                  </span>
                </div>
              )}

              {activeSymbolTab === 'logosimbolo' && (
                <div className="w-72 sm:w-80 h-72 sm:h-80 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col items-center justify-center shadow-xs transition-all">
                  <SenaLogo className="w-52 h-52" />
                  <span className="text-xs text-slate-500 font-semibold mt-3 text-center">
                    Logo-símbolo Oficial SENA
                  </span>
                </div>
              )}

              {activeSymbolTab === 'himno' && (
                <div className="w-full max-w-xs rounded-2xl bg-slate-900 text-white p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-600/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <Volume2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Himno Institucional</h4>
                    <p className="text-xs text-slate-400 mt-1">Letra: Luis Alfredo Osorio · Música: Daniel Marlez</p>
                  </div>

                  <div className="pt-2">
                    {isPlayingAnthem ? (
                      <button
                        onClick={stopAnthemAudio}
                        className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <Pause className="w-4 h-4" />
                        <span>Detener Himno</span>
                      </button>
                    ) : (
                      <button
                        onClick={startAnthemAudio}
                        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Escuchar Melodía del Himno</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Explanation Column */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                  Símbolo Oficial
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeSymbol.nombre}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  {activeSymbol.descripcion}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Significado de sus Componentes:
                </h4>
                <div className="space-y-2">
                  {activeSymbol.significadoDetallado.map((sig, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 shrink-0">0{i + 1}.</span>
                      <span>{sig}</span>
                    </div>
                  ))}
                </div>
              </div>

              {activeSymbol.detallesExtra && (
                <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Dato de interés: </span>
                  {activeSymbol.detallesExtra}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Valores Institucionales SENA */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase">
            Ética e Integridad
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Los 7 Valores Fundamentales del SENA
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            La formación profesional en el SENA no solo transmite destrezas técnicas, sino que forja ciudadanos íntegros comprometidos con el desarrollo del país.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SENA_VALUES.map((val, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1.5">
                  <span>0{idx + 1}</span>
                  <span className="text-slate-400 dark:text-slate-500 font-normal">Valor SENA</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {val.nombre}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {val.definicion}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 -mx-5 -mb-5 p-4 rounded-b-xl transition-colors">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  En tu formación diaria:
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                  "{val.ejemploCotidiando}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Ambientes de Formación y Talleres */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 overflow-hidden transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-4">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Aprender Haciendo
            </span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Formación Profesional en Ambientes Reales
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              El SENA cuenta con tecnología de punta en sus ambientes de aprendizaje, simulando los desafíos reales de la industria 4.0, la agroindustria y los servicios en Colombia.
            </p>
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>Etapa Lectiva: Desarrollo teórico-práctico en aulas y laboratorios.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>Etapa Productiva: Contrato de aprendizaje, proyecto productivo o pasantía.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>Cultura SENNOVA: Innovación y desarrollo tecnológico aplicado.</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <img
              src={workshopImg}
              alt="Aprendices del SENA en taller técnico colaborando"
              referrerPolicy="no-referrer"
              className="w-full h-72 sm:h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* 7. Action Footer: Mark Read & Continue */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg font-bold text-white">¿Apropiaste la Identidad Institucional?</h4>
          <p className="text-xs text-slate-300 mt-1">
            Continúa al siguiente módulo para conocer tus Derechos, Deberes y Prohibiciones según el Reglamento del Aprendiz.
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
            <span>Derechos y Deberes</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
