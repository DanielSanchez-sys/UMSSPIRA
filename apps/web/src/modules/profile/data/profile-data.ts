export type TimelineItem = {
  title: string;
  subtitle: string;
  date: string;
  document?: string;
  verified?: boolean;
  showStatus?: boolean;
};

export type TimelineSection = {
  title: string;
  items: TimelineItem[];
};

export const profileTimeline: TimelineSection[] = [
  {
    title: 'EDUCACIÓN',
    items: [
      {
        title: 'Universidad Mayor de San Simón',
        subtitle: 'Licenciatura en Ingeniería de Sistemas',
        date: '2018',
        document: 'respaldo.pdf',
      },
      {
        title: 'Universidad Católica Boliviana',
        subtitle: 'Maestría en Gestión de TI',
        date: '2021',
        document: 'respaldo.pdf',
      },
    ],
  },

  {
    title: 'EXPERIENCIA LABORAL',
    items: [
      {
        title: 'NTT DATA',
        subtitle: 'Tech Lead',
        date: 'Jul 2023 – Presente',
      },
      {
        title: 'Jalasoft',
        subtitle: 'Desarrollador Senior',
        date: 'Ene 2021 – Jun 2023',
      },
      {
        title: 'Banco Mercantil Santa Cruz',
        subtitle: 'Analista de Sistemas',
        date: 'Ene 2019 – Dic 2020',
      },
    ],
  },

  {
    title: 'CERTIFICACIONES',
    items: [
      {
        title: 'AWS Solutions Architect',
        subtitle: 'Amazon Web Services · 2022',
        date: 'Grado: Profesional',
        document: 'respaldo.pdf',
        verified: true,
        showStatus: true,
      },
      {
        title: 'Scrum Master PSM I',
        subtitle: 'Scrum.org · 2021',
        date: 'Grado: Asociado',
        document: 'respaldo.pdf',
        verified: true,
        showStatus: true,
      },
      {
        title: 'Google Cloud Engineer',
        subtitle: 'Google · 2023',
        date: 'Grado: Profesional',
        showStatus: true,
      },
    ],
  },
];