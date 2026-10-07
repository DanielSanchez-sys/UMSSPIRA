import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { EventsHeader } from './events-ui';

const mockReplace = jest.fn();
const mockRefresh = jest.fn();
const mockSignOut = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => '/events',
  useRouter: () => ({
    push: jest.fn(),
    replace: mockReplace,
    refresh: mockRefresh,
  }),
}));

jest.mock('@/shared/services/events-service', () => ({
  getAdminEvents: jest.fn(),
  publishDraftEvent: jest.fn(),
}));

jest.mock('@/shared/lib/supabase', () => ({
  getSupabaseClient: () => ({
    auth: { signOut: mockSignOut },
  }),
}));

describe('EventsHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignOut.mockResolvedValue({ error: null });
  });

  it('cierra la sesión de Supabase y vuelve al login', async () => {
    render(
      <EventsHeader>
        <p>Eventos</p>
      </EventsHeader>,
    );

    fireEvent.click(
      screen.getAllByRole('button', {
        name: 'Cerrar sesión y volver al login',
      })[0],
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it('muestra un error claro si Supabase no logra cerrar la sesión', async () => {
    mockSignOut.mockResolvedValue({ error: new Error('network error') });
    render(
      <EventsHeader>
        <p>Eventos</p>
      </EventsHeader>,
    );

    fireEvent.click(
      screen.getAllByRole('button', {
        name: 'Cerrar sesión y volver al login',
      })[0],
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo cerrar la sesión.',
    );
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
