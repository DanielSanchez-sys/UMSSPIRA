import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { EVENT_STATUS, type EventItem } from '@umsspira/shared-types';
import EventsCatalogPage from './page';
import { getEventCatalog } from '@/shared/services/events-service';

jest.mock('@/shared/services/events-service', () => ({
  getEventCatalog: jest.fn(),
}));

const catalogEvents: EventItem[] = [
  {
    id: 'event-october',
    title: 'Feria de empleo',
    description: 'Encuentro profesional',
    startDate: '2026-10-12T09:00:00Z',
    endDate: '2026-10-12T12:00:00Z',
    maxCapacity: 100,
    location: 'Campus Central',
    status: EVENT_STATUS.PUBLICADO,
    createdBy: 'admin-1',
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'event-november',
    title: 'Taller de tecnología',
    description: 'Capacitación abierta',
    startDate: '2026-11-15T14:00:00Z',
    endDate: '2026-11-15T17:00:00Z',
    maxCapacity: 50,
    location: 'Laboratorio',
    status: EVENT_STATUS.PUBLICADO,
    createdBy: 'admin-1',
    createdAt: '2026-10-02T10:00:00Z',
  },
];

describe('catálogo de eventos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(getEventCatalog).mockResolvedValue(catalogEvents);
  });

  it('aplica la búsqueda y el mes seleccionado en el calendario', async () => {
    render(<EventsCatalogPage />);

    expect(await screen.findAllByText('Feria de empleo')).not.toHaveLength(0);
    expect(screen.getAllByText('Taller de tecnología')).not.toHaveLength(0);

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar eventos' }), {
      target: { value: 'tecnología' },
    });
    fireEvent.change(screen.getByLabelText('Filtrar por mes'), {
      target: { value: '2026-11' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(screen.getAllByText('Taller de tecnología')).not.toHaveLength(0);
    expect(screen.queryAllByText('Feria de empleo')).toHaveLength(0);
    expect(screen.getByText('1 eventos disponibles')).toBeInTheDocument();
  });

  it('envía los filtros al presionar Enter en la búsqueda', async () => {
    render(<EventsCatalogPage />);
    await screen.findAllByText('Feria de empleo');

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar eventos' }), {
      target: { value: 'feria' },
    });
    fireEvent.submit(screen.getByRole('form', { name: 'Filtros del catálogo' }));

    await waitFor(() => {
      expect(screen.queryAllByText('Taller de tecnología')).toHaveLength(0);
    });
    expect(screen.getAllByText('Feria de empleo')).not.toHaveLength(0);
  });
});
