export interface MentorEligibilityProfile {
  userId: string;
  isGraduate: boolean;
  isVerified: boolean;
  isApproved: boolean;
  hasParticipationRestriction: boolean;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  academicInfo: {
    career: string;
    degree: string;
    graduationYear: number;
  };
  professionalInfo: {
    summary: string;
    yearsExperience: number;
  };
  description: string;
  experienceDescription: string;
}

export type MentorEligibilityIssueCode =
  | 'not_graduate'
  | 'not_verified'
  | 'not_approved'
  | 'participation_restricted'
  | 'profile_incomplete';

export interface MentorEligibilityIssue {
  code: MentorEligibilityIssueCode;
  message: string;
  missingFields?: string[];
}

export interface MentorEligibilityResult {
  eligible: boolean;
  issues: MentorEligibilityIssue[];
}