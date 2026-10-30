import { 
  ApprenticeProfile, 
  CaseStudy, 
  FichaSummary, 
  ProcedureItem, 
  QuizAttempt, 
  QuizQuestion, 
  RightOrDuty, 
  SymbolItem, 
  ValueItem 
} from '../types/induction';

export const INITIAL_APPRENTICE: ApprenticeProfile = {
  id: 'apr-001',
  nombreCompleto: 'Juan Sebastián Morales Castro',
  tipoDocumento: 'CC',
  numeroDocumento: '1098765432',
  correo: 'jsmorales@misena.edu.co',
  ficha: '2824901',
  programa: 'Análisis y Desarrollo de Software (ADSO)',
  regional: 'Regional Antioquia',
  centroFormacion: 'Centro de Formación en Diseño, Confección y Moda / IT',
  jornada: 'Diurna'
};

export const SENA_HISTORY = {
  fundador: 'Rodolfo Martínez Tono',
  anoFundacion: '1957',
  decreto: 'Decreto Ley 118 del 21 de junio de 1957',
  naturaleza: 'Establecimiento público del orden nacional, con personería jurídica, patrimonio propio e independiente, adscrito al Ministerio del Trabajo.',
  lemaHistorico: 'Conocimiento y trabajo para todos los colombianos.'
};

export const SENA_MISSION = `El Servicio Nacional de Aprendizaje (SENA) está encargado de cumplir la función que le corresponde al Estado de invertir en el desarrollo social y técnico de los trabajadores colombianos, ofreciendo y ejecutando la Formación Profesional Integral gratuita, para la incorporación y el desarrollo de las personas en actividades productivas que contribuyan al desarrollo social, económico y tecnológico del país.`;

export const SENA_VISION = `En el horizonte institucional, el SENA se consolida como una entidad referente internacional de formación profesional integral e incluyente, reconocida por su pertinencia pedagógica, innovación tecnológica, fomento del emprendimiento y su contribución decisiva a la equidad social y la productividad nacional.`;

export const SENA_VALUES: ValueItem[] = [
  {
    nombre: 'Respeto',
    definicion: 'Reconocer, valorar y tratar con dignidad a todas las personas en su individualidad, ideas y derechos fundamentales.',
    ejemploCotidiando: 'Escuchar activamente las opiniones divergentes de compañeros e instructores en los ambientes de formación sin descalificar.'
  },
  {
    nombre: 'Libre Pensamiento y Actitud Crítica',
    definicion: 'Fomentar la deliberación autónoma, el cuestionamiento argumentado y la búsqueda reflexiva del conocimiento.',
    ejemploCotidiando: 'Proponer soluciones innovadoras a los problemas técnicos planteados en proyectos formativos con sustento investigativo.'
  },
  {
    nombre: 'Liderazgo',
    definicion: 'Capacidad de guiar, inspirar e impulsar el trabajo colaborativo con vocación de servicio y proactividad.',
    ejemploCotidiando: 'Asumir la vocería de ficha o liderar equipos de trabajo en los talleres garantizando la participación de todos.'
  },
  {
    nombre: 'Solidaridad',
    definicion: 'Sensibilidad y compromiso ético frente a las necesidades y dificultades de los demás miembros de la comunidad.',
    ejemploCotidiando: 'Apoyar a compañeros que presentan dificultades pedagógicas o de acceso a conectividad mediante tutorías entre pares.'
  },
  {
    nombre: 'Justicia y Equidad',
    definicion: 'Obrar con imparcialidad, garantizando la igualdad de oportunidades y el debido proceso en toda circunstancia.',
    ejemploCotidiando: 'Cumplir equitativamente con las responsabilidades del equipo sin recargar tareas en los demás aprendices.'
  },
  {
    nombre: 'Transparencia',
    definicion: 'Actuar con honestidad, verdad y claridad en la gestión de evidencias, recursos institucionales e interacciones.',
    ejemploCotidiando: 'Entregar evidencias de autoría propia citando fuentes con rigor y rechazando cualquier práctica de plagio o fraude.'
  },
  {
    nombre: 'Creatividad e Innovación',
    definicion: 'Buscar constantemente nuevas maneras de generar valor, optimizar procesos y transformar productivamente el entorno.',
    ejemploCotidiando: 'Aplicar tecnologías emergentes en la resolución de desafíos reales de las empresas y comunidades aliadas.'
  }
];

export const SENA_SYMBOLS: SymbolItem[] = [
  {
    id: 'escudo',
    nombre: 'El Escudo Institucional',
    descripcion: 'Diseñado en los orígenes de la entidad, sintetiza los tres sectores económicos fundamentales de Colombia donde incide la formación.',
    significadoDetallado: [
      'El Piñón: Representa la fuerza del sector industrial, la mecanización y el avance tecnológico.',
      'El Caduceo: Representa el sector del comercio y los servicios, la concertación y el dinamismo económico.',
      'El Café y el Arado: Simboliza las raíces del sector agropecuario, el trabajo del campo y la seguridad alimentaria de Colombia.'
    ],
    detallesExtra: 'Refleja la integración tripartita (Gobierno, Empresarios y Trabajadores) sobre la cual se sustenta la gobernanza del SENA.'
  },
  {
    id: 'bandera',
    nombre: 'La Bandera Institucional',
    descripcion: 'Consta de un lienzo blanco impecable con el escudo oficial del SENA en el centro.',
    significadoDetallado: [
      'Fondo Blanco: Simboliza la paz, la serenidad, la transparencia y la universalidad del conocimiento.',
      'Escudo Central: Representa el compromiso patriótico de transformar vidas y generar empleo digno en las 33 regionales de Colombia.'
    ],
    detallesExtra: 'Se iza en todos los centros de formación y actos protocolarios junto al pabellón nacional de la República de Colombia.'
  },
  {
    id: 'logosimbolo',
    nombre: 'El Logo-Símbolo',
    descripcion: 'Icono gráfico universal del SENA reconocido en todo el país y en el exterior.',
    significadoDetallado: [
      'La Figura Humana: Representa al aprendiz como centro del proceso pedagógico, erguido y mirando con optimismo hacia el porvenir.',
      'Los Senderos que se Abren: Simbolizan los diversos caminos y oportunidades ocupacionales que el SENA brinda para la realización personal y profesional.',
      'El Punto Superior: Representa la mente, la creatividad y la proyección del ser humano.'
    ],
    detallesExtra: 'El color verde institucional SENA transmite esperanza, vitalidad, sostenibilidad ecológica y crecimiento constante.'
  },
  {
    id: 'himno',
    nombre: 'Himno del SENA',
    descripcion: 'Letra escrita por el poeta Luis Alfredo Osorio y musicalizada por Daniel Marlez.',
    significadoDetallado: [
      'Coro Emblemático: "Estudiantes del SENA adelante / por Colombia luchad con amor / con el ánimo noble y radiante / transformemos el mundo en mejor."',
      'Estrofa I: "De la patria el futuro destino / en las manos del joven está / el trabajo es seguro camino / que el progreso a Colombia dará."',
      'Estrofa II: "En la forja del SENA se forman / hombres libres que saben triunfar / con el brazo y la mente transforman / y conquistan la tierra y el mar."'
    ],
    detallesExtra: 'Es entonado obligatoriamente en inducciones, ceremonias de certificación y eventos solemnes de la institución.'
  }
];

export const SENA_REGULATION_INFO = {
  acuerdoVigente: 'Acuerdo 009 de 2024',
  denominacion: 'Reglamento del Aprendiz SENA',
  fechaExpedicion: '5 de noviembre de 2024',
  organoEmisor: 'Consejo Directivo Nacional del SENA',
  estado: 'Vigente',
  acuerdoDerogado: 'Acuerdo 007 de 2012 (derogado formalmente en su totalidad junto con los Acuerdos 02 de 2014, 06 de 2023 y 02 de 2024)',
  descripcion: 'Norma marco compilada y modernizada que regula los derechos, deberes, prohibiciones, medidas formativas, trámites de matrícula y debido proceso para todos los aprendices del SENA a nivel nacional.',
  pilaresClave: [
    'Enfoque diferencial, equidad de género, no discriminación e inclusión con ajustes razonables.',
    'Ruta de atención integral para la prevención de violencias de género y hostigamiento (Ley 2365 de 2024).',
    'Actualización de directrices para modalidades presencial, virtual y a distancia con uso de nuevas tecnologías.',
    'Fortalecimiento de la etapa productiva, garantías del debido proceso y desarrollo humano a través de Bienestar.'
  ]
};

export const RIGHTS_LIST: RightOrDuty[] = [
  {
    id: 'der-01',
    tipo: 'derecho',
    articulo: 'Acuerdo 009 de 2024, Cap. II, Art. 12',
    categoria: 'Académico',
    titulo: 'Formación Profesional Integral de Calidad',
    descripcion: 'Recibir formación integral de acuerdo con el diseño curricular del programa, con instructores competentes, metodologías actualizadas y ambientes idóneos de aprendizaje.',
    implicacionPractica: 'El aprendiz tiene derecho a contar con planeación pedagógica, guías de aprendizaje y recursos tecnológicos necesarios para su desarrollo profesional.'
  },
  {
    id: 'der-02',
    tipo: 'derecho',
    articulo: 'Acuerdo 009 de 2024, Cap. II, Art. 13',
    categoria: 'Académico',
    titulo: 'Retroalimentación y Evaluación Oportuna',
    descripcion: 'Conocer oportunamente las calificaciones, observaciones y juicios evaluativos, recibiendo retroalimentación cualitativa dentro de los cinco (5) días hábiles siguientes a la entrega de evidencias.',
    implicacionPractica: 'Si entregas una evidencia, el instructor debe calificarla en la plataforma LMS y explicarte tus aciertos y oportunidades de mejora.'
  },
  {
    id: 'der-03',
    tipo: 'derecho',
    articulo: 'Acuerdo 009 de 2024, Cap. II, Art. 14',
    categoria: 'Académico',
    titulo: 'Uso de Ambientes, Equipos y Biblioteca',
    descripcion: 'Utilizar las instalaciones, laboratorios, talleres, equipos, herramientas, bibliotecas y plataformas tecnológicas institucionales (Sofia Plus y Zajuna) para fines formativos.',
    implicacionPractica: 'Acceso a equipos de cómputo, internet institucional, bibliotecas especializadas y laboratorios debidamente dotados.'
  },
  {
    id: 'der-04',
    tipo: 'derecho',
    articulo: 'Acuerdo 009 de 2024, Cap. II, Art. 15',
    categoria: 'Institucional',
    titulo: 'Identificación Institucional (Carné)',
    descripcion: 'Obtener oportunamente el carné institucional que lo acredita como aprendiz activo del SENA durante todo el período de formación.',
    implicacionPractica: 'El carné te permite ingresar a los centros de formación, acceder a bibliotecas, convenios de transporte y beneficios estudiantiles.'
  },
  {
    id: 'der-05',
    tipo: 'derecho',
    articulo: 'Acuerdo 009 de 2024, Cap. II, Art. 16',
    categoria: 'Bienestar y Salud',
    titulo: 'Acceso a Programas de Bienestar al Aprendiz',
    descripcion: 'Beneficiarse de los planes de salud preventiva, deporte, recreación, cultura, orientación psicopedagógica, monitorías y apoyos de sostenimiento (FIC y regular).',
    implicacionPractica: 'Puedes postularte a subsidios económicos de transporte/alimentación y participar en torneos deportivos y grupos artísticos.'
  },
  {
    id: 'der-06',
    tipo: 'derecho',
    articulo: 'Acuerdo 009 de 2024, Cap. II y Acuerdo 002 de 2026',
    categoria: 'Convivencia y Ética',
    titulo: 'Garantía del Debido Proceso y Defensa',
    descripcion: 'Ser escuchado en descargos, aportar y controvertir pruebas, contar con asistencia y representación de voceros, y garantías plenas en cualquier comité de evaluación y seguimiento.',
    implicacionPractica: 'Nadie puede ser sancionado sin previa notificación formal y sin la oportunidad de exponer sus razones con pruebas (actualizado con Acuerdo 002 de 2026).'
  },
  {
    id: 'der-07',
    tipo: 'derecho',
    articulo: 'Acuerdo 009 de 2024, Cap. II, Art. 18',
    categoria: 'Convivencia y Ética',
    titulo: 'Libertad de Expresión y Representación',
    descripcion: 'Elegir y ser elegido como Vocero de Ficha o Representante de Aprendices, participando activamente en los espacios de concertación institucional.',
    implicacionPractica: 'Voz activa en los consejos directivos de centro y comités para canalizar las necesidades colectivas de tus compañeros.'
  },
  {
    id: 'der-08',
    tipo: 'derecho',
    articulo: 'Acuerdo 009 de 2024, Cap. II, Art. 19',
    categoria: 'Convivencia y Ética',
    titulo: 'Enfoque Diferencial, Inclusión y Ajustes Razonables',
    descripcion: 'Recibir trato digno sin discriminación por género, etnia, credo, discapacidad o condición social, con derecho a ajustes razonables y apoyos pedagógicos inclusivos.',
    implicacionPractica: 'Garantía de accesibilidad universal, enfoque diferencial y entornos inclusivos en todos los programas.'
  },
  {
    id: 'der-09',
    tipo: 'derecho',
    articulo: 'Acuerdo 009 de 2024 y Ley 2365 de 2024',
    categoria: 'Convivencia y Ética',
    titulo: 'Entornos Libres de Violencias y Acoso',
    descripcion: 'Disfrutar de ambientes educativos seguros, respetuosos y libres de cualquier forma de acoso, hostigamiento, intimidación o violencia de género.',
    implicacionPractica: 'Activación inmediata de rutas institucionales de protección y atención integral ante conductas de acoso.'
  },
  {
    id: 'der-10',
    tipo: 'derecho',
    articulo: 'Acuerdo 009 de 2024, Cap. II, Art. 21',
    categoria: 'Académico',
    titulo: 'Participación en Convocatorias de Estímulos y Etapa Productiva',
    descripcion: 'Postularse a opciones de etapa productiva reguladas (contrato de aprendizaje, pasantía, proyecto productivo, monitoría) y estímulos a la excelencia académica.',
    implicacionPractica: 'Orientación institucional para la consecución de patrocinio empresarial y alternativas de vinculación laboral.'
  }
];

export const DUTIES_LIST: RightOrDuty[] = [
  {
    id: 'deb-01',
    tipo: 'deber',
    articulo: 'Acuerdo 009 de 2024, Cap. III, Art. 25',
    categoria: 'Académico',
    titulo: 'Cumplimiento y Puntualidad en el Calendario',
    descripcion: 'Cumplir a cabalidad con las actividades programadas en la ruta formativa, asistiendo puntualmente a las sesiones presenciales y sincrónicas virtuales.',
    implicacionPractica: 'Llegar a tiempo a las sesiones presenciales o sincrónicas; no abandonar el ambiente de formación sin previa autorización del instructor.'
  },
  {
    id: 'deb-02',
    tipo: 'deber',
    articulo: 'Acuerdo 009 de 2024, Cap. III, Art. 26',
    categoria: 'Académico',
    titulo: 'Justificación Oportuna de Inasistencias',
    descripcion: 'Informar y justificar debidamente ante el instructor cualquier inasistencia dentro de los tres (3) días hábiles siguientes al suceso, adjuntando soportes válidos.',
    implicacionPractica: 'Presentar incapacidad médica expedida por EPS o calamidad doméstica documentada; tres días sin justificar acarrean deserción.'
  },
  {
    id: 'deb-03',
    tipo: 'deber',
    articulo: 'Acuerdo 009 de 2024, Cap. III, Art. 27',
    categoria: 'Institucional',
    titulo: 'Porte Digno del Carné y del Uniforme',
    descripcion: 'Portar en lugar visible el carné institucional y vestir el uniforme establecido con decoro, respeto y pulcritud dentro y fuera del centro de formación.',
    implicacionPractica: 'El carné debe lucirse en el pecho; el uniforme representa a la institución en empresas, visitas técnicas y espacios públicos.'
  },
  {
    id: 'deb-04',
    tipo: 'deber',
    articulo: 'Acuerdo 009 de 2024, Cap. III, Art. 28',
    categoria: 'Convivencia y Ética',
    titulo: 'Integridad Académica y Cero Plagio',
    descripcion: 'Elaborar de manera honesta y con autoría propia las evidencias de aprendizaje, citando rigurosamente fuentes y respetando los derechos de autor.',
    implicacionPractica: 'Copiar trabajos de internet o de otros compañeros es considerado falta grave sancionable con cancelación de matrícula.'
  },
  {
    id: 'deb-05',
    tipo: 'deber',
    articulo: 'Acuerdo 009 de 2024, Cap. III, Art. 29',
    categoria: 'Bienestar y Salud',
    titulo: 'Seguridad y Salud en el Trabajo (SST)',
    descripcion: 'Utilizar adecuadamente los Elementos de Protección Personal (EPP) y acatar estrictamente los protocolos de seguridad industrial en laboratorios y talleres.',
    implicacionPractica: 'En talleres de mecatrónica, cocina, construcción o confección, el uso de EPP es obligatorio para preservar tu integridad física.'
  },
  {
    id: 'deb-06',
    tipo: 'deber',
    articulo: 'Acuerdo 009 de 2024, Cap. III, Art. 30',
    categoria: 'Institucional',
    titulo: 'Cuidado y Custodia de Bienes e Instalaciones',
    descripcion: 'Cuidar con diligencia equipos, herramientas, mobiliario, software y recursos tecnológicos puestos al servicio de la formación profesional.',
    implicacionPractica: 'Reportar daños imprevistos y abstenerse de manipular equipos sin orientación previa del instructor a cargo.'
  },
  {
    id: 'deb-07',
    tipo: 'deber',
    articulo: 'Acuerdo 009 de 2024, Cap. III, Art. 31',
    categoria: 'Académico',
    titulo: 'Uso Ético y Responsable de las TIC y Plataformas',
    descripcion: 'Hacer uso responsable de las plataformas LMS, Zajuna, Sofia Plus y correos institucionales, evitando conductas de suplantación o uso indebido.',
    implicacionPractica: 'No compartir claves de acceso a Sofia Plus y utilizar las plataformas exclusivamente para fines académicos y formativos.'
  },
  {
    id: 'deb-08',
    tipo: 'deber',
    articulo: 'Acuerdo 009 de 2024, Cap. III, Art. 32',
    categoria: 'Convivencia y Ética',
    titulo: 'Respeto por la Diversidad y Convivencia Pacífica',
    descripcion: 'Mantener relaciones de respeto, solidaridad y tolerancia con instructores, compañeros, administrativos y personal de la comunidad educativa.',
    implicacionPractica: 'Fomentar un clima armónico de diálogo constructivo y resolución pacífica de diferencias en los ambientes formativos.'
  },
  {
    id: 'deb-09',
    tipo: 'deber',
    articulo: 'Acuerdo 009 de 2024, Cap. III, Art. 33',
    categoria: 'Institucional',
    titulo: 'Actualización Oportuna de Datos Personales',
    descripcion: 'Mantener actualizados los datos de contacto, dirección, teléfono y correo electrónico en el sistema Sofia Plus.',
    implicacionPractica: 'Garantizar que las notificaciones de citaciones o avisos institucionales lleguen oportunamente al aprendiz.'
  },
  {
    id: 'deb-10',
    tipo: 'deber',
    articulo: 'Acuerdo 009 de 2024, Cap. III, Art. 34',
    categoria: 'Académico',
    titulo: 'Participación Activa en Etapa Lectiva y Productiva',
    descripcion: 'Desarrollar con compromiso las actividades de aprendizaje y cumplir rigurosamente las obligaciones pactadas en la alternativa de etapa productiva.',
    implicacionPractica: 'Cumplir el reglamento interno de la empresa patrocinadora o los lineamientos del proyecto productivo.'
  }
];

export const PROHIBITIONS_LIST: RightOrDuty[] = [
  {
    id: 'pro-01',
    tipo: 'prohibicion',
    articulo: 'Acuerdo 009 de 2024, Cap. III, Art. 38',
    categoria: 'Convivencia y Ética',
    titulo: 'Sustancias Psicoactivas y Alcohol',
    descripcion: 'Ingresar, comercializar, portar o consumir bebidas alcohólicas, estupefacientes o sustancias psicoactivas en instalaciones del SENA o centros de práctica.',
    implicacionPractica: 'Falta gravísima causal inmediata de cancelación definitiva de matrícula.'
  },
  {
    id: 'pro-02',
    tipo: 'prohibicion',
    articulo: 'Acuerdo 009 de 2024, Cap. III, Art. 39',
    categoria: 'Convivencia y Ética',
    titulo: 'Porte de Armas o Elementos Peligrosos',
    descripcion: 'Portar o ingresar cualquier tipo de arma de fuego, cortopunzante, neumática o artefacto explosivo dentro de las sedes institucionales.',
    implicacionPractica: 'Vulnera la seguridad comunitaria y acarrea acciones penales y disciplinarias.'
  },
  {
    id: 'pro-03',
    tipo: 'prohibicion',
    articulo: 'Acuerdo 009 de 2024, Cap. III, Art. 40',
    categoria: 'Académico',
    titulo: 'Suplantación y Fraude en Pruebas o Asistencia',
    descripcion: 'Suplantar o permitir ser suplantado en evaluaciones, registros de asistencia, trabajos o trámites institucionales del SENA.',
    implicacionPractica: 'Falsedad ideológica que anula el proceso formativo de las partes involucradas y activa Comité.'
  },
  {
    id: 'pro-04',
    tipo: 'prohibicion',
    articulo: 'Acuerdo 009 de 2024 y Ley 2365 de 2024',
    categoria: 'Convivencia y Ética',
    titulo: 'Violencia, Acoso, Ciberacoso y Hostigamiento',
    descripcion: 'Incurrir en actos de acoso sexual, ciberacoso, intimidación, matoneo, discriminación o agresiones físicas y psicológicas contra cualquier integrante.',
    implicacionPractica: 'Falta gravísima con aplicación inmediata de protocolos de protección de la Ley 2365 de 2024 y cancelación de matrícula.'
  },
  {
    id: 'pro-05',
    tipo: 'prohibicion',
    articulo: 'Acuerdo 009 de 2024, Cap. III, Art. 42',
    categoria: 'Institucional',
    titulo: 'Hurto, Daño Intencional o Fraude Patrimonial',
    descripcion: 'Apoderarse de bienes institucionales o ajenos, causar daños intencionales a equipos, instalaciones o apropiarse indebidamente de recursos.',
    implicacionPractica: 'Causal de cancelación de matrícula y reporte a las autoridades competentes.'
  },
  {
    id: 'pro-06',
    tipo: 'prohibicion',
    articulo: 'Acuerdo 009 de 2024, Cap. III, Art. 43',
    categoria: 'Convivencia y Ética',
    titulo: 'Falsificación de Documentos y Soportes',
    descripcion: 'Adulterar incapacidades médicas, firmas de instructores, constancias de estudio, certificados o soportes presentados al centro de formación.',
    implicacionPractica: 'Falta gravísima que atenta contra la fe pública y la probidad ética exigida en el SENA.'
  }
];

export const PROCEDURES_LIST: ProcedureItem[] = [
  {
    id: 'proc-01',
    nombre: 'Traslado',
    concepto: 'Solicitud del aprendiz para continuar su formación en otra jornada, centro de formación o programa afín.',
    plazo: 'Se solicita al culminar el período académico o trimestre, antes de iniciar el siguiente.',
    requisitos: [
      'Estar al día académicamente y no tener sanciones vigentes.',
      'Disponibilidad de cupo en la sede o jornada de destino.',
      'Aprobación de los subdirectores de ambos centros.'
    ],
    consecuencia: 'Permite conservar el historial académico sin perder el avance de competencias.'
  },
  {
    id: 'proc-02',
    nombre: 'Aplazamiento',
    concepto: 'Suspensión temporal justificada de los estudios por motivos de fuerza mayor, enfermedad comprobada, servicio militar o maternidad.',
    plazo: 'Máximo hasta por seis (6) meses continuos o discontinuos durante todo el programa.',
    requisitos: [
      'Radicar solicitud formal por escrito o por Sofia Plus / Zajuna.',
      'Adjuntar soportes probatorios fehacientes.',
      'Concepto favorable del Coordinador de Formación.'
    ],
    consecuencia: 'El aprendiz conserva su cupo y al reingresar continuará en el trimestre equivalente.'
  },
  {
    id: 'proc-03',
    nombre: 'Reingreso',
    concepto: 'Trámite mediante el cual el aprendiz que suspendió voluntariamente mediante aplazamiento formal reanuda su formación.',
    plazo: 'Debe radicarse al menos quince (15) días antes de la fecha en que vence el aplazamiento.',
    requisitos: [
      'Haber tenido aplazamiento formalmente aprobado.',
      'Existencia de oferta del programa o homologación curricular si el diseño cambió.'
    ],
    consecuencia: 'Reincorporación a la etapa lectiva o productiva correspondiente.'
  },
  {
    id: 'proc-04',
    nombre: 'Retiro Voluntario',
    concepto: 'Manifestación expresa del aprendiz de desistir definitivamente de su condición de matriculado por motivos personales.',
    plazo: 'Se puede radicar en cualquier momento de la formación lectiva.',
    requisitos: [
      'Carta firmada explicando las causas del retiro.',
      'Paz y salvo de biblioteca, inventarios y bienestar.'
    ],
    consecuencia: 'Sanción preventiva de seis (6) meses sin poder postularse a nuevas convocatorias de formación titulada en el SENA.'
  },
  {
    id: 'proc-05',
    nombre: 'Deserción y Cancelación de Matrícula',
    concepto: 'Pérdida de la condición de aprendiz por inasistencia injustificada o abandono del proceso formativo.',
    plazo: 'Se configura tras tres (3) días hábiles consecutivos de inasistencia sin justificación.',
    requisitos: [
      'El centro envía citación formal para que el aprendiz justifique en 5 días hábiles.',
      'Si no responde o la justificación no es válida, se expide acto administrativo de cancelación.'
    ],
    consecuencia: 'Sanción de inhabilidad de seis (6) meses o un (1) año en el sistema del SENA.'
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'caso-01',
    titulo: 'Inasistencia por Emergencia Médica y el Tiempo Reglamentario',
    contexto: 'Camilo, aprendiz de Gestión Logística, sufre un accidente en bicicleta un martes por la tarde y es incapacitado por su médico durante 4 días. El viernes un compañero le dice que espere a regresar el próximo lunes para avisar.',
    situacion: '¿Cuál es el procedimiento correcto que debe seguir Camilo según el Reglamento del Aprendiz vigente?',
    opciones: [
      {
        id: 'opt-1a',
        texto: 'Esperar a regresar la siguiente semana y hablar informalmente con el instructor en el pasillo.',
        esCorrecta: false,
        retroalimentacion: 'Incorrecto. Superaría el límite de los tres (3) días hábiles establecidos en el Acuerdo 009 de 2024 y se podría iniciar proceso por presunta deserción.',
        fundamentoReglamento: 'Acuerdo 009 de 2024, Cap. III: El aprendiz debe justificar dentro de los 3 días hábiles.'
      },
      {
        id: 'opt-1b',
        texto: 'Notificar de inmediato por correo o mensaje formal al instructor y radicar la incapacidad de la EPS dentro de los 3 días hábiles.',
        esCorrecta: true,
        retroalimentacion: '¡Excelente! Actúa con responsabilidad y protege su matrícula cumpliendo con el plazo perentorio de 3 días hábiles adjuntando soporte oficial.',
        fundamentoReglamento: 'Acuerdo 009 de 2024, Cap. III: Obligación de justificar oportunamente con soportes válidos de EPS.'
      },
      {
        id: 'opt-1c',
        texto: 'No preocuparse porque los compañeros le guardan la asistencia y le entregan los talleres después.',
        esCorrecta: false,
        retroalimentacion: 'Incorrecto. La suplantación o encubrimiento de firmas es una falta disciplinaria sancionable.',
        fundamentoReglamento: 'Acuerdo 009 de 2024, Cap. III: Prohibición expresa de fraude en asistencia.'
      }
    ]
  },
  {
    id: 'caso-02',
    titulo: 'Uso de Código y Material de Internet en una Evidencia Técnica',
    contexto: 'Mariana debe entregar un proyecto de desarrollo web. Encontró en GitHub un repositorio completo que cumple exactamente con los requisitos de la guía. Decide copiar el 90% del proyecto sin citar la fuente ni mencionar al autor.',
    situacion: '¿Cómo tipifica el Reglamento del Aprendiz vigente esta conducta?',
    opciones: [
      {
        id: 'opt-2a',
        texto: 'Es una falta académica y disciplinaria grave por plagio y violación a la propiedad intelectual, pasible de comité disciplinario.',
        esCorrecta: true,
        retroalimentacion: '¡Correcto! El SENA promueve la formación con honestidad y rigor. El plagio atenta contra la ética profesional y conlleva llamado de atención escrito o condicionamiento de matrícula.',
        fundamentoReglamento: 'Acuerdo 009 de 2024, Cap. III: Obligación de autoría propia y respeto a derechos morales de autor.'
      },
      {
        id: 'opt-2b',
        texto: 'Es totalmente válido porque el software libre permite copiar sin ninguna necesidad de citar autores ni aprender la lógica.',
        esCorrecta: false,
        retroalimentacion: 'Incorrecto. Incluso en software de código abierto (Open Source), la formación requiere evidenciar el aprendizaje propio y atribuir licencias.',
        fundamentoReglamento: 'Principios de Formación Integral y Evaluación por Competencias.'
      },
      {
        id: 'opt-2c',
        texto: 'Solo es reprochable si el instructor se da cuenta; si no, cuenta como evidencia aprobada.',
        esCorrecta: false,
        retroalimentacion: 'Incorrecto. Transgrede el valor institucional de la Transparencia y la Ética del Aprendiz.',
        fundamentoReglamento: 'Código de Integridad y Estatuto del Aprendiz.'
      }
    ]
  },
  {
    id: 'caso-03',
    titulo: 'Dificultad Personal Grave que Impide Continuar Este Trimestre',
    contexto: 'Felipe debe viajar de urgencia a cuidar a su madre enferma en una vereda sin señal durante los próximos 4 meses. Está cursando el segundo trimestre con excelentes notas.',
    situacion: '¿Qué figura reglamentaria debe solicitar para no perder su cupo en el SENA?',
    opciones: [
      {
        id: 'opt-3a',
        texto: 'Dejar de asistir y reaparecer 4 meses después diciendo que tenía problemas familiares.',
        esCorrecta: false,
        retroalimentacion: 'Incorrecto. A los 3 días de inasistencia consecutiva se iniciará el proceso de cancelación por deserción y quedará inhabilitado por 6 meses.',
        fundamentoReglamento: 'Acuerdo 009 de 2024: Procedimiento de Deserción del proceso de formación.'
      },
      {
        id: 'opt-3b',
        texto: 'Radicar formalmente una solicitud de Aplazamiento por fuerza mayor adjuntando evidencias antes de ausentarse.',
        esCorrecta: true,
        retroalimentacion: '¡Exacto! El aplazamiento permite suspender los estudios hasta por 6 meses conservando su cupo y calificaciones para reintegrarse legalmente.',
        fundamentoReglamento: 'Acuerdo 009 de 2024: Trámite de aplazamiento justificado.'
      },
      {
        id: 'opt-3c',
        texto: 'Solicitar un retiro voluntario inmediato con sanción para empezar de cero el próximo año.',
        esCorrecta: false,
        retroalimentacion: 'Incorrecto. El retiro voluntario acarrea sanción de 6 meses sin poder inscribirse, mientras que el aplazamiento no sanciona y protege su avance.',
        fundamentoReglamento: 'Acuerdo 009 de 2024: Retiro voluntario vs Aplazamiento justificado.'
      }
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-01',
    eje: 'identidad',
    enunciado: '¿Cuáles son los tres sectores económicos que representan los elementos del Escudo Oficial del SENA?',
    contextoOpcional: 'Símbolos institucionales y heráldica del SENA',
    opciones: [
      'Sector Minero, Sector Financiero y Sector Tecnológico.',
      'Sector Industrial (piñón), Sector Comercio y Servicios (caduceo) y Sector Agropecuario (café y arado).',
      'Sector Petrolero, Sector Salud y Sector Educativo.',
      'Sector Transporte, Sector Turístico y Sector Marítimo.'
    ],
    indiceCorrecto: 1,
    explicacion: 'El escudo del SENA integra el piñón (industria), el caduceo (comercio y servicios) y la rama de café con el arado (sector agropecuario).',
    articuloReglamento: 'Identidad Institucional SENA - Símbolos Oficiales'
  },
  {
    id: 'q-02',
    eje: 'identidad',
    enunciado: '¿Qué representa la figura humana y los caminos en el Logo-Símbolo característico del SENA?',
    opciones: [
      'Al aprendiz como centro del proceso, erguido hacia el futuro sobre los múltiples caminos y horizontes ocupacionales.',
      'Una señal de tránsito que indica giro obligatorio en talleres industriales.',
      'Una antena repetidora de telecomunicaciones satelitales.',
      'El plano arquitectónico de la sede central de la dirección general en Bogotá.'
    ],
    indiceCorrecto: 0,
    explicacion: 'El logo-símbolo simboliza al aprendiz como protagonista de su formación, avanzando con dignidad por senderos de oportunidades técnicas y humanas.',
    articuloReglamento: 'Manual de Imagen e Identidad SENA'
  },
  {
    id: 'q-03',
    eje: 'identidad',
    enunciado: '¿En qué año fue fundado el SENA y quién fue su principal gestor e impulsor?',
    opciones: [
      'En 1980 por iniciativa de la UNESCO.',
      'En 1957, gracias a la visión y liderazgo de Rodolfo Martínez Tono.',
      'En 1991 junto con la nueva Constitución Política de Colombia.',
      'En 1945 al culminar la Segunda Guerra Mundial.'
    ],
    indiceCorrecto: 1,
    explicacion: 'El SENA nació mediante el Decreto Ley 118 del 21 de junio de 1957 por iniciativa del economista cartagenero Rodolfo Martínez Tono.',
    articuloReglamento: 'Historia y Memoria Institucional SENA'
  },
  {
    id: 'q-04',
    eje: 'derechos',
    enunciado: 'Según el Acuerdo 009 de 2024 (Reglamento del Aprendiz vigente), ¿cuál es el plazo para evaluar y retroalimentar las evidencias entregadas?',
    opciones: [
      'Hasta el último día del año lectivo.',
      'Máximo dentro de los cinco (5) días hábiles siguientes a la entrega.',
      'Treinta (30) días calendario sin importar la fecha de cierre.',
      'No existe plazo definido, queda a discreción exclusiva del instructor.'
    ],
    indiceCorrecto: 1,
    explicacion: 'El Reglamento del Aprendiz vigente estipula que las evidencias deben evaluarse y retroalimentarse dentro de los 5 días hábiles siguientes.',
    articuloReglamento: 'Acuerdo 009 de 2024, Cap. II (Derechos del Aprendiz)'
  },
  {
    id: 'q-05',
    eje: 'derechos',
    enunciado: '¿Cuál de los siguientes es un DERECHO fundamental consagrado en el Reglamento del Aprendiz SENA (Acuerdo 009 de 2024)?',
    opciones: [
      'Modificar a su conveniencia los horarios de los talleres sin consentimiento del centro.',
      'Ser escuchado en descargos, contar con las garantías del debido proceso y trato digno sin discriminación con enfoque diferencial.',
      'Ingresar a los ambientes de formación con prendas no aptas para la seguridad del taller.',
      'Exigir que se le aprueben evidencias sin cumplir los criterios mínimos de la guía de aprendizaje.'
    ],
    indiceCorrecto: 1,
    explicacion: 'El debido proceso, el enfoque diferencial y el derecho a la defensa y contradicción son garantías inviolables consagradas en el Acuerdo 009 de 2024.',
    articuloReglamento: 'Acuerdo 009 de 2024, Cap. II (Derechos del Aprendiz)'
  },
  {
    id: 'q-06',
    eje: 'deberes',
    enunciado: 'Si un aprendiz presenta una inasistencia a sus actividades de formación por una calamidad o incapacidad médica, ¿cuánto tiempo tiene para justificarla formalmente?',
    opciones: [
      'Hasta un mes después de ocurrida la inasistencia.',
      'Dentro de los tres (3) días hábiles siguientes al hecho con el debido soporte.',
      'En la semana de inducción del siguiente trimestre.',
      'No es necesario justificar si el vocero avisa en el grupo de WhatsApp.'
    ],
    indiceCorrecto: 1,
    explicacion: 'El aprendiz tiene la obligación ineludible de radicar o entregar el soporte médico/legal dentro de los 3 días hábiles posteriores.',
    articuloReglamento: 'Acuerdo 009 de 2024, Cap. III (Deberes del Aprendiz)'
  },
  {
    id: 'q-07',
    eje: 'deberes',
    enunciado: 'Respecto al porte del carné institucional y uniforme, ¿qué estipula el deber del aprendiz en el Acuerdo 009 de 2024?',
    opciones: [
      'Solo se debe portar si hay inspección de la Policía Nacional.',
      'Portar el carné en lugar visible y vestir el uniforme con dignidad, respeto y decoro en ambientes de aprendizaje y práctica.',
      'Prestar el carné a familiares o amigos para que ingresen a la biblioteca libremente.',
      'Guardar el carné en la billetera y no mostrarlo a los guardas de seguridad del centro.'
    ],
    indiceCorrecto: 1,
    explicacion: 'El carné institucional es personal e intransferible y debe portarse en el pecho en todo momento en las instalaciones del SENA y empresas.',
    articuloReglamento: 'Acuerdo 009 de 2024, Cap. III (Deberes del Aprendiz)'
  },
  {
    id: 'q-08',
    eje: 'deberes',
    enunciado: 'En los talleres técnicos y laboratorios, ¿cuál es el deber del aprendiz en Seguridad y Salud en el Trabajo (SST)?',
    opciones: [
      'Utilizar obligatoriamente los Elementos de Protección Personal (EPP) y respetar las normas de bioseguridad y prevención de riesgos.',
      'Trabajar sin guantes ni gafas protectoras para tener mayor agilidad manual.',
      'Alterar los dispositivos de seguridad de las máquinas industriales para que funcionen más rápido.',
      'Desconectar las alarmas de incendio si hacen demasiado ruido.'
    ],
    indiceCorrecto: 0,
    explicacion: 'El autocuidado y el uso riguroso de EPP protegen la vida del aprendiz y la de sus compañeros de taller.',
    articuloReglamento: 'Acuerdo 009 de 2024, Cap. III (Deberes del Aprendiz)'
  },
  {
    id: 'q-09',
    eje: 'tramites',
    enunciado: '¿Por cuánto tiempo máximo se puede autorizar la figura de Aplazamiento de la formación a un aprendiz?',
    opciones: [
      'Indefinidamente hasta que el aprendiz decida regresar.',
      'Hasta por seis (6) meses continuos o discontinuos por causas justificadas.',
      'Solo por 48 horas continuas.',
      'Por un período máximo de tres (3) años sin soporte alguno.'
    ],
    indiceCorrecto: 1,
    explicacion: 'El aplazamiento se concede por un término máximo de 6 meses debidamente soportado ante la coordinación académica.',
    articuloReglamento: 'Acuerdo 009 de 2024 (Trámites de Matrícula)'
  },
  {
    id: 'q-10',
    eje: 'tramites',
    enunciado: '¿Cuándo se configura la "Deserción" en el proceso de formación presencial o virtual según el Acuerdo 009 de 2024?',
    opciones: [
      'Cuando el aprendiz llega 5 minutos tarde a una sesión.',
      'Cuando transcurren tres (3) días hábiles consecutivos de inasistencia injustificada sin reporte alguno.',
      'Cuando el aprendiz reprueba un único taller práctico.',
      'Cuando solicita cambio de jornada laboral en su empresa.'
    ],
    indiceCorrecto: 1,
    explicacion: 'La inasistencia durante 3 días hábiles consecutivos sin causa justificada activa el proceso administrativo de deserción y cancelación.',
    articuloReglamento: 'Acuerdo 009 de 2024 (Procedimiento de Deserción)'
  },
  {
    id: 'q-11',
    eje: 'tramites',
    enunciado: '¿Qué es el Comité de Evaluación y Seguimiento en un Centro de Formación del SENA?',
    opciones: [
      'Un órgano asesor que investiga y analiza el desempeño académico y disciplinario de los aprendices recomendando medidas formativas y garantizando el debido proceso.',
      'Una empresa privada contratada para vigilar el parqueadero de los centros de formación.',
      'El grupo que organiza únicamente los bailes y torneos de fútbol del centro.',
      'Una junta financiera encargada de vender uniformes a los estudiantes.'
    ],
    indiceCorrecto: 0,
    explicacion: 'El Comité está integrado por instructores, coordinación, bienestar y el vocero de aprendices para garantizar un debido proceso.',
    articuloReglamento: 'Acuerdo 009 de 2024 (Comités de Evaluación y Seguimiento)'
  },
  {
    id: 'q-12',
    eje: 'deberes',
    enunciado: 'El aprendiz Camilo descarga un software pirata o incurre en actos de violencia o acoso. Según el Acuerdo 009 de 2024, estas conductas son consideradas:',
    opciones: [
      'Un mérito de innovación digital y recursividad.',
      'Faltas graves o gravísimas sancionables con condicionamiento o cancelación de matrícula.',
      'Acciones normales que no están reguladas en ninguna normativa.',
      'Un derecho consagrado en el bienestar del aprendiz.'
    ],
    indiceCorrecto: 1,
    explicacion: 'Vulnerar la seguridad informática o incurrir en violencias/acoso son faltas tipificadas taxativamente en el régimen disciplinario del Acuerdo 009 de 2024.',
    articuloReglamento: 'Acuerdo 009 de 2024, Cap. III (Prohibiciones y Régimen Disciplinario)'
  }
];

export const INITIAL_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'att-001',
    aprendizId: 'apr-001',
    nombreAprendiz: 'Juan Sebastián Morales Castro',
    ficha: '2824901',
    programa: 'Análisis y Desarrollo de Software',
    fecha: '2026-10-25 09:30',
    puntaje: 92,
    aprobado: true,
    respuestas: {
      'q-01': 1, 'q-02': 0, 'q-03': 1, 'q-04': 1,
      'q-05': 1, 'q-06': 1, 'q-07': 1, 'q-08': 0,
      'q-09': 1, 'q-10': 1, 'q-11': 0, 'q-12': 0 // falló q-12
    },
    desgloseEjes: {
      identidad: 100,
      derechos: 100,
      deberes: 80,
      tramites: 100
    }
  },
  {
    id: 'att-002',
    aprendizId: 'apr-002',
    nombreAprendiz: 'Valentina Restrepo Gómez',
    ficha: '2824901',
    programa: 'Análisis y Desarrollo de Software',
    fecha: '2026-10-25 10:15',
    puntaje: 83,
    aprobado: true,
    respuestas: {
      'q-01': 1, 'q-02': 0, 'q-03': 1, 'q-04': 0,
      'q-05': 1, 'q-06': 1, 'q-07': 1, 'q-08': 0,
      'q-09': 0, 'q-10': 1, 'q-11': 0, 'q-12': 1
    },
    desgloseEjes: {
      identidad: 100,
      derechos: 50,
      deberes: 100,
      tramites: 67
    }
  },
  {
    id: 'att-003',
    aprendizId: 'apr-003',
    nombreAprendiz: 'Carlos Andrés Palacios Quinto',
    ficha: '2824901',
    programa: 'Análisis y Desarrollo de Software',
    fecha: '2026-10-25 11:00',
    puntaje: 67,
    aprobado: false,
    respuestas: {
      'q-01': 0, 'q-02': 0, 'q-03': 1, 'q-04': 2,
      'q-05': 1, 'q-06': 0, 'q-07': 1, 'q-08': 0,
      'q-09': 1, 'q-10': 0, 'q-11': 0, 'q-12': 1
    },
    desgloseEjes: {
      identidad: 67,
      derechos: 50,
      deberes: 75,
      tramites: 67
    }
  },
  {
    id: 'att-004',
    aprendizId: 'apr-004',
    nombreAprendiz: 'Diana Marcela Echeverri Hoyos',
    ficha: '2824901',
    programa: 'Análisis y Desarrollo de Software',
    fecha: '2026-10-26 14:20',
    puntaje: 100,
    aprobado: true,
    respuestas: {
      'q-01': 1, 'q-02': 0, 'q-03': 1, 'q-04': 1,
      'q-05': 1, 'q-06': 1, 'q-07': 1, 'q-08': 0,
      'q-09': 1, 'q-10': 1, 'q-11': 0, 'q-12': 1
    },
    desgloseEjes: {
      identidad: 100,
      derechos: 100,
      deberes: 100,
      tramites: 100
    }
  },
  {
    id: 'att-005',
    aprendizId: 'apr-005',
    nombreAprendiz: 'Mateo Rodríguez Salamanca',
    ficha: '2824901',
    programa: 'Análisis y Desarrollo de Software',
    fecha: '2026-10-26 16:45',
    puntaje: 75,
    aprobado: false,
    respuestas: {
      'q-01': 1, 'q-02': 0, 'q-03': 0, 'q-04': 1,
      'q-05': 0, 'q-06': 1, 'q-07': 1, 'q-08': 0,
      'q-09': 0, 'q-10': 1, 'q-11': 0, 'q-12': 1
    },
    desgloseEjes: {
      identidad: 67,
      derechos: 50,
      deberes: 100,
      tramites: 67
    }
  }
];

export const FICHAS_SAMPLE: FichaSummary[] = [
  {
    codigoFicha: '2824901',
    programa: 'Análisis y Desarrollo de Software (ADSO)',
    regional: 'Regional Antioquia',
    centro: 'Centro de Formación en Diseño, Confección y Moda / IT',
    instructorLider: 'Ing. Rodrigo Mercado',
    totalAprendices: 32,
    aprobados: 26,
    enProceso: 6,
    promedioGeneral: 84.5
  },
  {
    codigoFicha: '2718490',
    programa: 'Gestión Empresarial y Finanzas',
    regional: 'Regional Distrito Capital',
    centro: 'Centro de Gestión de Mercados y Logística',
    instructorLider: 'Dra. Claudia Patricia Silva',
    totalAprendices: 28,
    aprobados: 24,
    enProceso: 4,
    promedioGeneral: 87.2
  },
  {
    codigoFicha: '2901234',
    programa: 'Mantenimiento Mecatrónico y Automatización',
    regional: 'Regional Valle',
    centro: 'Centro de Electricidad y Automatización Industrial (CEAI)',
    instructorLider: 'Ing. Hernán Darío Gómez',
    totalAprendices: 25,
    aprobados: 19,
    enProceso: 6,
    promedioGeneral: 79.8
  }
];
