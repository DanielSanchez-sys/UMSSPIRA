'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
  BackupField,
  EditRecordLayout,
  FormField,
  INPUT_CLASS,
  RecordNotFound,
} from '@/modules/profile/components/edit-record-layout';
import { useProfileStore } from '@/modules/profile/state/profile-store';
import type { EducationRecord } from '@/modules/profile/types/profile-record';
import { claseCampo } from '@/modules/profile/validation/mensaje-error';
import { validarFormacion } from '@/modules/profile/validation/reglas-perfil';

type EducationFormData = {
  institution: string;
  title: string;
  graduationYear: string;
  degree: string;
};

type EducationErrors = Partial<Record<keyof EducationFormData, string>>;

// Mismos grados que el formulario de formación académica de "Completar perfil"
const DEGREES = ['Técnico superior', 'Licenciatura', 'Maestría', 'Doctorado'];

// Mismas reglas que al crear el registro, con los nombres de campo de esta pantalla
function validate(data: EducationFormData): EducationErrors {
  const errors = validarFormacion({
    institucion: data.institution,
    titulo: data.title,
    anioEgreso: data.graduationYear,
    grado: data.degree,
  });
  const result: EducationErrors = {
    institution: errors.institucion,
    title: errors.titulo,
    graduationYear: errors.anioEgreso,
    degree: errors.grado,
  };
  return Object.fromEntries(Object.entries(result).filter(([, message]) => message));
}

export function EditEducationForm() {
  const { id } = useParams<{ id: string }>();
  const { records } = useProfileStore();
  const education = (records.education as EducationRecord[]).find((record) => record.id === id);

  if (!education) return <RecordNotFound label="formación académica" />;

  return <EditEducationFields key={education.id} education={education} />;
}

function EditEducationFields({ education }: { education: EducationRecord }) {
  const router = useRouter();
  const { updateRecord } = useProfileStore();

  const [formData, setFormData] = useState<EducationFormData>({
    institution: education.institution,
    title: education.title,
    graduationYear: education.graduationYear,
    degree: education.degree,
  });
  const [documentName, setDocumentName] = useState(education.backupFile ?? '');
  const [isNewDocument, setIsNewDocument] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState<EducationErrors>({});
  const [hasTriedToSave, setHasTriedToSave] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    const next = { ...formData, [name]: name === 'graduationYear' ? value.replace(/\D/g, '') : value };
    setFormData(next);
    if (hasTriedToSave) setErrors(validate(next));
    setIsSaved(false);
  }

  function handleDocumentChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setDocumentName(file.name);
      setIsNewDocument(true);
      setIsSaved(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(formData);
    setHasTriedToSave(true);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    // Frontend solamente: actualiza el estado compartido del perfil. El backend se conectará posteriormente.
    updateRecord('education', {
      ...education,
      institution: formData.institution.trim(),
      title: formData.title.trim(),
      graduationYear: formData.graduationYear,
      degree: formData.degree,
      backupFile: documentName || undefined,
    });
    setIsSaved(true);
  }

  return (
    <EditRecordLayout
      title="Editar formación académica"
      description="Modifica los datos de esta formación académica y guarda los cambios."
      number="01"
      sectionTitle="Formación académica"
      sectionSubtitle="Tu formación académica principal"
      isSaved={isSaved}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/profile/records')}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="institution" label="Institución" error={errors.institution}>
          <input
            id="institution"
            name="institution"
            type="text"
            value={formData.institution}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.institution)}
            aria-describedby="error-institution"
            className={claseCampo(INPUT_CLASS, errors.institution)}
          />
        </FormField>
        <FormField id="title" label="Título" error={errors.title}>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.title)}
            aria-describedby="error-title"
            className={claseCampo(INPUT_CLASS, errors.title)}
          />
        </FormField>
        <FormField id="graduationYear" label="Año de egreso" error={errors.graduationYear}>
          <input
            id="graduationYear"
            name="graduationYear"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            title="Ingresa un año de 4 dígitos"
            value={formData.graduationYear}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.graduationYear)}
            aria-describedby="error-graduationYear"
            className={claseCampo(INPUT_CLASS, errors.graduationYear)}
          />
        </FormField>
        <FormField id="degree" label="Grado" error={errors.degree}>
          <select
            id="degree"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.degree)}
            aria-describedby="error-degree"
            className={claseCampo(INPUT_CLASS, errors.degree)}
          >
            {DEGREES.map((degree) => (
              <option key={degree} value={degree}>
                {degree}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* Un respaldo ya cargado se considera validado; uno nuevo queda en revisión */}
      <BackupField
        documentName={documentName}
        isVerified={Boolean(documentName) && !isNewDocument}
        onDocumentChange={handleDocumentChange}
      />
    </EditRecordLayout>
  );
}
