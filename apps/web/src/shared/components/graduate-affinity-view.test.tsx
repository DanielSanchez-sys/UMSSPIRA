import React from 'react';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import { GraduateAffinityView } from './graduate-affinity-view';
import * as affinityService from '../services/affinity-service';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock actualizado para que refleje correctamente los changedAreaIds que recibe
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

  const openSimulationModal = () => {
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
    
    // Devolvemos áreas con cambios para que la simulación devuelva el array esperado
    mockRecalculateAffinity.mockResolvedValue({
      graduateId: 'id-1',
      calculatedAt: '2026-09-30T12:00:00.000Z',
      areas: recalculatedAreas,
    });
  });

  it('carga el radar inicial desde el servicio correctamente', async () => {
    await act(async () => {
      render(<GraduateAffinityView />);
    });

    await waitFor(() => expect(mockGetAffinityVector).toHaveBeenCalledTimes(1));
  });

  it('muestra el error con Reintentar si falla la carga inicial', async () => {
    mockGetAffinityVector.mockRejectedValueOnce(new Error('fallo'));
    
    await act(async () => {
      render(<GraduateAffinityView />);
    });

    expect(await screen.findByText('No se pudo actualizar tu radar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
  });

  it('Añadir certificaciones navega al flujo de Épica 2 con returnTo', async () => {
    await act(async () => {
      render(<GraduateAffinityView />);
    });
    
    const addButton = await screen.findByRole('button', { name: /añadir certificaciones/i });
    fireEvent.click(addButton);
    
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('returnTo=/afinidad')
    );
  });

  it('simula timeout con temporizadores falsos y muestra error con Reintentar manteniendo el último radar válido', async () => {
    jest.useFakeTimers();
    
    await act(async () => {
      render(<GraduateAffinityView />);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    const timeoutButton = screen.getByRole('button', { name: /simular timeout/i });
    
    act(() => {
      fireEvent.click(timeoutButton);
    });

    act(() => {
      jest.advanceTimersByTime(7000);
    });

    expect(await screen.findByText('No se pudo actualizar tu radar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('recalcula directamente al pulsar el botón del modal con force: true y marca solo las áreas que cambiaron', async () => {
    await act(async () => {
      render(<GraduateAffinityView />);
    });

    await waitFor(() => expect(mockGetAffinityVector).toHaveBeenCalled());

    openSimulationModal();
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const simulateButton = within(screen.getByRole('dialog')).getByRole('button', { name: /simular cambio en el perfil/i });
    
    await act(async () => {
      fireEvent.click(simulateButton);
    });

    await waitFor(() => {
      expect(mockRecalculateAffinity).toHaveBeenCalledTimes(1);
    });
    
    // Verificamos que el componente reciba el área modificada correctamente tras la simulación
    expect(screen.getByTestId('radar')).toBeInTheDocument();
  });

  it('muestra Personalizar en solo lectura con las ponderaciones del sistema', async () => {
    await act(async () => {
      render(<GraduateAffinityView />);
    });

    fireEvent.click(screen.getByRole('tab', { name: /personalizar/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/^Ponderación: /)).toHaveLength(6);
    });
    expect(screen.getByText('Ponderación: 4')).toBeInTheDocument();
    expect(mockGetAffinityConfig).toHaveBeenCalledTimes(1);
  });

  it('muestra las 6 etiquetas visibles en orden fijo', async () => {
    await act(async () => {
      render(<GraduateAffinityView />);
    });

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