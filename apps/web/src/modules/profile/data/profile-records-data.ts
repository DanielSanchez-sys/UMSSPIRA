import type { ProfileRecords, RecordSection } from '@/modules/profile/types/profile-record';

// Egresado con sesión iniciada (temporal hasta integrar la autenticación)
export const CURRENT_GRADUATE_ID = 'graduate-000452';

// Datos temporales (mock) mientras el endpoint de perfil no esté disponible
export const PROFILE_RECORDS_MOCK: ProfileRecords = {
  education: [
    {
      id: 'edu-1',
      ownerId: CURRENT_GRADUATE_ID,
      institution: 'Universidad Mayor de San Simón',
      title: 'Ingeniería de Sistemas',
      graduationYear: '2020',
      degree: 'Licenciatura',
    },
    {
      id: 'edu-2',
      ownerId: CURRENT_GRADUATE_ID,
      institution: 'Universidad Católica Boliviana',
      title: 'Diplomado en Gestión de Proyectos TI',
      graduationYear: '2021',
      degree: 'Diplomado',
    },
    {
      id: 'edu-3',
      ownerId: CURRENT_GRADUATE_ID,
      institution: 'Universidad Privada del Valle',
      title: 'Maestría en Ciencia de Datos',
      graduationYear: '2023',
      degree: 'Maestría',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      ownerId: CURRENT_GRADUATE_ID,
      company: 'NTT DATA',
      position: 'Tech Lead',
      startDate: '2023-07-01',
      endDate: '',
    },
    {
      id: 'exp-2',
      ownerId: CURRENT_GRADUATE_ID,
      company: 'Jalasoft',
      position: 'Desarrollador Senior',
      startDate: '2021-01-04',
      endDate: '2023-06-30',
    },
  ],
  certification: [
    {
      id: 'cert-1',
      ownerId: CURRENT_GRADUATE_ID,
      name: 'AWS Solutions Architect',
      issuer: 'Amazon Web Services',
      degree: 'Profesional',
      issueYear: '2022',
    },
    {
      id: 'cert-2',
      ownerId: CURRENT_GRADUATE_ID,
      name: 'Scrum Master PSM I',
      issuer: 'Scrum.org',
      degree: 'Asociado',
      issueYear: '2021',
    },
  ],
};

export const SECTION_LABELS: Record<RecordSection, string> = {
  education: 'Formación académica',
  experience: 'Experiencia laboral',
  certification: 'Certificaciones',
};

