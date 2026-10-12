import { render, screen, waitFor } from '@testing-library/react';

import { EventsAccessGuard } from './events-access-guard';
import { getCurrentUserIdentity } from '../services/auth.service';

const mockReplace = jest.fn();
const mockRouter = { replace: mockReplace };
let mockPathname = '/events/catalog';

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => mockRouter,
}));

jest.mock('../services/auth.service', () => ({
  ...jest.requireActual('../services/auth.service'),
  getCurrentUserIdentity: jest.fn(),
}));

describe('EventsAccessGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('permite el catálogo al titulado', async () => {
    jest.mocked(getCurrentUserIdentity).mockResolvedValue({
      userId: 'graduate-1',
      role: 'titulado',
    });

    render(<EventsAccessGuard><p>Contenido permitido</p></EventsAccessGuard>);

    expect(await screen.findByText('Contenido permitido')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it.each([
    '/events',
    '/events/create',
    '/events/drafts',
    '/events/drafts/78869fe3-9744-41f6-a29e-fcf16e43c222',
    '/events/78869fe3-9744-41f6-a29e-fcf16e43c222',
  ])('mantiene bloqueada la ruta administrativa %s para Titulado', async (pathname) => {
    mockPathname = pathname;
    jest.mocked(getCurrentUserIdentity).mockResolvedValue({
      userId: 'graduate-1',
      role: 'titulado',
    });

    render(<EventsAccessGuard><p>Contenido administrativo</p></EventsAccessGuard>);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/events/catalog');
    });
    expect(screen.queryByText('Contenido administrativo')).not.toBeInTheDocument();
  });

  it('mantiene acceso administrativo y bloquea el catálogo para Administrador', async () => {
    jest.mocked(getCurrentUserIdentity).mockResolvedValue({
      userId: 'admin-1',
      role: 'administrador',
    });
    mockPathname = '/events';
    const { unmount } = render(
      <EventsAccessGuard><p>Contenido administrativo</p></EventsAccessGuard>,
    );
    expect(await screen.findByText('Contenido administrativo')).toBeInTheDocument();
    unmount();

    mockPathname = '/events/catalog';
    render(<EventsAccessGuard><p>Catálogo</p></EventsAccessGuard>);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/events'));
  });
});
