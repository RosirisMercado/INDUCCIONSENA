export type SectionId = 
  | 'introduccion'
  | 'identidad'
  | 'derechos-deberes'
  | 'tramites-bienestar'
  | 'simulador'
  | 'evaluacion'
  | 'certificado'
  | 'gestion-instructor';

export interface ApprenticeProfile {
  id: string;
  nombreCompleto: string;
  tipoDocumento: 'CC' | 'TI' | 'PPT' | 'CE';
  numeroDocumento: string;
  correo: string;
  ficha: string;
  programa: string;
  regional: string;
  centroFormacion: string;
  jornada: 'Diurna' | 'Nocturna' | 'Mixta' | 'Virtual';
}

export interface ValueItem {
  nombre: string;
  definicion: string;
  ejemploCotidiando: string;
}

export interface SymbolItem {
  id: 'escudo' | 'bandera' | 'logosimbolo' | 'himno';
  nombre: string;
  descripcion: string;
  significadoDetallado: string[];
  detallesExtra?: string;
}

export interface RightOrDuty {
  id: string;
  tipo: 'derecho' | 'deber' | 'prohibicion';
  articulo: string;
  categoria: 'Académico' | 'Convivencia y Ética' | 'Bienestar y Salud' | 'Institucional';
  titulo: string;
  descripcion: string;
  implicacionPractica: string;
  icono?: string;
}

export interface ProcedureItem {
  id: string;
  nombre: string;
  concepto: string;
  plazo: string;
  requisitos: string[];
  consecuencia: string;
}

export interface CaseStudy {
  id: string;
  titulo: string;
  situacion: string;
  contexto: string;
  opciones: {
    id: string;
    texto: string;
    esCorrecta: boolean;
    retroalimentacion: string;
    fundamentoReglamento: string;
  }[];
}

export type QuestionAxis = 
  | 'identidad'
  | 'derechos'
  | 'deberes'
  | 'tramites';

export interface QuizQuestion {
  id: string;
  eje: QuestionAxis;
  enunciado: string;
  contextoOpcional?: string;
  opciones: string[];
  indiceCorrecto: number;
  explicacion: string;
  articuloReglamento?: string;
}

export interface QuizAttempt {
  id: string;
  aprendizId: string;
  nombreAprendiz: string;
  ficha: string;
  programa: string;
  fecha: string;
  puntaje: number; // 0-100
  aprobado: boolean;
  respuestas: Record<string, number>; // questionId -> selectedIndex
  desgloseEjes: {
    identidad: number;
    derechos: number;
    deberes: number;
    tramites: number;
  };
}

export interface FichaSummary {
  codigoFicha: string;
  programa: string;
  regional: string;
  centro: string;
  instructorLider: string;
  totalAprendices: number;
  aprobados: number;
  enProceso: number;
  promedioGeneral: number;
}
