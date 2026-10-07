import type { ReactNode } from 'react';
import { EventsAccessGuard } from '@/modules/auth/frontend/components/events-access-guard';
import { EventsHeader } from '@/shared/components/events-ui';
import './events.css';

export default function EventsLayout({ children }: { children: ReactNode }) {
  return (
    <EventsAccessGuard>
      <EventsHeader>{children}</EventsHeader>
    </EventsAccessGuard>
  );
}
