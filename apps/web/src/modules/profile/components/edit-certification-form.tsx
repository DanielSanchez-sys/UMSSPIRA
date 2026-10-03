'use client';

import { useState } from 'react';
import { Camera, FileText, Check } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { useProfileStore } from '@/modules/profile/state/profile-store';
import type { CertificationRecord } from '@/modules/profile/types/profile-record';

type CertificationFormData = {
  name: string;
  issuer: string;
  year: string;
  degree: string;
};

// Mismos grados que el formulario de certificaciones de "Completar perfil"
const DEGREES = ['Fundamentos', 'Asociado', 'Profesional', 'Especialista', 'Experto'];

export function EditCertificationForm() {
  const { id } = useParams<{ id: string }>();
  const { records } = useProfileStore();
  const certification = (records.certification as CertificationRecord[]).find((record) => record.id === id);

  if (!certification) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-umss-ink/10 bg-white p-6">
        <h1 className="text-xl font-bold text-umss-navy">No encontramos esta certificación</h1>
        <p className="text-sm text-umss-navy/70">Puede que haya sido eliminada. Vuelve a tus registros para elegir otra.</p>
        <Link
          href="/profile/records"
          className="rounded-lg border border-umss-sand bg-white px-5 py-2.5 text-sm font-semibold text-umss-navy transition hover:bg-umss-cream"
        >
          Volver a mis registros
        </Link>
      </div>
    );
  }

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

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setIsSaved(false);
  }

  function handleDocumentChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (file) {
      setDocumentName(file.name);
      setIsNewDocument(true);
      setIsSaved(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

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

  function handleCancel() {
    router.push('/profile/records');
  }

  const isVerified = Boolean(documentName) && !isNewDocument && certification.backupVerified;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-umss-terracotta">
          Perfil profesional
        </p>

        <h1 className="text-[28px] font-bold leading-tight text-umss-navy md:text-[34px]">
          Editar certificación
        </h1>

        <p className="text-sm text-umss-navy/70">
          Modifica los datos de esta certificación y guarda los cambios.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-umss-ink/10 bg-white p-6"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-umss-navy text-xs font-bold text-white">
                03
              </span>

              <div>
                <h2 className="text-base font-bold text-umss-navy">
                  Certificaciones
                </h2>

                <p className="text-xs text-umss-navy/60">
                  Credenciales que respaldan tu perfil
                </p>
              </div>
            </div>
          </div>

          {isSaved && (
            <span className="flex items-center gap-1 rounded-full bg-umss-terracotta px-3 py-1 text-xs font-semibold text-white">
              <Check className="h-3 w-3" aria-hidden="true" />
              Guardado
            </span>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-xs font-semibold text-umss-navy"
            >
              Nombre de la certificación
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="rounded-lg border border-umss-sand bg-white px-4 py-3 text-sm text-umss-navy outline-none transition focus:border-umss-terracotta"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="issuer"
              className="text-xs font-semibold text-umss-navy"
            >
              Entidad emisora
            </label>

            <input
              id="issuer"
              name="issuer"
              type="text"
              value={formData.issuer}
              onChange={handleChange}
              required
              className="rounded-lg border border-umss-sand bg-white px-4 py-3 text-sm text-umss-navy outline-none transition focus:border-umss-terracotta"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="year"
              className="text-xs font-semibold text-umss-navy"
            >
              Año
            </label>

            <input
              id="year"
              name="year"
              type="number"
              min="1950"
              max="2100"
              value={formData.year}
              onChange={handleChange}
              required
              className="rounded-lg border border-umss-sand bg-white px-4 py-3 text-sm text-umss-navy outline-none transition focus:border-umss-terracotta"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="degree"
              className="text-xs font-semibold text-umss-navy"
            >
              Grado
            </label>

            <select
              id="degree"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              required
              className="rounded-lg border border-umss-sand bg-white px-4 py-3 text-sm text-umss-navy outline-none transition focus:border-umss-terracotta"
            >
              {DEGREES.map((degree) => (
                <option key={degree} value={degree}>
                  {degree}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <label className="text-xs font-semibold text-umss-navy">
            Respaldo documental
          </label>

          <div className="rounded-lg bg-umss-cream p-4">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {documentName && (
                <>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      isVerified ? 'bg-green-100 text-green-700' : 'bg-[#FFF3CD] text-[#664D03]'
                    }`}
                  >
                    {isVerified ? 'Respaldo verificado' : 'Respaldo en revisión'}
                  </span>

                  <span className="flex items-center gap-1 text-xs text-umss-navy/70">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    {documentName}
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-umss-sand bg-white px-4 py-2 text-xs font-semibold text-umss-navy transition hover:bg-umss-cream">
                <Camera className="h-4 w-4" aria-hidden="true" />
                Subir foto

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleDocumentChange}
                />
              </label>

              <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-umss-ink px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110">
                <FileText className="h-4 w-4" aria-hidden="true" />
                Subir documento

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleDocumentChange}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-lg bg-umss-orange px-5 py-2.5 text-sm font-bold text-umss-navy transition hover:brightness-95"
          >
            Guardar cambios
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-umss-sand bg-white px-5 py-2.5 text-sm font-semibold text-umss-navy transition hover:bg-umss-cream"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}