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
import type { CertificationRecord } from '@/modules/profile/types/profile-record';
import { claseCampo } from '@/modules/profile/validation/mensaje-error';
import { validarCertificacion } from '@/modules/profile/validation/reglas-perfil';

type CertificationFormData = {
  name: string;
  issuer: string;
  year: string;
  degree: string;
};

type CertificationErrors = Partial<Record<keyof CertificationFormData, string>>;

// Mismos grados que el formulario de certificaciones de "Completar perfil"
const DEGREES = ['Fundamentos', 'Asociado', 'Profesional', 'Especialista', 'Experto'];

// Mismas reglas que al crear el registro, con los nombres de campo de esta pantalla
function validate(data: CertificationFormData): CertificationErrors {
  const errors = validarCertificacion({
    nombre: data.name,
    entidadEmisora: data.issuer,
    anioEmision: data.year,
    grado: data.degree,
  });
  const result: CertificationErrors = {
    name: errors.nombre,
    issuer: errors.entidadEmisora,
    year: errors.anioEmision,
    degree: errors.grado,
  };
  return Object.fromEntries(Object.entries(result).filter(([, message]) => message));
}

export function EditCertificationForm() {
  const { id } = useParams<{ id: string }>();
  const { records } = useProfileStore();
  const certification = (records.certification as CertificationRecord[]).find((record) => record.id === id);

  if (!certification) return <RecordNotFound label="certificación" />;

  return <EditCertificationFields key={certification.id} certification={certification} />;
}

function EditCertificationFields({ certification }: { certification: CertificationRecord }) {
  const router = useRouter();
  const { updateRecord } = useProfileStore();

  const [formData, setFormData] = useState<CertificationFormData>({
    name: certification.name,
    issuer: certification.issuer,
    year: certification.issueYear,
    degree: certification.degree,
  });
  const [documentName, setDocumentName] = useState(certification.backupFile ?? '');
  const [isNewDocument, setIsNewDocument] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState<CertificationErrors>({});
  const [hasTriedToSave, setHasTriedToSave] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    const next = { ...formData, [name]: name === 'year' ? value.replace(/\D/g, '') : value };
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
    updateRecord('certification', {
      ...certification,
      name: formData.name.trim(),
      issuer: formData.issuer.trim(),
      issueYear: formData.year,
      degree: formData.degree,
      backupFile: documentName || undefined,
      // Un respaldo nuevo vuelve a quedar en revisión
      backupVerified: isNewDocument ? false : certification.backupVerified,
    });
    setIsSaved(true);
  }

  return (
    <EditRecordLayout
      title="Editar certificación"
      description="Modifica los datos de esta certificación y guarda los cambios."
      number="03"
      sectionTitle="Certificaciones"
      sectionSubtitle="Credenciales que respaldan tu perfil"
      isSaved={isSaved}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/profile/records')}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="name" label="Nombre de la certificación" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby="error-name"
            className={claseCampo(INPUT_CLASS, errors.name)}
          />
        </FormField>
        <FormField id="issuer" label="Entidad emisora" error={errors.issuer}>
          <input
            id="issuer"
            name="issuer"
            type="text"
            value={formData.issuer}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.issuer)}
            aria-describedby="error-issuer"
            className={claseCampo(INPUT_CLASS, errors.issuer)}
          />
        </FormField>
        <FormField id="year" label="Año" error={errors.year}>
          <input
            id="year"
            name="year"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            value={formData.year}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.year)}
            aria-describedby="error-year"
            className={claseCampo(INPUT_CLASS, errors.year)}
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

      <BackupField
        documentName={documentName}
        isVerified={Boolean(documentName) && !isNewDocument && Boolean(certification.backupVerified)}
        onDocumentChange={handleDocumentChange}
      />
    </EditRecordLayout>
  );
}
