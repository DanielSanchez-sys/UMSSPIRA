'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EventStatus } from '@umsspira/shared-types';
import type { CreateEventDto } from '@umsspira/shared-types';
import { EventForm } from '@/shared/components/event-form';
import { createEvent } from '@/shared/services/events-service';

type Feedback = { type: 'success' | 'error'; message: string } | null;

export default function CreateEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const handleSubmit = async (
    values: Omit<CreateEventDto, 'status'>,
    status: EventStatus,
  ) => {
    setIsLoading(true);
    setFeedback(null);

    try {
      await createEvent({ ...values, status });

      const isPublished = status === EventStatus.PUBLICADO;
      setFeedback({
        type: 'success',
        message: isPublished
          ? 'Evento publicado correctamente.'
          : 'Borrador guardado correctamente.',
      });

      if (isPublished) {
        setTimeout(() => router.push('/events/catalog'), 1500);
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          error instanceof Error && error.message
            ? error.message
            : 'No se pudo guardar el evento. Inténtalo nuevamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-[960px] px-4 py-8 font-sans md:px-0">
      <h1 className="text-[22px] font-bold leading-[30px] text-[#1B2632] md:text-[32px] md:leading-[40px]">
        Crear evento
      </h1>
      <p className="mt-2 text-[14px] font-medium leading-[20px] text-[#2C3B4D] md:text-[18px] md:leading-[26px]">
        Completa la información para guardar un borrador o publicar el evento.
      </p>

      {feedback && (
        <div
          role="alert"
          className={`mt-6 rounded-lg border px-4 py-3 text-[14px] font-medium ${
            feedback.type === 'success'
              ? 'border-[#C9C1B1] bg-[#EEE9DF] text-[#1B2632]'
              : 'border-2 border-[#A35139] bg-[#EEE9DF] text-[#A35139]'
          }`}
        >
          {feedback.type === 'success' ? '✓ ' : ''}
          {feedback.message}
        </div>
      )}

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-[0px_2px_8px_rgba(0,0,0,0.05)]">
        <EventForm onSubmit={handleSubmit} isLoading={isLoading} />
      </section>
    </main>
  );
}