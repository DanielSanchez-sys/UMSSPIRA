export type RecordSection = 'education' | 'experience' | 'certification';

type OwnedRecord = {
  id: string;
  // Egresado dueño del registro
  ownerId: string;
};

export type EducationRecord = OwnedRecord & {
  institution: string;
  title: string;
  graduationYear: string;
  degree: string;
};

export type ExperienceRecord = OwnedRecord & {
  company: string;
  position: string;
  // Formato AAAA-MM-DD
  startDate: string;
  // Vacío = trabajo actual
  endDate: string;
};

export type CertificationRecord = OwnedRecord & {
  name: string;
  issuer: string;
  degree: string;
  issueYear: string;
};

export type ProfileRecord = EducationRecord | ExperienceRecord | CertificationRecord;

export type ProfileRecords = Record<RecordSection, ProfileRecord[]>;

export type DeleteRecordErrorCode = 'network' | 'forbidden';
