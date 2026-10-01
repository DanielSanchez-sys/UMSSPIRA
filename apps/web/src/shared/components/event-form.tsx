'use client';

import { FormEvent, useState } from 'react';
import {
  CreateEventDto,
  EVENT_STATUS,
} from '@umsspira/shared-types';

interface EventFormState {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  maxCapacity: string;
  location: string;
  image: File | null;
}

interface EventFormErrors {
  title?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  maxCapacity?: string;
}

export interface EventFormProps {
  onSubmit: (
    event: CreateEventDto,
    image: File | null,
  ) => void | Promise<void>;

  isSubmitting?: boolean;
}

const initialState: EventFormState = {
  title: '',
  description: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  maxCapacity: '',
  location: '',
  image: null,
};

export default function EventForm({
  onSubmit,
  isSubmitting = false,
}: EventFormProps) {
  const [form, setForm] = useState<EventFormState>(initialState);
  const [errors, setErrors] = useState<EventFormErrors>({});

  const updateField = (
    field: keyof Omit<EventFormState, 'image'>,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const validate = (): EventFormErrors => {
    const newErrors: EventFormErrors = {};

    if (!form.title.trim()) {
      newErrors.title = 'El título es obligatorio.';
    }

    if (!form.startDate) {
      newErrors.startDate = 'La fecha de inicio es obligatoria.';
    }

    if (!form.startTime) {
      newErrors.startTime = 'La hora de inicio es obligatoria.';
    }

    if (!form.endDate) {
      newErrors.endDate = 'La fecha de finalización es obligatoria.';
    }

    if (!form.endTime) {
      newErrors.endTime = 'La hora de finalización es obligatoria.';
    }

    const capacity = Number(form.maxCapacity);

    if (
      !form.maxCapacity ||
      !Number.isFinite(capacity) ||
      capacity <= 0
    ) {
      newErrors.maxCapacity = 'El cupo máximo debe ser mayor a 0.';
    }

    if (
      form.startDate &&
      form.startTime &&
      form.endDate &&
      form.endTime
    ) {
      const startDateTime = new Date(
        `${form.startDate}T${form.startTime}:00`,
      );

      const endDateTime = new Date(
        `${form.endDate}T${form.endTime}:00`,
      );

      if (endDateTime <= startDateTime) {
        newErrors.endDate =
          'La finalización debe ser posterior al inicio.';
        newErrors.endTime =
          'La finalización debe ser posterior al inicio.';
      }
    }

    return newErrors;
  };

  const buildEventDto = (
    status: 'BORRADOR' | 'PUBLICADO',
  ): CreateEventDto => {
    return {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      startDate: `${form.startDate}T${form.startTime}:00`,
      endDate: `${form.endDate}T${form.endTime}:00`,
      maxCapacity: Number(form.maxCapacity),
      location: form.location.trim() || undefined,
      status,
    };
  };

  const submit = async (
    status: 'BORRADOR' | 'PUBLICADO',
  ) => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dto = buildEventDto(status);

    await onSubmit(dto, form.image);
  };

  const handlePublish = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    void submit(EVENT_STATUS.PUBLICADO);
  };

  return (
    <form
      onSubmit={handlePublish}
      noValidate
      className="w-full rounded-xl border border-[#C9C1B1] bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#1B2632]">
          Información del evento
        </h2>

        <p className="mt-1 text-sm text-[#2C3B4D]">
          Completa los datos para crear un evento universitario.
        </p>
      </div>

      <div className="space-y-5">
        <FormField
          label="Título del evento"
          required
          error={errors.title}
        >
          <input
            type="text"
            value={form.title}
            onChange={(event) =>
              updateField('title', event.target.value)
            }
            placeholder="Ej. Feria de Oportunidades UMSS"
            className={inputClass(Boolean(errors.title))}
          />
        </FormField>

        <FormField
          label="Descripción"
          optional
        >
          <textarea
            value={form.description}
            onChange={(event) =>
              updateField('description', event.target.value)
            }
            placeholder="Describe brevemente el evento"
            rows={4}
            className={`${inputClass()} resize-y`}
          />
        </FormField>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label="Fecha de inicio"
            required
            error={errors.startDate}
          >
            <input
              type="date"
              value={form.startDate}
              onChange={(event) =>
                updateField('startDate', event.target.value)
              }
              className={inputClass(Boolean(errors.startDate))}
            />
          </FormField>

          <FormField
            label="Hora de inicio"
            required
            error={errors.startTime}
          >
            <input
              type="time"
              value={form.startTime}
              onChange={(event) =>
                updateField('startTime', event.target.value)
              }
              className={inputClass(Boolean(errors.startTime))}
            />
          </FormField>

          <FormField
            label="Fecha de finalización"
            required
            error={errors.endDate}
          >
            <input
              type="date"
              value={form.endDate}
              onChange={(event) =>
                updateField('endDate', event.target.value)
              }
              className={inputClass(Boolean(errors.endDate))}
            />
          </FormField>

          <FormField
            label="Hora de finalización"
            required
            error={errors.endTime}
          >
            <input
              type="time"
              value={form.endTime}
              onChange={(event) =>
                updateField('endTime', event.target.value)
              }
              className={inputClass(Boolean(errors.endTime))}
            />
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label="Ubicación"
            optional
          >
            <input
              type="text"
              value={form.location}
              onChange={(event) =>
                updateField('location', event.target.value)
              }
              placeholder="Ej. Campus Central UMSS"
              className={inputClass()}
            />
          </FormField>

          <FormField
            label="Cupo máximo"
            required
            error={errors.maxCapacity}
          >
            <input
              type="number"
              min={1}
              step={1}
              value={form.maxCapacity}
              onChange={(event) =>
                updateField('maxCapacity', event.target.value)
              }
              placeholder="Ej. 150"
              className={inputClass(Boolean(errors.maxCapacity))}
            />
          </FormField>
        </div>

        <FormField
          label="Imagen de portada"
          optional
        >
          <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#C9C1B1] bg-[#EEE9DF] px-4 py-4 text-center transition hover:border-[#FFB162]">
            <span className="text-sm font-medium text-[#1B2632]">
              {form.image
                ? form.image.name
                : 'Seleccionar imagen'}
            </span>

            <span className="mt-1 text-xs text-[#2C3B4D]">
              Imagen de portada del evento
            </span>

            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file =
                  event.target.files?.[0] ?? null;

                setForm((current) => ({
                  ...current,
                  image: file,
                }));
              }}
            />
          </label>
        </FormField>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() =>
            void submit(EVENT_STATUS.BORRADOR)
          }
          className="rounded-lg border border-[#2C3B4D] bg-white px-5 py-2.5 text-sm font-medium text-[#1B2632] transition hover:bg-[#EEE9DF] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Guardar borrador
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#FFB162] px-5 py-2.5 text-sm font-semibold text-[#1B2632] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? 'Procesando...'
            : 'Publicar evento'}
        </button>
      </div>
    </form>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}

function FormField({
  label,
  required = false,
  optional = false,
  error,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#1B2632]">
        {label}

        {required && (
          <span className="text-[#A35139]"> *</span>
        )}

        {optional && (
          <span className="font-normal text-[#2C3B4D]/70">
            {' '}
            (opcional)
          </span>
        )}
      </label>

      {children}

      {error && (
        <p
          role="alert"
          className="mt-1.5 text-xs font-medium text-[#A35139]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError = false) {
  return [
    'w-full rounded-lg border bg-[#EEE9DF]',
    'px-3 py-2.5 text-sm text-[#1B2632]',
    'outline-none transition',
    'placeholder:text-[#2C3B4D]/50',
    'focus:border-[#FFB162]',
    'focus:ring-2 focus:ring-[#FFB162]/20',
    hasError
      ? 'border-[#A35139]'
      : 'border-[#C9C1B1]',
  ].join(' ');
}