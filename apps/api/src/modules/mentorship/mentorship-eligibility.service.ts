import { Injectable } from '@nestjs/common';
import {
  MentorEligibilityIssue,
  MentorEligibilityProfile,
  MentorEligibilityResult,
} from './mentor-eligibility.types';

@Injectable()
export class MentorshipEligibilityService {
  evaluate(profile: MentorEligibilityProfile): MentorEligibilityResult {
    const issues: MentorEligibilityIssue[] = [];

    if (!profile.isGraduate) {
      issues.push({ code: 'not_graduate', message: 'El usuario debe ser egresado.' });
    }
    if (!profile.isVerified) {
      issues.push({ code: 'not_verified', message: 'El egresado debe estar verificado.' });
    }
    if (!profile.isApproved) {
      issues.push({ code: 'not_approved', message: 'El egresado debe estar aprobado.' });
    }
    if (profile.hasParticipationRestriction) {
      issues.push({
        code: 'participation_restricted',
        message: 'El usuario tiene restricciones para participar como mentor.',
      });
    }

    const missingFields = this.getMissingProfileFields(profile);
    if (missingFields.length > 0) {
      issues.push({
        code: 'profile_incomplete',
        message: 'Completa los datos mínimos del perfil para habilitarte como mentor.',
        missingFields,
      });
    }

    return { eligible: issues.length === 0, issues };
  }

  private getMissingProfileFields(profile: MentorEligibilityProfile): string[] {
    const requiredText: Array<[string, string]> = [
      ['Nombre', profile.personalInfo.firstName],
      ['Apellido', profile.personalInfo.lastName],
      ['Correo electrónico', profile.personalInfo.email],
      ['Teléfono', profile.personalInfo.phone],
      ['Carrera', profile.academicInfo.career],
      ['Grado académico', profile.academicInfo.degree],
      ['Resumen profesional', profile.professionalInfo.summary],
      ['Descripción del perfil', profile.description],
      ['Descripción de experiencia', profile.experienceDescription],
    ];

    const missing = requiredText
      .filter(([, value]) => !value?.trim())
      .map(([label]) => label);

    if (!Number.isInteger(profile.academicInfo.graduationYear)) {
      missing.push('Año de egreso');
    }
    if (!Number.isFinite(profile.professionalInfo.yearsExperience)
      || profile.professionalInfo.yearsExperience < 0) {
      missing.push('Años de experiencia');
    }
    if (profile.personalInfo.email?.trim()
      && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.personalInfo.email.trim())) {
      missing.push('Correo electrónico válido');
    }

    return missing;
  }
}