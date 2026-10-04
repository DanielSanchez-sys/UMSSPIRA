import { ConflictException, Injectable } from '@nestjs/common';
import {
  DeactivateMentorInput,
  DeactivateMentorResult,
  MentorEligibilityIssue,
  MentorEligibilityProfile,
  MentorEligibilityResult,
  MentorSettings,
} from './mentor-eligibility.types';

type DataRecord = Record<string, unknown>;

@Injectable()
export class MentorshipEligibilityService {
  evaluate(input: unknown): MentorEligibilityResult {
    const issues: MentorEligibilityIssue[] = [];
    const profile = this.asRecord(input) ?? {};
    const invalidFlags: string[] = [];

    this.addFlagIssue(profile, 'isGraduate', 'Condición de egresado', invalidFlags);
    this.addFlagIssue(profile, 'isVerified', 'Verificación', invalidFlags);
    this.addFlagIssue(profile, 'isApproved', 'Aprobación', invalidFlags);
    this.addFlagIssue(profile, 'hasParticipationRestriction', 'Restricciones de participación', invalidFlags);
    this.addFlagIssue(profile, 'isMentorActive', 'Estado activo del mentor', invalidFlags);

    if (profile.isGraduate === false) {
      issues.push({ code: 'not_graduate', message: 'El usuario debe ser egresado.' });
    }
    if (profile.isVerified === false) {
      issues.push({ code: 'not_verified', message: 'El egresado debe estar verificado.' });
    }
    if (profile.isApproved === false) {
      issues.push({ code: 'not_approved', message: 'El egresado debe estar aprobado.' });
    }
    if (profile.hasParticipationRestriction === true) {
      issues.push({
        code: 'participation_restricted',
        message: 'El usuario tiene restricciones para participar como mentor.',
      });
    }
    if (profile.isMentorActive === false) {
      issues.push({
        code: 'mentor_inactive',
        message: 'El rol de mentor debe estar activo para ser elegible.',
      });
    }

    const missingFields: string[] = [];
    const invalidFields: string[] = [];
    const userId = profile.userId;
    this.validateText(userId, 'Identificador de usuario', missingFields, invalidFields, false, false);

    const personalInfo = this.asRecord(profile.personalInfo) ?? {};
    const academicInfo = this.asRecord(profile.academicInfo) ?? {};
    const professionalInfo = this.asRecord(profile.professionalInfo) ?? {};

    this.validateText(personalInfo.firstName, 'Nombre', missingFields, invalidFields, true);
    this.validateText(personalInfo.lastName, 'Apellido', missingFields, invalidFields, true);
    this.validateText(personalInfo.email, 'Correo electrónico', missingFields, invalidFields, false, false);
    this.validateText(personalInfo.phone, 'Teléfono', missingFields, invalidFields, false, false);
    this.validateText(academicInfo.career, 'Carrera', missingFields, invalidFields);
    this.validateText(academicInfo.degree, 'Grado académico', missingFields, invalidFields);
    this.validateText(professionalInfo.summary, 'Resumen profesional', missingFields, invalidFields);
    this.validateText(profile.description, 'Descripción del perfil', missingFields, invalidFields);
    this.validateText(profile.experienceDescription, 'Descripción de experiencia', missingFields, invalidFields);

    const email = personalInfo.email;
    if (typeof email === 'string' && email.trim()
      && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      invalidFields.push('Correo electrónico válido');
    }

    const phone = personalInfo.phone;
    if (typeof phone === 'string' && phone.trim()
      && (!/^[+\d\s().-]+$/.test(phone) || phone.replace(/\D/g, '').length < 7)) {
      invalidFields.push('Teléfono válido');
    }

    this.validateNumber(
      academicInfo.graduationYear,
      'Año de egreso',
      1950,
      new Date().getFullYear(),
      true,
      missingFields,
      invalidFields,
    );
    this.validateNumber(
      professionalInfo.yearsExperience,
      'Años de experiencia',
      0,
      80,
      false,
      missingFields,
      invalidFields,
    );

    if (invalidFlags.length > 0) {
      invalidFields.push(...invalidFlags);
    }
    if (missingFields.length > 0) {
      issues.push({
        code: 'profile_incomplete',
        message: 'Completa todos los campos obligatorios del perfil mínimo.',
        missingFields: [...new Set(missingFields)],
      });
    }
    if (invalidFields.length > 0) {
      issues.push({
        code: 'invalid_profile_data',
        message: 'Corrige los campos con formato, tipo o valor inválido.',
        invalidFields: [...new Set(invalidFields)],
      });
    }

    const graduateIssueCodes = new Set([
      'not_graduate',
      'not_verified',
      'not_approved',
      'participation_restricted',
      'invalid_profile_data',
    ]);

    return {
      isActive: profile?.isMentorActive === true,
      requirements: {
        egresado: !issues.some((issue) => graduateIssueCodes.has(issue.code)),
        perfil: !issues.some((issue) => issue.code === 'profile_incomplete'),
      },
    };
  }

  deactivateMentorRole(
    profile: MentorEligibilityProfile,
    input: DeactivateMentorInput,
  ): DeactivateMentorResult {
    if (profile.isMentorActive !== true) {
      throw new ConflictException('El rol de mentor ya está desactivado.');
    }

    const retainedSettings: MentorSettings = {
      ...profile.mentorSettings,
      bio: profile.mentorSettings?.bio ?? profile.description,
    };

    return {
      success: true,
      message: 'La participación como mentor ha sido desactivada. Se ha conservado tu configuración previa.',
      userId: input.userId,
      isMentorActive: false,
      deactivatedAt: new Date(),
      retainedSettings,
    };
  }

  private addFlagIssue(
    profile: DataRecord,
    key: string,
    label: string,
    invalidFlags: string[],
  ): void {
    if (typeof profile[key] !== 'boolean') invalidFlags.push(label);
  }

  private validateText(
    value: unknown,
    label: string,
    missingFields: string[],
    invalidFields: string[],
    isName = false,
    requireLetter = true,
  ): void {
    if (value === undefined || value === null || (typeof value === 'string' && !value.trim())) {
      missingFields.push(label);
      return;
    }
    if (typeof value !== 'string') {
      invalidFields.push(label);
      return;
    }

    const text = value.trim();
    if ((requireLetter && !/\p{L}/u.test(text)) || (isName && /\d/u.test(text))) {
      invalidFields.push(`${label} válido`);
    }
  }

  private validateNumber(
    value: unknown,
    label: string,
    minimum: number,
    maximum: number,
    mustBeInteger: boolean,
    missingFields: string[],
    invalidFields: string[],
  ): void {
    if (value === undefined || value === null || value === '') {
      missingFields.push(label);
      return;
    }
    if (typeof value !== 'number' || !Number.isFinite(value)
      || (mustBeInteger && !Number.isInteger(value))
      || value < minimum || value > maximum) {
      invalidFields.push(label);
    }
  }

  private asRecord(value: unknown): DataRecord | undefined {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) return undefined;
    return value as DataRecord;
  }
}
