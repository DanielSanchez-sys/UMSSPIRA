'use client';

import { useState } from 'react';
import { Camera, FileText, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

type CertificationFormData = {
  name: string;
  issuer: string;
  year: string;
  degree: string;
};

const initialCertification: CertificationFormData = {
  name: 'AWS Cloud Practitioner',
  issuer: 'Amazon Web Services',
  year: '2024',
  degree: 'Profesional',
};

export function EditCertificationForm() {
  const router = useRouter();

  const [formData, setFormData] =
    useState<CertificationFormData>(initialCertification);

  const [documentName, setDocumentName] = useState(
    'aws-cloud-practitioner-cert.pdf',
  );

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
      setIsSaved(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Frontend solamente. El backend se conectará posteriormente.
    setIsSaved(true);
  }

  function handleCancel() {
    router.push('/profile/records');
  }

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
                  Certifica tus conocimientos para tu perfil.
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
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Profesional">Profesional</option>
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
                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                    Respaldo verificado
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