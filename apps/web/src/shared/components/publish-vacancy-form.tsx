"use client";

import { useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Lightbulb,
  MapPin,
  Sparkles,
} from "lucide-react";

interface VacancyFormData {
  title: string;
  modality: string;
  experienceLevel: string;
  technicalDescription: string;
}

const initialFormData: VacancyFormData = {
  title: "",
  modality: "",
  experienceLevel: "",
  technicalDescription: "",
};

export function PublishVacancyForm() {
  const [formData, setFormData] =
    useState<VacancyFormData>(initialFormData);

  const handleCancel = () => {
    setFormData(initialFormData);
  };

  return (
    <main className="min-h-screen bg-[#F7F4EE]">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        {/* Encabezado de la pantalla */}
        <div className="mb-7">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1E3] text-[#D97720]">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>

            <h1 className="text-2xl font-bold text-abyssal">
              Publicar una vacante
            </h1>
          </div>

          <p className="ml-[52px] text-sm text-[#66717C]">
            Completa la información de la vacante para encontrar al perfil que
            buscas.
          </p>
        </div>

        {/* Formulario + consejos */}
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,1fr)_300px]">
          {/* Formulario */}
          <section className="rounded-2xl border border-[#E4DED3] bg-white p-6 shadow-sm sm:p-8">
            <form
              onSubmit={(event) => event.preventDefault()}
              className="space-y-6"
            >
              {/* Primera fila */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-semibold text-abyssal"
                  >
                    Título <span className="text-[#A35139]">*</span>
                  </label>

                  <div className="relative">
                    <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A929A]" />

                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          title: event.target.value,
                        })
                      }
                      placeholder="Ej. Desarrollador Frontend"
                      className="h-11 w-full rounded-lg border border-oatmeal bg-[#EEE9DF] pl-10 pr-3 text-sm text-abyssal outline-none transition placeholder:text-[#8A929A] focus:border-[#2C3B4D] focus:bg-white focus:ring-1 focus:ring-[#2C3B4D]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="modality"
                    className="mb-2 block text-sm font-semibold text-abyssal"
                  >
                    Modalidad <span className="text-[#A35139]">*</span>
                  </label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#8A929A]" />

                    <select
                      id="modality"
                      name="modality"
                      value={formData.modality}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          modality: event.target.value,
                        })
                      }
                      className="h-11 w-full appearance-none rounded-lg border border-oatmeal bg-[#EEE9DF] pl-10 pr-9 text-sm text-abyssal outline-none transition focus:border-[#2C3B4D] focus:bg-white focus:ring-1 focus:ring-[#2C3B4D]"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="PRESENCIAL">PRESENCIAL</option>
                      <option value="HIBRIDO">HIBRIDO</option>
                      <option value="REMOTO">REMOTO</option>
                    </select>

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#66717C]">
                      ▼
                    </span>
                  </div>
                </div>
              </div>

              {/* Nivel de experiencia */}
              <div>
                <label
                  htmlFor="experienceLevel"
                  className="mb-2 block text-sm font-semibold text-abyssal"
                >
                  Nivel de experiencia{" "}
                  <span className="text-[#A35139]">*</span>
                </label>

                <div className="relative">
                  <ClipboardCheck className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#8A929A]" />

                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        experienceLevel: event.target.value,
                      })
                    }
                    className="h-11 w-full appearance-none rounded-lg border border-oatmeal bg-[#EEE9DF] pl-10 pr-9 text-sm text-abyssal outline-none transition focus:border-[#2C3B4D] focus:bg-white focus:ring-1 focus:ring-[#2C3B4D]"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="SIN_EXPERIENCIA">Sin experiencia</option>
                    <option value="JUNIOR">Junior</option>
                    <option value="SEMI_SENIOR">Semi Senior</option>
                    <option value="SENIOR">Senior</option>
                  </select>

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#66717C]">
                    ▼
                  </span>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label
                  htmlFor="technicalDescription"
                  className="mb-2 block text-sm font-semibold text-abyssal"
                >
                  Descripción técnica{" "}
                  <span className="text-[#A35139]">*</span>
                </label>

                <div className="relative">
                  <FileText className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#8A929A]" />

                  <textarea
                    id="technicalDescription"
                    name="technicalDescription"
                    rows={6}
                    value={formData.technicalDescription}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        technicalDescription: event.target.value,
                      })
                    }
                    placeholder="Describe las responsabilidades, conocimientos técnicos, herramientas y requisitos necesarios para el puesto."
                    className="w-full resize-none rounded-lg border border-oatmeal bg-[#EEE9DF] py-3 pl-10 pr-3 text-sm leading-6 text-abyssal outline-none transition placeholder:text-[#8A929A] focus:border-[#2C3B4D] focus:bg-white focus:ring-1 focus:ring-[#2C3B4D]"
                  />
                </div>

                <p className="mt-2 text-xs text-[#7B858E]">
                  Incluye tecnologías, herramientas y conocimientos necesarios.
                </p>
              </div>

              {/* Acciones */}
              <div className="flex items-center justify-end gap-3 border-t border-[#EEE9DF] pt-5">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="h-11 rounded-lg border border-oatmeal bg-white px-6 text-sm font-semibold text-abyssal transition hover:bg-[#F7F4EE]"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="h-11 rounded-lg bg-burning-flame px-6 text-sm font-bold text-abyssal shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#2C3B4D] focus:ring-offset-2"
                >
                  Publicar vacante
                </button>
              </div>
            </form>
          </section>

          {/* Panel lateral */}
          <aside className="rounded-2xl border border-[#E4DED3] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF1E3] text-[#D97720]">
                <Lightbulb className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-abyssal">
                  Consejos para una buena publicación
                </h2>

                <p className="mt-1 text-xs leading-5 text-[#7B858E]">
                  Una buena oferta ayuda a encontrar mejores candidatos.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Tip text="Usa un título claro y directo para el puesto." />
              <Tip text="Describe las habilidades y conocimientos necesarios." />
              <Tip text="Menciona las herramientas y tecnologías que utilizará." />
              <Tip text="Revisa la información antes de publicar la vacante." />
            </div>

            <div className="mt-6 rounded-xl border border-[#F2D8B8] bg-[#FFF8EE] p-4">
              <div className="flex gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#D97720]" />

                <p className="text-xs leading-5 text-[#59636D]">
                  Una buena descripción ayuda a que los estudiantes comprendan
                  mejor qué perfil estás buscando.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D97720]" />
      <p className="text-sm leading-5 text-[#59636D]">{text}</p>
    </div>
  );
}