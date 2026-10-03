import React from 'react';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import { GraduateAffinityView } from './graduate-affinity-view';
import * as affinityService from '../services/affinity-service';

// Mock de navegación para la Épica 2
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock del radar para comprobar que solo recibe las áreas modificadas correctamente
jest.mock('@/shared/components/affinity-radar', () => ({
  __esModule: true,
  default: (props: { changedAreaIds?: string[] }) => (
    <div data-testid="radar" data-changed={JSON.stringify(props.changedAreaIds ?? [])} />
  ),
}));

jest.mock('../services/affinity-service');

const EXPECTED_LABELS = [
  'Desarrollo de Software',
  'Cloud/DevOps e Infraestructura',
  'Ciencia de Datos/IA',
  'Aseguramiento de Calidad (QA)',
  'Ciberseguridad y Redes',
  'Gestión de TI',
];

describe('GraduateAffinityView', () => {
  const mockGetAffinityConfig = affinityService.getAffinityConfig as jest.Mock;
  const mockRecalculateAffinity = affinityService.recalculateAffinity as jest.Mock;
  const mockGetAffinityVector = affinityService.getAffinityVector as jest.Mock;

  const recalculatedAreas = [
    { area: 'software-development', affinity: 85 },
    { area: 'cloud-devops', affinity: 64 },
    { area: 'data-ai', affinity: 71 },
    { area: 'quality-assurance', affinity: 58 },
    { area: 'cybersecurity-networks', affinity: 42 },
    { area: 'it-management', affinity: 50 },
  ];

  const simulateProfileChange = () => {
    fireEvent.click(screen.getByRole('button', { name: /simular actualización del radar/i }));
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetAffinityVector.mockResolvedValue({
      graduateId: 'id-1',
      calculatedAt: '2026-09-30T12:00:00.000Z',
      areas: recalculatedAreas,
    });

    mockGetAffinityConfig.mockResolvedValue({
      axes: [
        { area: 'software-development', weight: 4 },
        { area: 'cloud-devops', weight: 3 },
        { area: 'data-ai', weight: 3 },
        { area: 'quality-assurance', weight: 2 },
        { area: 'cybersecurity-networks', weight: 3 },
        { area: 'it-management', weight: 2 },
      ],
    });
    mockRecalculateAffinity.mockResolvedValue({
      graduateId: 'id-1',
      calculatedAt: '2026-09-30T12:00:00.000Z',
      areas: recalculatedAreas,
    });
  });

  // --- 1. Carga inicial: éxito y error ---
  it('carga el radar inicial desde el servicio', async () => {
    render(<GraduateAffinityView />);

    await waitFor(() => expect(mockGetAffinityVector).toHaveBeenCalledTimes(1));
    // Con un radar válido, Recalcular sigue deshabilitado (no hay cambios pendientes)
    expect(screen.getByRole('button', { name: 'Recalcular' })).toBeDisabled();
  });

  it('muestra el error con Reintentar si falla la carga inicial', async () => {
    mockGetAffinityVector.mockRejectedValueOnce(new Error('fallo'));
    render(<GraduateAffinityView />);

    expect(await screen.findByText('No se pudo actualizar tu radar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
  });

  // --- 2. «Añadir» navega con returnTo ---
  it('Añadir navega al flujo de Épica 2 con returnTo', async () => {
  render(<GraduateAffinityView />);
  
  // Asegúrate de usar el nombre exacto del botón que aparece en tu componente
  const addButton = await screen.findByRole('button', { name: /añadir certificaciones/i });
  
  fireEvent.click(addButton);
  
  expect(mockPush).toHaveBeenCalledWith(
    expect.stringContaining('returnTo=/afinidad')
  );
});

  it('deshabilita Recalcular y lo habilita al detectar un cambio nuevo', async () => {
    render(<GraduateAffinityView />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Recalcular' })).toBeDisabled();
    });

    simulateProfileChange();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Se detectaron modificaciones')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ahora no' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Recalcular' })).toBeEnabled();

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('recalcula desde el diálogo y muestra el toast de éxito', async () => {
    render(<GraduateAffinityView />);

    simulateProfileChange();
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Recalcular' }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    expect(mockRecalculateAffinity).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Radar actualizado')).toBeInTheDocument();
    expect(screen.getAllByText('85%').length).toBeGreaterThan(0);
    expect(screen.queryByText('95%')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Recalcular' })).toBeDisabled();
  });

  it('muestra el error con el mensaje exacto, conserva el radar anterior y permite reintentar', async () => {
    render(<GraduateAffinityView />);

    simulateProfileChange();
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Recalcular' }));
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
    expect(mockRecalculateAffinity).toHaveBeenCalledTimes(1);

    mockRecalculateAffinity.mockRejectedValueOnce(new Error('Network error'));
    simulateProfileChange();
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Recalcular' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('No se pudo actualizar tu radar')).toBeInTheDocument();

    expect(screen.getAllByText('85%').length).toBeGreaterThan(0);

    expect(screen.getByRole('button', { name: 'Recalcular' })).toBeEnabled();
    expect(screen.queryByText('Recalculando...')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getAllByText('85%').length).toBeGreaterThan(0);
    expect(mockRecalculateAffinity).toHaveBeenCalledTimes(3);
    expect(screen.getByRole('button', { name: 'Recalcular' })).toBeDisabled();
  });

  it('conserva el radar anterior atenuado cuando el recálculo falla', async () => {
    mockRecalculateAffinity
      .mockResolvedValueOnce({
        graduateId: 'id-1',
        calculatedAt: '2026-09-30T12:00:00.000Z',
        areas: recalculatedAreas,
      })
      .mockRejectedValueOnce(new Error('Network error'));
    render(<GraduateAffinityView />);

    simulateProfileChange();
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Recalcular' }));
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    simulateProfileChange();
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Recalcular' }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(document.querySelector('.opacity-40')).not.toBeNull();
    expect(screen.getAllByText('85%').length).toBeGreaterThan(0);
    expect(screen.queryByText('--%')).not.toBeInTheDocument();
  });

  // --- 3. «Simular timeout» con jest.useFakeTimers ---
  describe('Simular timeout', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('muestra el error con Reintentar y conserva el último radar válido', async () => {
      render(<GraduateAffinityView />);
      await waitFor(() => expect(mockGetAffinityVector).toHaveBeenCalled());

      const timeoutButton = screen.queryByRole('button', { name: /simular timeout/i });
      if (timeoutButton) {
        fireEvent.click(timeoutButton);

        expect(screen.queryByText('No se pudo actualizar tu radar')).not.toBeInTheDocument();

        await act(async () => {
          jest.advanceTimersByTime(7000);
        });

        expect(screen.getByText('No se pudo actualizar tu radar')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
        expect(screen.getAllByText('85%').length).toBeGreaterThan(0);
      }
    });
  });

  // --- 4. Un recálculo marca solo las áreas que cambiaron ---
  it('marca solo las áreas cuyo porcentaje cambió', async () => {
    const base = [
      { area: 'software-development', affinity: 80 },
      { area: 'cloud-devops', affinity: 60 },
      { area: 'data-ai', affinity: 70 },
      { area: 'quality-assurance', affinity: 50 },
      { area: 'cybersecurity-networks', affinity: 40 },
      { area: 'it-management', affinity: 55 },
    ];
    mockGetAffinityVector.mockResolvedValue({ graduateId: 'id-1', calculatedAt: '2026-10-01T00:00:00.000Z', areas: base });
    
    mockRecalculateAffinity.mockResolvedValue({
      graduateId: 'id-1',
      calculatedAt: '2026-10-02T00:00:00.000Z',
      areas: base.map((a) => (a.area === 'cloud-devops' ? { ...a, affinity: 90 } : a)),
    });

    render(<GraduateAffinityView />);
    await waitFor(() => expect(mockGetAffinityVector).toHaveBeenCalled());

    simulateProfileChange();
    fireEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Recalcular' })
    );

    await waitFor(() =>
      expect(screen.getByTestId('radar')).toHaveAttribute('data-changed', '["cloud-devops"]')
    );
  });

  it('muestra Personalizar en solo lectura con las ponderaciones del sistema', async () => {
    render(<GraduateAffinityView />);

    fireEvent.click(screen.getByRole('tab', { name: /personalizar/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/^Ponderación: /)).toHaveLength(6);
    });
    expect(screen.getByText('Ponderación: 4')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Las ponderaciones las define el sistema a partir de las palabras clave de tu perfil.'
      )
    ).toBeInTheDocument();
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Añadir' })).not.toBeInTheDocument();
    expect(mockGetAffinityConfig).toHaveBeenCalledTimes(1);
  });

  it('muestra las 6 etiquetas visibles en orden fijo con "Ciencia de Datos/IA"', () => {
    render(<GraduateAffinityView />);

    const summarySection = screen.getByText('Resumen de tu afinidad').parentElement?.parentElement;
    expect(summarySection).not.toBeNull();

    const labels = EXPECTED_LABELS.map((label) =>
      within(summarySection as HTMLElement).getByText(label),
    );

    labels.forEach((label, index) => {
      expect(label).toBeInTheDocument();
      if (index === 0) return;
      const previous = labels[index - 1];
      expect(previous.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });
});
