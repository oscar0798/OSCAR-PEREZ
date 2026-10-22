import { LearningModule, Badge, CommitteeCase, GlossaryTerm, QuizQuestion } from '../types/sena';

export const SENA_REGIONAL_OPTIONS = [
  'Regional Distrito Capital',
  'Regional Antioquia',
  'Regional Valle del Cauca',
  'Regional Santander',
  'Regional Atlántico',
  'Regional Cundinamarca',
  'Regional Bolívar',
  'Regional Boyacá',
  'Regional Caldas',
  'Regional Risaralda',
  'Regional Tolima',
  'Regional Huila',
  'Regional Meta',
  'Regional Nariño',
  'Regional Cauca',
  'Regional Norte de Santander',
  'Regional Cesar',
  'Regional Magdalena',
  'Regional Córdoba',
  'Regional Sucre',
  'Regional Quindío',
  'Regional Casanare',
  'Regional Arauca',
  'Regional Chocó',
  'Regional La Guajira'
];

export const SENA_PROGRAMS_SAMPLE = [
  'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
  'Tecnólogo en Gestión Administrativa',
  'Tecnólogo en Gestión Contable y de Información Financiera',
  'Tecnólogo en Gestión Integrada de la Calidad, Medio Ambiente, Seguridad y Salud Ocupacional',
  'Tecnólogo en Animación 3D y Contenidos Digitales',
  'Tecnólogo en Mantenimiento Electromecánico Industrial',
  'Técnico en Programación de Software',
  'Técnico en Asistencia Administrativa',
  'Técnico en Sistemas Telemáticos e Internet de las Cosas',
  'Técnico en Cocina y Servicios Gastronómicos',
  'Técnico en Enfermería y Apoyo Terapéutico',
  'Tecnólogo en Negocios Internacionales'
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-cap1',
    name: 'Identidad y Principios',
    description: 'Comprendiste el Capítulo I del Acuerdo 009 de 2024: Definiciones, principios de dignidad, igualdad y la Formación Profesional Integral (FPI).',
    icon: 'Flag',
    earned: false
  },
  {
    id: 'badge-cap2',
    name: 'Defensor de Derechos',
    description: 'Dominas el Capítulo II (Art. 5, 6 y 7): Los 24 derechos del aprendiz, calificación oportuna en 8 días, EPP, ajustes razonables y vocerías.',
    icon: 'Scale',
    earned: false
  },
  {
    id: 'badge-cap3',
    name: 'Guardián del Deber',
    description: 'Apropiaste el Capítulo III (Art. 8 y 9): Deberes del aprendiz, carné visible, justificación en 3 días hábiles y prohibiciones expresas.',
    icon: 'ShieldCheck',
    earned: false
  },
  {
    id: 'badge-cap4',
    name: 'Gestor de Novedades',
    description: 'Conoces el Capítulo IV (Art. 10 al 35): Trámites oportunos, traslados, aplazamientos, reingresos y las 5 modalidades de etapa productiva.',
    icon: 'Briefcase',
    earned: false
  },
  {
    id: 'badge-cap5',
    name: 'Garante del Debido Proceso',
    description: 'Comprendiste el Capítulo V y el Acuerdo 002 de 2026 (Art. 48): Equipo Ejecutor del Programa, Comité de Centro, 5 días de descargos y medidas formativas.',
    icon: 'Gavel',
    earned: false
  },
  {
    id: 'badge-comite',
    name: 'Magistrado del Comité',
    description: 'Superaste el simulador interactivo de deliberación de casos reales aplicando el Acuerdo 009 de 2024 y la reforma del Acuerdo 002 de 2026.',
    icon: 'Award',
    earned: false
  },
  {
    id: 'badge-certificacion',
    name: 'Aprendiz Certificado',
    description: 'Aprobaste la evaluación final integral y obtuviste tu Certificado Oficial de Inducción SENA con validez institucional.',
    icon: 'Award',
    earned: false
  }
];

export const SENA_MODULES: LearningModule[] = [
  {
    id: 'capitulo-1',
    number: 1,
    title: 'Capítulo I: Principios, Definiciones y la Formación Profesional Integral',
    tagline: 'Marco conceptual y principios orientadores del aprendiz (Artículos 1 al 4)',
    shortDescription: 'Definición de Formación Profesional Integral (FPI), gratuidad absoluta de la formación, centralidad del aprendiz y principios de dignidad humana, no discriminación e inclusión.',
    iconName: 'Building2',
    color: '#39A900',
    accentBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    estimatedMinutes: 8,
    sections: [
      {
        id: 'sec-1-1',
        title: 'Ámbito de Aplicación y Concepto de FPI',
        subtitle: 'Artículos 1, 2 y 3 del Acuerdo 009 de 2024',
        badge: 'Acuerdo 009 de 2024',
        content: [
          'El Acuerdo 009 del 5 de noviembre de 2024, expedido por el Consejo Directivo Nacional del SENA y publicado en el Diario Oficial, adopta el nuevo Reglamento del Aprendiz SENA aplicable a todos los aprendices matriculados en programas laborales y tecnológicos presenciales, virtuales o a distancia.',
          'Define la Formación Profesional Integral (FPI) como un proceso educativo teórico-práctico de carácter gratuito, integral y permanente, orientado al desarrollo de conocimientos técnicos, tecnológicos, humanistas y habilidades socioemocionales para el desarrollo social y productivo del país.'
        ],
        keyPoints: [
          {
            title: 'Sujeto Protagónico de la Formación (Art. 3)',
            description: 'El aprendiz es el centro y protagonista de su proceso de formación; sus derechos y deberes son correlativos e inseparables durante toda su permanencia.',
            icon: 'Users',
            type: 'positive'
          },
          {
            title: 'Principio de Gratuidad Total (Art. 2)',
            description: 'Ningún trámite, prueba de selección, matrícula, material de estudio o proceso de certificación en el SENA genera costo económico para el aprendiz.',
            icon: 'Sparkles',
            type: 'positive'
          },
          {
            title: 'Desarrollo Integral Humanista (Art. 2)',
            description: 'Se potencia el desarrollo de habilidades técnicas combinadas con pensamiento crítico, liderazgo, ética ciudadana y habilidades socioemocionales.',
            icon: 'Compass',
            type: 'positive'
          }
        ]
      },
      {
        id: 'sec-1-2',
        title: 'Principios Orientadores de la Comunidad SENA',
        subtitle: 'Artículo 4 del Acuerdo 009 de 2024',
        badge: 'Principios Éticos',
        content: [
          'El reglamento consagra principios orientadores universales que guían la convivencia, la permanencia y el proceso formativo en todos los Centros de Formación del país.',
          'La dignidad humana, la igualdad, la inclusión social, la buena fe y la corresponsabilidad rigen toda la vida institucional del aprendiz.'
        ],
        keyPoints: [
          {
            title: 'Igualdad, Inclusión y Enfoque Diferencial (Art. 4)',
            description: 'Garantía plena de no discriminación por motivos de género, etnia, credo, orientación sexual o discapacidad, garantizando adaptaciones curriculares y accesibilidad.',
            icon: 'HeartHandshake',
            type: 'positive'
          },
          {
            title: 'Corresponsabilidad Formativa (Art. 4)',
            description: 'Compromiso mancomunado entre la institución, el aprendiz, su familia y el sector productivo para alcanzar los resultados de aprendizaje.',
            icon: 'ShieldCheck',
            type: 'neutral'
          },
          {
            title: 'Debido Proceso Constitucional (Art. 4 y 48)',
            description: 'Presunción de inocencia, derecho a la defensa y legalidad en todas las actuaciones académicas y disciplinarias.',
            icon: 'Scale',
            type: 'positive'
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q1-1',
        question: 'Según el Artículo 2 del Acuerdo 009 de 2024, ¿cómo define el SENA la Formación Profesional Integral (FPI)?',
        options: [
          'Un curso virtual memorístico enfocado exclusivamente en teoría de oficina',
          'Un proceso educativo teórico-práctico gratuito orientado al desarrollo de conocimientos técnicos, tecnológicos y humanistas con habilidades socioemocionales',
          'Una pasantía laboral obligatoria sin componente pedagógico',
          'Un entrenamiento disciplinario sin enfoque en derechos humanos'
        ],
        correctAnswer: 1,
        explanation: 'El Artículo 2 del Acuerdo 009 de 2024 define la FPI integrando conocimientos técnicos, tecnológicos y humanistas con actitudes, valores y habilidades socioemocionales para el desarrollo productivo y social.',
        articleReference: 'Acuerdo 009 de 2024 - Artículo 2 (Concepto de FPI)',
        points: 20
      },
      {
        id: 'q1-2',
        question: '¿Qué normas anteriores derogó expresamente el Acuerdo 009 de 2024?',
        options: [
          'Únicamente el Código Sustantivo del Trabajo',
          'Derogó el Acuerdo 07 de 2012, el Acuerdo 02 de 2014, el Acuerdo 06 de 2023 y el Acuerdo 02 de 2024',
          'La Ley 119 de 1994 del Congreso de la República',
          'No derogó ninguna norma previa'
        ],
        correctAnswer: 1,
        explanation: 'El Acuerdo 009 de 2024 unificó y actualizó el Reglamento del Aprendiz SENA, derogando formalmente el Acuerdo 07 de 2012 y sus reformas posteriores.',
        articleReference: 'Acuerdo 009 de 2024 - Artículo 53 (Derogatorias y Vigencia)',
        points: 20
      }
    ],
    badgeId: 'badge-cap1'
  },
  {
    id: 'capitulo-2',
    number: 2,
    title: 'Capítulo II: Derechos del Aprendiz SENA, Reconocimientos y Representatividad',
    tagline: 'Los 24 derechos formativos, bienestar y representatividad (Artículos 5, 6 y 7)',
    shortDescription: 'Catálogo de 24 derechos fundamentales del aprendiz (Art. 5): retroalimentación y evaluación en máximo 8 días hábiles, dotación de EPP, ajustes razonables por discapacidad, bienestar al aprendiz y vocerías.',
    iconName: 'Scale',
    color: '#0284C7',
    accentBg: 'bg-sky-50 text-sky-800 border-sky-200',
    estimatedMinutes: 9,
    sections: [
      {
        id: 'sec-2-1',
        title: 'Los 24 Derechos del Aprendiz SENA',
        subtitle: 'Artículo 5 del Acuerdo 009 de 2024',
        badge: '24 Derechos Garantizados',
        content: [
          'El Artículo 5 del Acuerdo 009 de 2024 establece un catálogo de 24 derechos fundamentales para los aprendices, adecuados según las modalidades presencial, virtual y a distancia y bajo condiciones diferenciales.',
          'Garantizan una formación integral, respetuosa de la dignidad, con acceso efectivo a los recursos institucionales y con procesos de evaluación oportunos y transparentes.'
        ],
        keyPoints: [
          {
            title: 'Evaluación y Retroalimentación en 8 Días Hábiles (Art. 5, Num. 4)',
            description: 'Derecho a conocer las valoraciones y recibir retroalimentación pedagógica en un término máximo de ocho (8) días hábiles siguientes a la entrega de la evidencia de aprendizaje.',
            icon: 'CheckCircle2',
            type: 'positive'
          },
          {
            title: 'Acceso a Ambientes y Recursos Tecnológicos (Art. 5, Num. 2)',
            description: 'Uso formativo de talleres, laboratorios, bibliotecas físicas y digitales, plataformas virtuales (Zajuna) y conectividad institucional.',
            icon: 'Cpu',
            type: 'positive'
          },
          {
            title: 'Elementos de Protección Personal - EPP (Art. 5, Num. 6)',
            description: 'Derecho a recibir dotación de elementos de protección personal y entrenamiento en seguridad y salud en el trabajo para ambientes técnicos de riesgo.',
            icon: 'HardHat',
            type: 'warning'
          },
          {
            title: 'Ajustes Razonables e Inclusión (Art. 5, Num. 8)',
            description: 'Derecho de aprendices con discapacidad a concertar ajustes razonables en materiales, metodologías y accesibilidad física o digital.',
            icon: 'Smile',
            type: 'positive'
          }
        ]
      },
      {
        id: 'sec-2-2',
        title: 'Reconocimientos Formativos y Representatividad Democrática',
        subtitle: 'Artículos 6 y 7 del Acuerdo 009 de 2024',
        badge: 'Reconocimientos y Vocerías',
        content: [
          'El Artículo 6 consagra los Reconocimientos Formativos y Estímulos: incentivos honoríficos y formativos que premian el desempeño académico sobresaliente, el liderazgo y la investigación SENNOVA.',
          'El Artículo 7 reglamenta la Representatividad de los Aprendices, consagrando el derecho a elegir y ser elegidos como Voceros de Ficha y Representantes de Centro ante el Comité Directivo.'
        ],
        keyPoints: [
          {
            title: 'Reconocimientos y Estímulos Formativos (Art. 6)',
            description: 'Menciones de honor, postulación a monitorías remuneradas, participación en semilleros SENNOVA y representaciones institucionales a nivel nacional e internacional.',
            icon: 'Award',
            type: 'positive'
          },
          {
            title: 'Elección Democrática de Voceros y Representantes (Art. 7)',
            description: 'Derecho a postularse y participar en votaciones democráticas para elegir al Vocero de la Ficha y al Representante General de los Aprendices del Centro.',
            icon: 'Users',
            type: 'positive'
          },
          {
            title: 'Bienestar al Aprendiz y Rutas de Protección (Art. 5 y 7)',
            description: 'Acceso a salud preventiva, deporte, arte, apoyos de sostenimiento (FIC) y rutas de atención confidencial ante conductas de acoso o violencia de género.',
            icon: 'ShieldAlert',
            type: 'positive'
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q2-1',
        question: '¿Cuál es el plazo perentorio fijado en el Artículo 5 del Acuerdo 009 de 2024 para que el instructor publique la calificación y retroalimentación de una evidencia entregada a tiempo?',
        scenario: 'Un instructor manifiesta que acumulará las evidencias de todo el trimestre para calificarlas juntas en la última semana.',
        options: [
          '24 horas calendario',
          'Máximo ocho (8) días hábiles siguientes a la entrega oportuna de la evidencia',
          'Un mes después de culminar la competencia técnica',
          'No existe ningún término límite en el nuevo reglamento'
        ],
        correctAnswer: 1,
        explanation: 'El Artículo 5 numeral 4 consagra el derecho fundamental del aprendiz a conocer sus calificaciones y recibir retroalimentación pedagógica en un plazo máximo de 8 días hábiles.',
        articleReference: 'Acuerdo 009 de 2024 - Artículo 5 (Catálogo de 24 Derechos del Aprendiz)',
        points: 25
      },
      {
        id: 'q2-2',
        question: 'Según el Artículo 5 y 7 del Acuerdo 009 de 2024, ¿cuál de los siguientes es un derecho de participación democrática del aprendiz?',
        options: [
          'Modificar el contenido del reglamento sin consultar a las autoridades del SENA',
          'Elegir y ser elegido democráticamente como Vocero de su Ficha de caracterización y Representante de los Aprendices de su Centro de Formación',
          'Faltar a las clases cuando haya asamblea sin justificarlo',
          'Nombrar instructores por votación de los estudiantes'
        ],
        correctAnswer: 1,
        explanation: 'El Artículo 7 garantiza la representatividad democrática a través de la elección de voceros de ficha y representantes de aprendices ante los comités de Centro.',
        articleReference: 'Acuerdo 009 de 2024 - Artículo 7 (Representatividad de los Aprendices)',
        points: 25
      }
    ],
    badgeId: 'badge-cap2'
  },
  {
    id: 'capitulo-3',
    number: 3,
    title: 'Capítulo III: Deberes del Aprendiz SENA y Prohibiciones',
    tagline: 'Obligaciones éticas, formativas y prohibiciones expresas (Artículos 8 y 9)',
    shortDescription: 'Suscripción del acta de compromiso, porte visible y obligatorio del carné, justificación médica en 3 días hábiles, cuidado patrimonial y prohibiciones taxativas (cero armas, drogas, alcohol, fraude o proselitismo).',
    iconName: 'ShieldCheck',
    color: '#059669',
    accentBg: 'bg-green-50 text-green-800 border-green-200',
    estimatedMinutes: 9,
    sections: [
      {
        id: 'sec-3-1',
        title: 'Deberes Esenciales del Aprendiz SENA',
        subtitle: 'Artículo 8 del Acuerdo 009 de 2024',
        badge: 'Deberes Institucionales',
        content: [
          'El Artículo 8 establece los deberes del aprendiz para preservar la excelencia formativa y la convivencia armónica.',
          'Al legalizar su matrícula, el aprendiz firma el Acta de Compromiso, aceptando cumplir cabalmente el reglamento y el cronograma del programa.'
        ],
        keyPoints: [
          {
            title: 'Suscripción del Acta de Compromiso (Art. 8, Num. 1)',
            description: 'Compromiso formal y vinculante suscrito al matricularse para acatar normas institucionales y metas formativas.',
            icon: 'FileCheck2',
            type: 'positive'
          },
          {
            title: 'Porte Visible y Permanente del Carné (Art. 8, Num. 4)',
            description: 'Portar el carné institucional en lugar visible sobre la prenda superior en todas las sedes y actividades del SENA. Prohibido prestarlo o alterarlo.',
            icon: 'CreditCard',
            type: 'warning'
          },
          {
            title: 'Justificación de Inasistencias en 3 Días Hábiles (Art. 8, Num. 7)',
            description: 'Radicar formalmente ante los instructores o coordinación los soportes médicos de la EPS o constancias de fuerza mayor dentro de los 3 días hábiles siguientes al hecho.',
            icon: 'CalendarClock',
            type: 'warning'
          },
          {
            title: 'Honestidad Intelectual y Autoría (Art. 8, Num. 9)',
            description: 'Entregar evidencias de aprendizaje de autoría propia, citar fuentes bibliográficas y rechazar el fraude, plagio o compraventa de trabajos.',
            icon: 'BookOpen',
            type: 'positive'
          }
        ]
      },
      {
        id: 'sec-3-2',
        title: 'Prohibiciones Expresas del Aprendiz',
        subtitle: 'Artículo 9 del Acuerdo 009 de 2024',
        badge: 'Conductas Prohibidas',
        content: [
          'El Artículo 9 enumera las prohibiciones taxativas aplicables en ambientes físicos y virtuales del SENA.',
          'La transgresión de estas prohibiciones compromete la seguridad y los valores del SENA, activando el régimen disciplinario y el debido proceso.'
        ],
        keyPoints: [
          {
            title: 'Cero Armas y Elementos Peligrosos (Art. 9, Num. 1)',
            description: 'Terminantemente prohibido ingresar o portar cualquier clase de arma de fuego, cortopunzante o artefacto explosivo.',
            icon: 'ShieldAlert',
            type: 'danger'
          },
          {
            title: 'Cero Alcohol y Sustancias Psicoactivas (Art. 9, Num. 2)',
            description: 'Prohibido ingresar, expender o consumir bebidas embriagantes o sustancias psicoactivas dentro de las sedes o en actividades formativas.',
            icon: 'AlertTriangle',
            type: 'danger'
          },
          {
            title: 'Prohibido Proselitismo Político o Religioso (Art. 9, Num. 7)',
            description: 'Prohibido utilizar los ambientes, uniformes o recursos del SENA para realizar actividades de proselitismo político-electoral o religioso.',
            icon: 'AlertOctagon',
            type: 'danger'
          },
          {
            title: 'Prohibida la Suplantación y el Fraude (Art. 9, Num. 10)',
            description: 'Prohibido suplantar a compañeros en evaluaciones, falsificar firmas o comercializar evidencias de formación.',
            icon: 'FileWarning',
            type: 'danger'
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q3-1',
        question: 'Según el Artículo 8 del Acuerdo 009 de 2024, ¿cuál es el plazo que tiene un aprendiz para radicar la justificación médica o de fuerza mayor por inasistencia?',
        options: [
          'Puede entregarla al finalizar el año lectivo',
          'Máximo tres (3) días hábiles siguientes a la ocurrencia del hecho con los soportes respectivos',
          '30 días calendario con permiso verbal',
          'No es necesario justificar inasistencias en el SENA'
        ],
        correctAnswer: 1,
        explanation: 'El Artículo 8 numeral 7 estipula que las inasistencias justificadas por salud o fuerza mayor deben radicarse debidamente dentro de los 3 días hábiles posteriores al hecho.',
        articleReference: 'Acuerdo 009 de 2024 - Artículo 8 (Deberes del Aprendiz SENA)',
        points: 25
      },
      {
        id: 'q3-2',
        question: '¿Cuál de las siguientes situaciones constituye una PROHIBICIÓN EXPRESA bajo el Artículo 9 del Acuerdo 009 de 2024?',
        options: [
          'Solicitar préstamo de libros en la biblioteca institucional',
          'Ingresar, consumir o comercializar alcohol o sustancias psicoactivas en el centro, y portar armas',
          'Inscribirse a semilleros de investigación SENNOVA',
          'Postularse como Vocero de la Ficha en elecciones democráticas'
        ],
        correctAnswer: 1,
        explanation: 'El Artículo 9 prohíbe de forma taxativa el ingreso de armas, sustancias psicoactivas o alcohol a las instalaciones o actividades de la institución.',
        articleReference: 'Acuerdo 009 de 2024 - Artículo 9 (Prohibiciones Expresas)',
        points: 25
      }
    ],
    badgeId: 'badge-cap3'
  },
  {
    id: 'capitulo-4',
    number: 4,
    title: 'Capítulo IV: Proceso de Ingreso, Permanencia, Novedades y Certificación',
    tagline: 'Ruta de novedades y las 5 modalidades de etapa productiva (Artículos 10 al 35)',
    shortDescription: 'Trámites de formación, traslados, aplazamientos de hasta 6 meses prorrogables, retiro voluntario sin sanción vs causal de deserción (3 días seguidos con inhabilidad) y las 5 alternativas oficiales de etapa productiva.',
    iconName: 'Briefcase',
    color: '#7C3AED',
    accentBg: 'bg-purple-50 text-purple-800 border-purple-200',
    estimatedMinutes: 10,
    sections: [
      {
        id: 'sec-4-1',
        title: 'Novedades del Aprendiz y Prevención de Deserción',
        subtitle: 'Artículos 10 al 27 del Acuerdo 009 de 2024',
        badge: 'Trámites Académicos',
        content: [
          'Durante el proceso formativo, el aprendiz puede gestionar novedades académicas formalmente a través de la plataforma institucional (SOFIA Plus / Zajuna).',
          'El reglamento distingue claramente entre el Retiro Voluntario formal y la declaratoria de Deserción.'
        ],
        keyPoints: [
          {
            title: 'Aplazamiento de la Formación (Art. 22)',
            description: 'Suspensión temporal solicitada por escrito por motivos de fuerza mayor. Se concede hasta por 6 meses, prorrogable por otros 6 meses.',
            icon: 'PauseCircle',
            type: 'warning'
          },
          {
            title: 'Reingreso Oportuno (Art. 23)',
            description: 'El aprendiz debe radicar su solicitud formal de reingreso antes del vencimiento del periodo de aplazamiento otorgado.',
            icon: 'PlayCircle',
            type: 'positive'
          },
          {
            title: 'Retiro Voluntario (Art. 24)',
            description: 'El retiro voluntario solicitado expresamente por escrito no genera sanción de inhabilidad para inscribirse a futuros programas.',
            icon: 'DoorOpen',
            type: 'positive'
          },
          {
            title: 'Causal de Deserción: 3 Días Hábiles (Art. 25)',
            description: 'Inasistencia injustificada durante tres (3) días hábiles continuos activa el proceso de deserción con cancelación de matrícula e inhabilidad de 6 meses a 1 año.',
            icon: 'AlertCircle',
            type: 'danger'
          }
        ]
      },
      {
        id: 'sec-4-2',
        title: 'Las 5 Modalidades Oficiales de Etapa Productiva',
        subtitle: 'Artículos 28 al 35 del Acuerdo 009 de 2024',
        badge: 'Etapa Productiva',
        content: [
          'La formación en el SENA comprende dos etapas inseparables: la Etapa Lectiva y la Etapa Productiva. Ambas deben ser aprobadas para obtener la certificación.',
          'El Artículo 28 reconoce formalmente cinco alternativas para el desarrollo y seguimiento de la etapa productiva:'
        ],
        keyPoints: [
          {
            title: '1. Contrato de Aprendizaje (Art. 28, Num. 1)',
            description: 'Vinculación formativa empresarial patrocinada con apoyo de sostenimiento mensual y afiliación a EPS y ARL.',
            icon: 'FileCheck2',
            type: 'positive'
          },
          {
            title: '2. Vínculo Laboral o Contractual (Art. 28, Num. 2)',
            description: 'Desempeño de funciones laborales directamente afines a las competencias del programa de formación matriculado.',
            icon: 'Briefcase',
            type: 'positive'
          },
          {
            title: '3. Proyecto Productivo (Art. 28, Num. 3)',
            description: 'Desarrollo de un emprendimiento innovador avalado por el Fondo Emprender o semilleros de investigación aplicada SENNOVA.',
            icon: 'Lightbulb',
            type: 'positive'
          },
          {
            title: '4. Pasantía en Entidad Pública u ONG (Art. 28, Num. 4)',
            description: 'Práctica concertada con instituciones del Estado, fundaciones u organizaciones no gubernamentales.',
            icon: 'Building',
            type: 'neutral'
          },
          {
            title: '5. Monitoría SENA (Art. 28, Num. 5)',
            description: 'Apoyo destacado a procesos formativos o tecnológicos dentro de los ambientes de aprendizaje del centro de formación.',
            icon: 'GraduationCap',
            type: 'positive'
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q4-1',
        question: '¿Cuántos días hábiles consecutivos de inasistencia no justificada dan inicio a la causal de Deserción según el Artículo 25 del Acuerdo 009 de 2024?',
        options: [
          '1 solo día de formación',
          'Tres (3) días hábiles consecutivos sin soporte justificatorio radicado',
          '30 días calendario acumulados con aviso a los compañeros',
          'Únicamente si la empresa patrocinadora lo solicita'
        ],
        correctAnswer: 1,
        explanation: 'El Artículo 25 establece que la inasistencia injustificada durante 3 días hábiles consecutivos activa el procedimiento de deserción que conlleva cancelación de matrícula e inhabilidad de 6 meses a 1 año.',
        articleReference: 'Acuerdo 009 de 2024 - Artículo 25 (Deserción de la Formación)',
        points: 25
      },
      {
        id: 'q4-2',
        question: '¿Cuál es una diferencia sustancial entre el Retiro Voluntario y la Deserción?',
        options: [
          'El retiro voluntario cuesta dinero y la deserción es gratuita',
          'El retiro voluntario formal no genera sanción de inhabilidad; la deserción acarrea inhabilidad de 6 meses a 1 año para ingresar de nuevo al SENA',
          'En el retiro voluntario se entrega el certificado de tecnólogo inmediatamente',
          'Ambos conllevan cobro de multas económicas obligatorias'
        ],
        correctAnswer: 1,
        explanation: 'El retiro voluntario radicado antes de incurrir en faltas protege al aprendiz permitiéndole postularse nuevamente en el futuro sin inhabilidad institucional.',
        articleReference: 'Acuerdo 009 de 2024 - Artículos 24 y 25 (Novedades y Permanencia)',
        points: 25
      }
    ],
    badgeId: 'badge-cap4'
  },
  {
    id: 'capitulo-5',
    number: 5,
    title: 'Capítulo V: Faltas, Medidas Formativas, Sancionatorias y Debido Proceso',
    tagline: 'Régimen disciplinario y Artículo 48 modificado por el Acuerdo 002 de 2026',
    shortDescription: 'Clasificación de faltas leves y graves, medidas formativas (llamado verbal y plan de mejoramiento sin registro sancionatorio), los dos equipos del Art. 48 (Equipo Ejecutor del Programa y Comité de Centro) y 5 días de descargos.',
    iconName: 'Gavel',
    color: '#D97706',
    accentBg: 'bg-amber-50 text-amber-800 border-amber-200',
    estimatedMinutes: 10,
    sections: [
      {
        id: 'sec-5-1',
        title: 'Clasificación de Faltas y Criterios de Gravedad',
        subtitle: 'Artículos 36 al 41 del Acuerdo 009 de 2024',
        badge: 'Faltas y Calificación',
        content: [
          'Las faltas son acciones u omisiones que alteran el normal desarrollo académico o la convivencia pacífica comunitaria.',
          'El reglamento clasifica las faltas en Leves y Graves según criterios objetivos de reiteración, intencionalidad, grado de culpabilidad y perjuicio a personas o instalaciones.'
        ],
        keyPoints: [
          {
            title: 'Faltas Académicas vs Disciplinarias (Art. 36)',
            description: 'Las académicas se relacionan con el incumplimiento reiterado de evidencias de aprendizaje; las disciplinarias con la convivencia, seguridad y bienes.',
            icon: 'BookOpen',
            type: 'neutral'
          },
          {
            title: 'Medida Formativa: Llamado de Atención Verbal (Art. 43)',
            description: 'Acción pedagógica preventiva inmediata ante faltas leves. NO se registra en la hoja de vida institucional del aprendiz.',
            icon: 'MessageCircle',
            type: 'positive'
          },
          {
            title: 'Medida Formativa: Plan de Mejoramiento (Art. 44)',
            description: 'Acuerdo concertado con actividades de superación pedagógica y plazo determinado sin efectos sancionatorios.',
            icon: 'FileCheck',
            type: 'warning'
          }
        ]
      },
      {
        id: 'sec-5-2',
        title: 'Artículo 48 y los Dos Equipos de Garantía del Debido Proceso',
        subtitle: 'Artículo 48 (Modificado por el Acuerdo 002 de 2026 - Diario Oficial 53.490)',
        badge: 'Acuerdo 002 de 2026',
        content: [
          'El Acuerdo 002 de 2026 modificó formalmente el numeral 2 del Artículo 48 del Reglamento del Aprendiz SENA para blindar las garantías constitucionales del debido proceso.',
          'Establece con precisión los dos equipos encargados de revisar, analizar, documentar las faltas y sugerir las medidas y sanciones correspondientes:'
        ],
        keyPoints: [
          {
            title: '1. Equipo Ejecutor del Grupo de Programa de Formación (Art. 48)',
            description: 'Instructores y coordinadores del programa. Realizan el seguimiento directo, revisan y documentan faltas leves y acuerdan las medidas formativas preliminares.',
            icon: 'Users',
            type: 'positive'
          },
          {
            title: '2. Comité de Evaluación y Seguimiento del Centro (Art. 48)',
            description: 'Instancia colegiada asesora del Centro de Formación. Asume los casos de faltas graves o reiteradas que ameriten sanciones formales, garantizando el contradictorio.',
            icon: 'Scale',
            type: 'positive'
          },
          {
            title: 'Término de 5 Días Hábiles para Descargos (Art. 49)',
            description: 'Notificado formalmente el aprendiz, dispone de cinco (5) días hábiles para presentar sus descargos y aportar pruebas ante el Comité.',
            icon: 'Clock',
            type: 'positive'
          },
          {
            title: 'Sanciones Formales Exclusivas del Subdirector (Art. 46)',
            description: 'Llamado de atención escrito, condicionamiento de matrícula y cancelación de matrícula (con inhabilidad de 6 meses a 2 años) impuestas mediante Resolución motivada.',
            icon: 'AlertOctagon',
            type: 'danger'
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q5-1',
        question: '¿Cuáles son los dos equipos encargados de salvaguardar el debido proceso según el Artículo 48 del Reglamento del Aprendiz (modificado por el Acuerdo 002 de 2026)?',
        options: [
          'La policía nacional y la fiscalía general',
          'El Equipo Ejecutor del Grupo de Programa de Formación y el Comité de Evaluación y Seguimiento del Centro de Formación',
          'El vigilante de la portería y la cafetería del centro',
          'Una empresa privada contratada por licitación'
        ],
        correctAnswer: 1,
        explanation: 'El Acuerdo 002 de 2026 modificó el Artículo 48 delimitando los dos equipos encargados de analizar y documentar las faltas: el Equipo Ejecutor del Programa para el seguimiento directo y medidas pedagógicas, y el Comité de Evaluación y Seguimiento del Centro para las faltas que ameritan sanciones formales.',
        articleReference: 'Acuerdo 009 de 2024 - Artículo 48 (Modificado por Acuerdo 002 de 2026)',
        points: 25
      },
      {
        id: 'q5-2',
        question: 'Una vez notificado formalmente de la citación a Comité de Evaluación y Seguimiento, ¿de cuántos días hábiles dispone el aprendiz para radicar sus descargos y pruebas según el Artículo 49?',
        options: [
          'Solo 2 horas previas a la reunión',
          'Cinco (5) días hábiles contados a partir de la notificación formal',
          '30 días calendario en cualquier momento',
          'No tiene derecho a presentar descargos'
        ],
        correctAnswer: 1,
        explanation: 'En estricto cumplimiento del principio constitucional del Debido Proceso (Art. 4 y 49), el aprendiz dispone de cinco (5) días hábiles para ejercer su derecho de defensa.',
        articleReference: 'Acuerdo 009 de 2024 - Artículo 49 (Procedimiento del Comité)',
        points: 25
      }
    ],
    badgeId: 'badge-cap5'
  }
];

export const COMMITTEE_SIMULATION_CASES: CommitteeCase[] = [
  {
    id: 'caso-1',
    title: 'Caso 1: Inasistencia por Duelo Familiar (Fuerza Mayor y Equipo Ejecutor)',
    category: 'académica',
    severity: 'leve',
    description: 'El aprendiz Mateo no asistió al Centro durante 4 días seguidos. Su caso fue remitido por el Equipo Ejecutor del Programa al Comité. En sus descargos dentro de los 5 días hábiles, Mateo adjunta el certificado de defunción de su familiar de primer grado en zona rural sin conectividad, demostrando entrega previa de talleres.',
    apprenticeContext: 'El aprendiz mantiene un rendimiento académico destacado y no tiene antecedentes de faltas ni llamados en su expediente formativo.',
    options: [
      {
        label: 'Aprobar cancelación de matrícula por superar 3 días de inasistencia',
        action: 'Sanción desproporcionada que vulnera el debido proceso',
        isCorrect: false,
        feedback: 'Incorrecto. El Artículo 4 y 15 del Acuerdo 009 de 2024 obligan a valorar las circunstancias de fuerza mayor o caso fortuito debidamente soportadas.',
        legalBasis: 'Acuerdo 009 de 2024 - Artículos 4 y 8 (Fuerza Mayor y Principio de Proporcionalidad)'
      },
      {
        label: 'Aceptar la justificación de fuerza mayor y suscribir con el Equipo Ejecutor un Plan de Mejoramiento pedagógico concertado para nivelar las sesiones prácticas',
        action: 'Medida formativa pedagógica conforme al Artículo 44 y 48 (modificado por Ac. 002 de 2026)',
        isCorrect: true,
        feedback: '¡Excelente decisión! Se verifica la justa causa, se exonera de sanción disciplinaria y se aplica el Plan de Mejoramiento pedagógico concertado.',
        legalBasis: 'Acuerdo 009 de 2024 - Artículos 8, 44 y 48 (Mod. Acuerdo 002 de 2026)'
      },
      {
        label: 'Imponerle una multa pecuniaria institucional',
        action: 'Medida ilegal inexistente en el SENA',
        isCorrect: false,
        feedback: 'Incorrecto. La formación en el SENA es 100% gratuita (Art. 2) y el reglamento prohíbe imponer sanciones pecuniarias.',
        legalBasis: 'Acuerdo 009 de 2024 - Artículo 2 (Principio de Gratuidad)'
      }
    ]
  },
  {
    id: 'caso-2',
    title: 'Caso 2: Plagio Reiterado en Evidencias Técnicas',
    category: 'académica',
    severity: 'grave',
    description: 'La aprendiz Diana copió el código fuente completo de un proyecto de software de una ficha anterior, presentándolo como evidencia propia. El Equipo Ejecutor constata que ya se le había suscrito un llamado verbal pedagógico el mes anterior por la misma falta.',
    apprenticeContext: 'La aprendiz reconoce la copia argumentando falta de tiempo para estudiar y no solicitó oportunamente apoyo al bienestar o tutorías.',
    options: [
      {
        label: 'Ignorar la falta para no alterar las estadísticas de aprobación del Centro',
        action: 'Omisión de las responsabilidades del Comité',
        isCorrect: false,
        feedback: 'Incorrecto. La honestidad académica es un deber fundamental según el Artículo 8 y 9. Omitir el fraude compromete la idoneidad profesional del egresado.',
        legalBasis: 'Acuerdo 009 de 2024 - Artículos 8 y 9 (Honestidad Intelectual y Prohibiciones)'
      },
      {
        label: 'Recomendar al Subdirector imponer Sanción de Llamado Escrito con Condicionamiento de Matrícula y Plan de Mejoramiento con tutoría especializada',
        action: 'Sanción formal con debido proceso y oportunidad formativa',
        isCorrect: true,
        feedback: '¡Correcto! Dada la reiteración de la conducta tras una medida formativa previa, procede la sanción formal con condicionamiento de matrícula y plan de mejoramiento riguroso.',
        legalBasis: 'Acuerdo 009 de 2024 - Artículos 44, 46 y 47 (Sanciones y Condicionamiento)'
      },
      {
        label: 'Expulsión vitalicia sin derecho a presentar descargos ni pruebas',
        action: 'Violación flagrante del debido proceso',
        isCorrect: false,
        feedback: 'Incorrecto. El Artículo 49 garantiza siempre 5 días hábiles para descargos y las inhabilidades máximas son temporales (hasta 2 años), nunca vitalicias.',
        legalBasis: 'Acuerdo 009 de 2024 - Artículos 4, 46 y 49 (Debido Proceso)'
      }
    ]
  },
  {
    id: 'caso-3',
    title: 'Caso 3: Consumo de Alcohol y Sustancias en Taller Industrial de Alto Riesgo',
    category: 'disciplinaria',
    severity: 'grave',
    description: 'Dos aprendices ingresaron licor a las instalaciones y fueron sorprendidos ingiriéndolo dentro del taller de soldadura y mecanizado, manipulando maquinaria de alta potencia bajo evidentes efectos de embriaguez.',
    apprenticeContext: 'Pusieron en inminente riesgo de accidente fatal a 25 compañeros de ficha y docentes presentes.',
    options: [
      {
        label: 'Hacerles un llamado verbal informal sin citación al Comité de Centro',
        action: 'Medida manifiestamente desproporcionada e insuficiente',
        isCorrect: false,
        feedback: 'Incorrecto. Introducir y consumir sustancias o alcohol en ambientes de alto riesgo laboral vulnera la seguridad física y la vida colectiva, configurando una falta grave que amerita proceso formal ante el Comité.',
        legalBasis: 'Acuerdo 009 de 2024 - Artículos 9 y 40 (Prohibición Expresa y Calificación de Faltas)'
      },
      {
        label: 'Garantizar el debido proceso (5 días de descargos) y recomendar al Subdirector de Centro la Cancelación de Matrícula con inhabilidad por vulnerar la seguridad colectiva',
        action: 'Aplicación estricta de la normatividad con respeto al debido proceso',
        isCorrect: true,
        feedback: '¡Decisión acertada! El Artículo 9 prohíbe taxativamente ingresar o consumir alcohol o drogas, y la gravedad aumenta al comprometer la vida en un taller industrial. Se respetan los 5 días de descargos y procede la recomendación de cancelación.',
        legalBasis: 'Acuerdo 009 de 2024 - Artículos 9, 46 y 49 (Cancelación de Matrícula y Procedimiento)'
      },
      {
        label: 'Cobrarles el costo de las máquinas como fianza de permanencia',
        action: 'Acto arbitrario fuera del ordenamiento jurídico del SENA',
        isCorrect: false,
        feedback: 'Incorrecto. No existen fianzas ni cobros pecuniarios en el régimen del aprendiz.',
        legalBasis: 'Acuerdo 009 de 2024 - Artículo 2 (Gratuidad y Legalidad)'
      }
    ]
  },
  {
    id: 'caso-4',
    title: 'Caso 4: Rol del Equipo Ejecutor vs Comité de Centro (Acuerdo 002 de 2026)',
    category: 'académica',
    severity: 'leve',
    description: 'Un aprendiz de primer trimestre no presentó las evidencias de una guía de aprendizaje por dificultades de adaptación al entorno virtual. El instructor principal desea enviarlo directamente a cancelación de matrícula sin haber realizado seguimiento pedagógico.',
    apprenticeContext: 'El aprendiz ha asistido a todas las sesiones y solicita orientación para ponerse al día.',
    options: [
      {
        label: 'El Equipo Ejecutor del Programa de Formación debe intervenir primero, documentar la situación y acordar un Plan de Mejoramiento pedagógico (Art. 44 y 48)',
        action: 'Aplicación correcta de la reforma del Artículo 48 (Acuerdo 002 de 2026)',
        isCorrect: true,
        feedback: '¡Excelente! El Artículo 48 (modificado por el Acuerdo 002 de 2026) establece que el Equipo Ejecutor del Programa es el primero en acompañar, revisar y aplicar medidas pedagógicas formativas antes de escalar a instancias sancionatorias.',
        legalBasis: 'Acuerdo 002 de 2026 que modificó el Artículo 48 del Acuerdo 009 de 2024'
      },
      {
        label: 'Cancelar la matrícula de inmediato porque el instructor tiene potestad sancionatoria directa',
        action: 'Acto nulo que viola la competencia exclusiva del Subdirector y el debido proceso',
        isCorrect: false,
        feedback: 'Incorrecto. Los instructores no pueden imponer sanciones como la cancelación de matrícula; esta es potestad exclusiva del Subdirector de Centro previo concepto del Comité.',
        legalBasis: 'Acuerdo 009 de 2024 - Artículo 46 y 48 (Mod. Acuerdo 002 de 2026)'
      },
      {
        label: 'Hacer que el aprendiz pague una penalidad para tener derecho a una nueva guía',
        action: 'Medida ilegal en el SENA',
        isCorrect: false,
        feedback: 'Incorrecto. La formación es absolutamente gratuita (Art. 2) y no admite ningún tipo de cobro.',
        legalBasis: 'Acuerdo 009 de 2024 - Artículo 2'
      }
    ]
  }
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Acuerdo No. 0009 de 2024',
    definition: 'Nuevo Reglamento del Aprendiz SENA expedido por el Consejo Directivo Nacional del SENA y publicado en el Diario Oficial. Consta de 5 Capítulos y deroga expresamente los Acuerdos 007 de 2012, 002 de 2014, 006 de 2023 y 002 de 2024.',
    category: 'Normatividad Vigente'
  },
  {
    term: 'Acuerdo No. 002 de 2026',
    definition: 'Acto administrativo expedido por el Consejo Directivo Nacional del SENA (Diario Oficial No. 53.490 del 14 de mayo de 2026) que modificó el Artículo 48 del Reglamento del Aprendiz, formalizando las competencias del Equipo Ejecutor del Programa y del Comité de Centro.',
    category: 'Normatividad Vigente'
  },
  {
    term: 'Equipo Ejecutor del Programa (Art. 48)',
    definition: 'Equipo de instructores y coordinadores del programa de formación encargado del acompañamiento directo, la revisión y documentación de faltas leves y la concertación de planes de mejoramiento pedagógicos (Modificado por Ac. 002 de 2026).',
    category: 'Debido Proceso'
  },
  {
    term: 'Comité de Evaluación y Seguimiento (Art. 48 y 49)',
    definition: 'Órgano asesor colegiado del Subdirector de Centro de Formación que analiza faltas graves o reiteradas que puedan ameritar sanciones disciplinarias, garantizando 5 días hábiles para descargos del aprendiz.',
    category: 'Debido Proceso'
  },
  {
    term: 'FPI (Formación Profesional Integral)',
    definition: 'Proceso educativo teórico-práctico gratuito del SENA (Art. 2) orientado al desarrollo armónico de competencias técnicas, tecnológicas, humanistas y socioemocionales para el desarrollo social y productivo.',
    category: 'Modelo Pedagógico'
  },
  {
    term: '24 Derechos del Aprendiz (Art. 5)',
    definition: 'Catálogo de derechos fundamentales del aprendiz SENA, que incluye retroalimentación en 8 días hábiles, EPP, ambientes de calidad, ajustes razonables por discapacidad y bienestar integral.',
    category: 'Derechos del Aprendiz'
  },
  {
    term: 'Plan de Mejoramiento (Art. 44)',
    definition: 'Medida formativa concertada pedagógica orientada a superar deficiencias académicas o actitudinales en un plazo definido. No constituye sanción ni genera anotación en la hoja de vida.',
    category: 'Medida Formativa'
  },
  {
    term: 'Deserción de la Formación (Art. 25)',
    definition: 'Causal de cancelación de matrícula motivada por inasistencia injustificada durante 3 días hábiles continuos o no reportarse al vencer un aplazamiento, conllevando inhabilidad institucional de 6 meses a 1 año.',
    category: 'Permanencia'
  },
  {
    term: 'Alternativas de Etapa Productiva (Art. 28)',
    definition: 'Las 5 modalidades reconocidas para realizar la etapa práctica: Contrato de Aprendizaje, Vínculo Laboral afín, Proyecto Productivo/Emprender, Pasantía en ONG o entidad pública, y Monitoría SENA.',
    category: 'Etapa Productiva'
  },
  {
    term: 'Zajuna / SOFIA Plus',
    definition: 'Plataformas tecnológicas oficiales del SENA para la gestión de la formación profesional integral, registro de evidencias, seguimiento curricular y reporte formal de novedades.',
    category: 'Plataformas TIC'
  }
];

export const FINAL_EXAM_QUESTIONS: QuizQuestion[] = [
  {
    id: 'fe-1',
    question: '¿Cuál es la norma oficial que rige actualmente como Reglamento del Aprendiz SENA?',
    options: [
      'El Acuerdo 007 de 2012 sin modificaciones',
      'El Acuerdo 0009 de 2024 expedido por el Consejo Directivo Nacional del SENA (con la modificación del Artículo 48 por el Acuerdo 002 de 2026)',
      'Un memorando interno de cada Centro de Formación',
      'El Código de Comercio colombiano'
    ],
    correctAnswer: 1,
    explanation: 'El Acuerdo 0009 de 2024, con la reforma de su Artículo 48 por el Acuerdo 002 de 2026, constituye el vigente Reglamento del Aprendiz SENA y derogó expresamente el Acuerdo 07 de 2012 y sus reformas previas.',
    articleReference: 'Acuerdo 0009 de 2024 y Acuerdo 002 de 2026 (Diario Oficial 53.490)',
    points: 10
  },
  {
    id: 'fe-2',
    question: 'Según el Artículo 5 del Acuerdo 009 de 2024, ¿cuál es el plazo máximo que tiene un instructor para retroalimentar y calificar una evidencia entregada a tiempo?',
    options: [
      '24 horas calendario',
      'Máximo ocho (8) días hábiles siguientes a la entrega oportuna de la evidencia',
      'Al cierre definitivo del año formativo',
      '30 días calendario según la discreción del docente'
    ],
    correctAnswer: 1,
    explanation: 'El Artículo 5 numeral 4 consagra el derecho fundamental a recibir retroalimentación pedagógica y calificación en un plazo máximo de 8 días hábiles.',
    articleReference: 'Acuerdo 009 de 2024 - Artículo 5 (Derechos del Aprendiz)',
    points: 10
  },
  {
    id: 'fe-3',
    question: '¿Qué deber relacionado con la identidad institucional debe cumplir todo aprendiz al ingresar a sedes del SENA según el Artículo 8?',
    options: [
      'Presentar la libreta militar original',
      'Portar de forma visible el carné institucional del SENA sobre la prenda superior',
      'Mostrar una copia de la factura de matrícula',
      'Llevar un comprobante de votación política'
    ],
    correctAnswer: 1,
    explanation: 'El Artículo 8 establece como deber ineludible portar en lugar visible el carné institucional para la identificación, seguridad y convivencia de la comunidad.',
    articleReference: 'Acuerdo 009 de 2024 - Artículo 8 (Deberes del Aprendiz)',
    points: 10
  },
  {
    id: 'fe-4',
    question: 'Si un aprendiz presenta una incapacidad médica de la EPS o calamidad demostrada, ¿cuál es el plazo fijado en el Artículo 8 para radicar los soportes?',
    options: [
      'Máximo tres (3) días hábiles siguientes a la ocurrencia del hecho ante los instructores o coordinación',
      'Puede entregarla 3 meses después al finalizar el trimestre',
      'No tiene límite de tiempo en el reglamento',
      'Debe enviar un sustituto a estudiar por él'
    ],
    correctAnswer: 0,
    explanation: 'El Artículo 8 numeral 7 estipula que las inasistencias por salud o fuerza mayor deben justificarse debidamente dentro de los 3 días hábiles siguientes a su ocurrencia.',
    articleReference: 'Acuerdo 009 de 2024 - Artículo 8 (Justificación de Inasistencias)',
    points: 10
  },
  {
    id: 'fe-5',
    question: '¿Cuál de las siguientes conductas constituye una PROHIBICIÓN EXPRESA consagrada en el Artículo 9 del Acuerdo 009 de 2024?',
    options: [
      'Participar en los torneos deportivos o culturales de Bienestar al Aprendiz',
      'Portar armas, comercializar o consumir alcohol/sustancias psicoactivas, o realizar proselitismo político dentro de las sedes',
      'Postularse a una monitoría académica en el Centro',
      'Solicitar ajustes razonables de accesibilidad por discapacidad'
    ],
    correctAnswer: 1,
    explanation: 'El Artículo 9 prohíbe taxativamente armas, sustancias psicoactivas, bebidas embriagantes y proselitismo político-electoral o religioso en los ambientes del SENA.',
    articleReference: 'Acuerdo 009 de 2024 - Artículo 9 (Prohibiciones Expresas)',
    points: 10
  },
  {
    id: 'fe-6',
    question: '¿Qué es un Plan de Mejoramiento según el Artículo 44 del Acuerdo 009 de 2024?',
    options: [
      'Una multa económica impuesta por la subdirección',
      'Una medida formativa concertada con actividades pedagógicas y plazo fijo para superar deficiencias académicas o actitudinales sin registro sancionatorio en la hoja de vida',
      'La expulsión automática de la formación con pérdida definitiva de cupo',
      'Una sanción disciplinaria formal que inhabilita por 2 años'
    ],
    correctAnswer: 1,
    explanation: 'El Plan de Mejoramiento es una medida formativa pedagógica concertada para nivelar competencias sin generar antecedentes disciplinarios ni manchar la hoja de vida.',
    articleReference: 'Acuerdo 009 de 2024 - Artículo 44 (Plan de Mejoramiento)',
    points: 10
  },
  {
    id: 'fe-7',
    question: '¿Cuántos días hábiles consecutivos de inasistencia no justificada configuran la causal de Deserción según el Artículo 25?',
    options: [
      '1 solo día de clase',
      'Tres (3) días hábiles consecutivos sin soporte justificatorio radicado',
      '30 días calendario con aviso informal',
      'Solo si la empresa patrocinadora cancela el contrato'
    ],
    correctAnswer: 1,
    explanation: 'El abandono injustificado durante 3 días hábiles continuos activa el procedimiento de deserción que conlleva cancelación de matrícula e inhabilidad.',
    articleReference: 'Acuerdo 009 de 2024 - Artículo 25 (Deserción)',
    points: 10
  },
  {
    id: 'fe-8',
    question: '¿Cuáles son las 5 alternativas oficiales para desarrollar la Etapa Productiva reconocidas en el Artículo 28 del Acuerdo 009 de 2024?',
    options: [
      'Contrato de Aprendizaje, Vínculo Laboral afín, Proyecto Productivo/Emprender, Pasantía en ONG/Estado, y Monitoría SENA',
      'Trabajo informal en cualquier oficio sin afinidad técnica con el programa',
      'Aportar dinero en efectivo a la coordinación del centro',
      'Dictar clases en universidades privadas sin título previo'
    ],
    correctAnswer: 0,
    explanation: 'El Artículo 28 reconoce formalmente las cinco modalidades de etapa productiva orientadas a aplicar las competencias laborales en contextos reales.',
    articleReference: 'Acuerdo 009 de 2024 - Artículo 28 (Alternativas de Etapa Productiva)',
    points: 10
  },
  {
    id: 'fe-9',
    question: '¿Qué modificación fundamental introdujo el Acuerdo 002 de 2026 en el Artículo 48 del Reglamento del Aprendiz SENA?',
    options: [
      'Eliminó el derecho de defensa de los aprendices',
      'Delimitó con precisión los dos equipos de debido proceso: el Equipo Ejecutor del Grupo de Programa de Formación (acompañamiento y medidas formativas) y el Comité de Evaluación y Seguimiento de Centro (faltas que ameritan sanciones formales)',
      'Estableció que la formación en el SENA deja de ser gratuita',
      'Obligó a pagar matrículas trimestrales'
    ],
    correctAnswer: 1,
    explanation: 'El Acuerdo 002 de 2026 reformó el Artículo 48 para garantizar el debido proceso mediante la actuación coordinada del Equipo Ejecutor del Programa y el Comité de Evaluación y Seguimiento del Centro.',
    articleReference: 'Acuerdo 002 de 2026 - Modificación del Artículo 48 del Acuerdo 009 de 2024',
    points: 10
  },
  {
    id: 'fe-10',
    question: 'Una vez notificado formalmente de una citación a Comité de Evaluación y Seguimiento, ¿de cuántos días hábiles dispone el aprendiz para presentar sus descargos y pruebas según el Artículo 49?',
    options: [
      'Solo 2 horas previas a la deliberación',
      'Cinco (5) días hábiles a partir de la notificación formal',
      '30 días hábiles en cualquier momento del año',
      'No tiene derecho a presentar descargos ni pruebas'
    ],
    correctAnswer: 1,
    explanation: 'En estricto cumplimiento del principio constitucional del Debido Proceso (Art. 4 y 49), el aprendiz cuenta con cinco (5) días hábiles para radicar sus descargos y aportar pruebas de descargo.',
    articleReference: 'Acuerdo 009 de 2024 - Artículo 49 (Procedimiento del Comité)',
    points: 10
  }
];
