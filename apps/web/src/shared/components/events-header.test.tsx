import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { EventsHeader } from './events-ui';
import { AuthenticatedUserProvider } from '@/modules/auth/frontend/components/authenticated-user-context';

const mockReplace = jest.fn();
const mockRefresh = jest.fn();
const mockSignOut = jest.fn();
let mockPathname = '/events';

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
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
    mockPathname = '/events';
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

  it('mantiene la identidad y las opciones administrativas para Administrador', () => {
    render(
      <AuthenticatedUserProvider userId="admin-1" role="administrador">
        <EventsHeader><p>Eventos</p></EventsHeader>
      </AuthenticatedUserProvider>,
    );

    expect(screen.getAllByText('AD')).not.toHaveLength(0);
    expect(screen.getByText('Administración')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Eventos/i }));
    expect(screen.getByRole('menuitem', { name: 'Gestión de eventos' }))
      .toHaveAttribute('href', '/events');
    expect(screen.getByRole('menuitem', { name: 'Crear evento' }))
      .toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Borradores' }))
      .toBeInTheDocument();
  });

  it.each([
    ['titulado', 'TI', 'Titulado'],
    ['egresado', 'EG', 'Egresado'],
  ] as const)('muestra navegación de catálogo para %s', (role, initials, label) => {
    mockPathname = '/events/catalog';
    render(
      <AuthenticatedUserProvider userId="graduate-1" role={role}>
        <EventsHeader><p>Catálogo</p></EventsHeader>
      </AuthenticatedUserProvider>,
    );

    expect(screen.getAllByText(initials)).not.toHaveLength(0);
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.queryByText('Administración')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Eventos/i }));
    expect(screen.getByRole('menuitem', { name: 'Catálogo de eventos' }))
      .toHaveAttribute('href', '/events/catalog');
    expect(screen.queryByRole('menuitem', { name: 'Gestión de eventos' }))
      .not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Crear evento' }))
      .not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Borradores' }))
      .not.toBeInTheDocument();
  });
});
