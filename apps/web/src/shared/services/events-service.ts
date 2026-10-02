import type {
  CreateEventDto,
  EventItem,
} from '@umsspira/shared-types';

import { apiClient } from './api-client';

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
    headers: {
      'x-user-id': userId,
    },
    body: event,
  });
}
