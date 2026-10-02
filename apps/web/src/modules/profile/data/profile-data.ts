export type BackupStatus = 'verified' | 'missing';

export type TimelineItem = {
  title: string;
  subtitle: string;
  date?: string;
  detail?: string;
  document?: string;
  status?: BackupStatus;
  // Solo certificaciones. Se reemplazan por el tipo de lectura de shared-types cuando exista.
  issuer?: string;
  year?: string;
  grade?: string;
};

export type TimelineSection = {
  title: string;
  dateTone?: 'accent' | 'muted';
  items: TimelineItem[];
};

export type ProfileHeader = {
  id: string;
  title: string;
  name: string;
  career: string;
  graduationYear: number;
  verified: boolean;
};

export const profileHeader: ProfileHeader = {
  id: '000452',
  title: 'Ing.',
  name: 'Carlos Mendoza Ríos',
  career: 'Ingeniería de Sistemas',
  graduationYear: 2018,
  verified: true,
};

export const profileTimeline: TimelineSection[] = [
  {
    title: 'EDUCACIÓN',
    dateTone: 'accent',
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
    dateTone: 'muted',
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
        detail: 'Grado: Profesional',
        issuer: 'Amazon Web Services',
        year: '2022',
        grade: 'Profesional',
        document: 'respaldo.pdf',
        status: 'verified',
      },
      {
        title: 'Scrum Master PSM I',
        subtitle: 'Scrum.org · 2021',
        detail: 'Grado: Asociado',
        issuer: 'Scrum.org',
        year: '2021',
        grade: 'Asociado',
        document: 'respaldo.pdf',
        status: 'verified',
      },
      {
        title: 'Google Cloud Engineer',
        subtitle: 'Google · 2023',
        detail: 'Grado: Profesional',
        issuer: 'Google',
        year: '2023',
        grade: 'Profesional',
        status: 'missing',
      },
    ],
  },
];