export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: 'available' | 'coming_soon';
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  careerBenefits: string[];
  relatedCareers: string[];
}

export const courses: Course[] = [
  {
    id: '1',
    title: 'Liderazgo y Gestión de Equipos',
    description: 'Desarrolla habilidades para inspirar y dirigir equipos de alto rendimiento.',
    imageUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    status: 'available',
    difficulty: 'Intermedio',
    careerBenefits: [
      'Mejora la capacidad de dirección en cualquier sector.',
      'Fundamental para roles de gerencia y coordinación.',
      'Aumenta la productividad y cohesión del equipo.'
    ],
    relatedCareers: ['Administración', 'Recursos Humanos', 'Gerencia', 'Coordinación'],
  },
  {
    id: '2',
    title: 'Marketing Digital Avanzado',
    description: 'Domina las estrategias más recientes en SEO, SEM y redes sociales.',
    imageUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    status: 'available',
    difficulty: 'Avanzado',
    careerBenefits: [
      'Esencial para profesionales de marketing y ventas.',
      'Permite crear campañas efectivas y medir resultados.',
      'Abre puertas en el sector digital y e-commerce.'
    ],
    relatedCareers: ['Marketing', 'Ventas', 'Comunicación', 'Publicidad'],
  },
  {
    id: '3',
    title: 'Desarrollo Web Full Stack',
    description: 'Aprende a construir aplicaciones web completas con React y Node.js.',
    imageUrl: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    status: 'available',
    difficulty: 'Avanzado',
    careerBenefits: [
      'Ideal para ingenieros de sistemas y desarrolladores.',
      'Permite crear soluciones tecnológicas desde cero.',
      'Alta demanda laboral en el sector tecnológico.'
    ],
    relatedCareers: ['Ingeniería de Sistemas', 'Desarrollo de Software', 'Computación'],
  },
  {
    id: '4',
    title: 'Gestión de Proyectos con Scrum y Kanban',
    description: 'Aprende metodologías ágiles para liderar proyectos de manera eficiente y adaptable.',
    imageUrl: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    status: 'available',
    difficulty: 'Intermedio',
    careerBenefits: [
      'Mejora la gestión de cualquier tipo de proyecto.',
      'Valioso para administradores, ingenieros y líderes de equipo.',
      'Optimiza la entrega de resultados y la colaboración.'
    ],
    relatedCareers: ['Administración', 'Ingeniería Industrial', 'Desarrollo de Software'],
  },
  {
    id: '5',
    title: 'Habilidades de Comunicación y Negociación',
    description: 'Domina el arte de la comunicación efectiva y la negociación estratégica en cualquier ámbito.',
    imageUrl: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    status: 'available',
    difficulty: 'Básico',
    careerBenefits: [
      'Fundamental para todas las carreras, especialmente ventas, RRHH y liderazgo.',
      'Mejora las relaciones interpersonales y profesionales.',
      'Clave para cerrar acuerdos y resolver conflictos.'
    ],
    relatedCareers: ['Ventas', 'Recursos Humanos', 'Derecho', 'Administración'],
  },
  {
    id: '6',
    title: 'Análisis de Datos para la Toma de Decisiones',
    description: 'Convierte grandes volúmenes de datos en insights accionables para estrategias empresariales.',
    imageUrl: 'https://images.pexels.com/photos/3184390/pexels-photo-3184390.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    status: 'available',
    difficulty: 'Intermedio',
    careerBenefits: [
      'Esencial para economistas, administradores, marketeers y científicos de datos.',
      'Permite fundamentar decisiones estratégicas con evidencia.',
      'Herramienta clave para la optimización de procesos y el crecimiento.'
    ],
    relatedCareers: ['Economía', 'Administración', 'Marketing', 'Ingeniería'],
  },
  {
    id: '7',
    title: 'Introducción a la Inteligencia Artificial',
    description: 'Explora los fundamentos y aplicaciones de la IA moderna.',
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    status: 'coming_soon',
    difficulty: 'Básico',
    careerBenefits: [
      'Prepara para el futuro de la tecnología en cualquier industria.',
      'Permite entender y aplicar conceptos básicos de IA.',
      'Abre nuevas oportunidades en innovación y desarrollo.'
    ],
    relatedCareers: ['Ingeniería de Sistemas', 'Ciencia de Datos', 'Tecnología'],
  },
  {
    id: '8',
    title: 'Diseño UX/UI para Apps Móviles',
    description: 'Crea interfaces de usuario intuitivas y experiencias memorables.',
    imageUrl: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    status: 'coming_soon',
    difficulty: 'Intermedio',
    careerBenefits: [
      'Crucial para diseñadores, desarrolladores y product managers.',
      'Mejora la usabilidad y satisfacción del usuario.',
      'Alta demanda en el desarrollo de aplicaciones y productos digitales.'
    ],
    relatedCareers: ['Diseño Gráfico', 'Desarrollo de Software', 'Marketing'],
  },
  {
    id: '9',
    title: 'Ciberseguridad Esencial',
    description: 'Protege tus sistemas y datos de amenazas digitales.',
    imageUrl: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    status: 'coming_soon',
    difficulty: 'Básico',
    careerBenefits: [
      'Indispensable para profesionales de TI y cualquier usuario de tecnología.',
      'Protege información sensible y previene ataques.',
      'Crea conciencia sobre riesgos digitales y mejores prácticas.'
    ],
    relatedCareers: ['Ingeniería de Sistemas', 'Redes y Telecomunicaciones', 'Tecnología'],
  },
];
