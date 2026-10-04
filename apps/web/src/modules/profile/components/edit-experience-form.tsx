'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
  EditRecordLayout,
  FormField,
  INPUT_CLASS,
  RecordNotFound,
} from '@/modules/profile/components/edit-record-layout';
import { useProfileStore } from '@/modules/profile/state/profile-store';
import type { ExperienceRecord } from '@/modules/profile/types/profile-record';
import { claseCampo } from '@/modules/profile/validation/mensaje-error';
import { validarExperiencia } from '@/modules/profile/validation/reglas-perfil';

type ExperienceFormData = {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
};

type ExperienceErrors = Partial<Record<keyof ExperienceFormData, string>>;

// Mismas reglas que al crear el registro, con los nombres de campo de esta pantalla
function validate(data: ExperienceFormData, isCurrentJob: boolean): ExperienceErrors {
  const errors = validarExperiencia(
    { empresa: data.company, cargo: data.position, fechaInicio: data.startDate, fechaFin: data.endDate },
    isCurrentJob,
  );
  const result: ExperienceErrors = {
    company: errors.empresa,
    position: errors.cargo,
    startDate: errors.fechaInicio,
    endDate: errors.fechaFin,
  };
  return Object.fromEntries(Object.entries(result).filter(([, message]) => message));
}

export function EditExperienceForm() {
  const { id } = useParams<{ id: string }>();
  const { records } = useProfileStore();
  const experience = (records.experience as ExperienceRecord[]).find((record) => record.id === id);

  if (!experience) return <RecordNotFound label="experiencia laboral" />;

  return <EditExperienceFields key={experience.id} experience={experience} />;
}

function EditExperienceFields({ experience }: { experience: ExperienceRecord }) {
  const router = useRouter();
  const { updateRecord } = useProfileStore();

  const [formData, setFormData] = useState<ExperienceFormData>({
    company: experience.company,
    position: experience.position,
    startDate: experience.startDate,
    endDate: experience.endDate,
  });
  // Sin fecha de fin = trabajo actual (igual que en "Completar perfil")
  const [isCurrentJob, setIsCurrentJob] = useState(!experience.endDate);
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState<ExperienceErrors>({});
  const [hasTriedToSave, setHasTriedToSave] = useState(false);

  function update(next: ExperienceFormData, currentJob: boolean) {
    setFormData(next);
    setIsCurrentJob(currentJob);
    if (hasTriedToSave) setErrors(validate(next, currentJob));
    setIsSaved(false);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    update({ ...formData, [name]: value }, isCurrentJob);
  }

  function handleCurrentJobChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;
    update(checked ? { ...formData, endDate: '' } : formData, checked);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(formData, isCurrentJob);
    setHasTriedToSave(true);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    // Frontend solamente: actualiza el estado compartido del perfil. El backend se conectará posteriormente.
    updateRecord('experience', {
      ...experience,
      company: formData.company.trim(),
      position: formData.position.trim(),
      startDate: formData.startDate,
      endDate: isCurrentJob ? '' : formData.endDate,
    });
    setIsSaved(true);
  }

  return (
    <EditRecordLayout
      title="Editar experiencia laboral"
      description="Modifica los datos de esta experiencia laboral y guarda los cambios."
      number="02"
      sectionTitle="Experiencia laboral"
      sectionSubtitle="Tu experiencia profesional más relevante"
      isSaved={isSaved}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/profile/records')}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="company" label="Empresa" error={errors.company}>
          <input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.company)}
            aria-describedby="error-company"
            className={claseCampo(INPUT_CLASS, errors.company)}
          />
        </FormField>
        <FormField id="position" label="Cargo" error={errors.position}>
          <input
            id="position"
            name="position"
            type="text"
            value={formData.position}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.position)}
            aria-describedby="error-position"
            className={claseCampo(INPUT_CLASS, errors.position)}
          />
        </FormField>
        <FormField id="startDate" label="Fecha inicio" error={errors.startDate}>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            max={formData.endDate || undefined}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.startDate)}
            aria-describedby="error-startDate"
            className={claseCampo(INPUT_CLASS, errors.startDate)}
          />
        </FormField>
        <FormField id="endDate" label="Fecha fin" error={errors.endDate}>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            min={formData.startDate || undefined}
            onChange={handleChange}
            required={!isCurrentJob}
            disabled={isCurrentJob}
            aria-invalid={Boolean(errors.endDate)}
            aria-describedby="error-endDate"
            className={claseCampo(INPUT_CLASS, errors.endDate)}
          />
        </FormField>
      </div>

      <label className="flex w-fit items-center gap-2 text-[13px] text-umss-navy">
        <input
          type="checkbox"
          checked={isCurrentJob}
          onChange={handleCurrentJobChange}
          className="h-4 w-4 accent-umss-terracotta"
        />
        Actualmente trabajo aquí
      </label>
    </EditRecordLayout>
  );
}
