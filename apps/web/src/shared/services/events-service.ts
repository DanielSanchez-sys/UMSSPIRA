import type {
  CreateEventDto,
  EventItem,
  UpdateDraftEventDto,
} from '@umsspira/shared-types';

import { apiClient } from './api-client';

export function getEventCatalog(): Promise<EventItem[]> {
  return apiClient<EventItem[]>('/api/events/catalog');
}

export function createEvent(
  event: CreateEventDto,
  userId?: string,
): Promise<EventItem> {
  if (!userId) {
    throw new Error(
      'No hay un usuario autenticado disponible para crear el evento.',
    );
  }

  return apiClient<EventItem>('/api/events', {
    method: 'POST',
    body: event,
  });
}

export function getAdminEvents(
  userId?: string,
): Promise<EventItem[]> {
  requireUserId(
    userId,
    'consultar los eventos',
  );

  return apiClient<EventItem[]>('/api/events/admin');
}

export function getAdminDraft(
  eventId: string,
  userId?: string,
): Promise<EventItem> {
  requireUserId(
    userId,
    'consultar el borrador',
  );

  return apiClient<EventItem>(
    `/api/events/admin/${encodeURIComponent(eventId)}`,
  );
}

export function updateDraftEvent(
  eventId: string,
  event: UpdateDraftEventDto,
  userId?: string,
): Promise<EventItem> {
  requireUserId(
    userId,
    'actualizar el borrador',
  );

  return apiClient<EventItem>(
    `/api/events/admin/${encodeURIComponent(eventId)}`,
    {
      method: 'PATCH',
      body: event,
    },
  );
}

export function publishDraftEvent(
  eventId: string,
  userId?: string,
): Promise<EventItem> {
  requireUserId(
    userId,
    'publicar el borrador',
  );

  return apiClient<EventItem>(
    `/api/events/admin/${encodeURIComponent(eventId)}/publish`,
    {
      method: 'PATCH',
    },
  );
}

function requireUserId(
  userId: string | undefined,
  operation: string,
): string {
  if (!userId) {
    throw new Error(
      `No hay un usuario autenticado disponible para ${operation}.`,
    );
  }

  return userId;
}
