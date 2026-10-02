import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AffinityRadar from './affinity-radar';

// Mock de las funciones reales de porcentaje
jest.mock('../utils/percentage', () => ({
  clampPercentage: (val: number) => Math.min(Math.max(Math.round(val), 0), 100),
  formatPercentage: (val: number) => `${Math.min(Math.max(Math.round(val), 0), 100)}%`,
}));

const mockData = [
  { area: 'software-development', affinity: 85.5 }, // Debería redondear a 86%
  { area: 'cloud-devops', affinity: 70 },
  { area: 'data-ai', affinity: 90 },
  { area: 'quality-assurance', affinity: 60 },
  { area: 'cybersecurity-networks', affinity: 45 },
  { area: 'it-management', affinity: 80 },
];

describe('AffinityRadar Component', () => {
  it('renderiza las 6 áreas en el orden fijo', () => {
    render(<AffinityRadar affinityData={mockData as any} />);

    expect(screen.getByText('Desarrollo de Software')).toBeInTheDocument();
    expect(screen.getByText('Cloud/DevOps')).toBeInTheDocument();
    expect(screen.getByText('Ciencia de Datos/IA')).toBeInTheDocument();
    expect(screen.getByText('QA')).toBeInTheDocument();
    expect(screen.getByText('Ciberseguridad')).toBeInTheDocument();
    expect(screen.getByText('Gestión TI')).toBeInTheDocument();
  });

  it('muestra los detalles correctos al hacer clic en un área y reemplaza la selección', () => {
    render(<AffinityRadar affinityData={mockData as any} />);

    // Verificar estado inicial vacío
    expect(screen.getByText('Selecciona un área en el radar para ver el detalle de afinidad del titulado.')).toBeInTheDocument();

    // Clic en la primera área (Desarrollo de Software)
    const softwareDevLabel = screen.getByText('Desarrollo de Software');
    fireEvent.click(softwareDevLabel);

    // Debe mostrar la etiqueta correcta y el porcentaje redondeado formateado
    expect(screen.getByText('ÁREA SELECCIONADA (CLICK)')).toBeInTheDocument();
    expect(screen.getByText('86%')).toBeInTheDocument(); 

    // Clic en la segunda área (Cloud/DevOps)
    const cloudDevopsLabel = screen.getByText('Cloud/DevOps');
    fireEvent.click(cloudDevopsLabel);

    // Debe reemplazar el 86% anterior por el 70% de Cloud
    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.queryByText('86%')).not.toBeInTheDocument();
  });
});

//Para el radar miniatura
describe('AffinityRadar variante mini', () => {
  it('no muestra el panel de area seleccionada', () => {
    render(<AffinityRadar affinityData={mockData as any} variant="mini" />);

    expect(screen.queryByText('ÁREA SELECCIONADA (CLICK)')).not.toBeInTheDocument();
  });

  it('muestra etiquetas cortas con porcentaje', () => {
    render(<AffinityRadar affinityData={mockData as any} variant="mini" />);

    expect(screen.getByText('Desarrollo (86%)')).toBeInTheDocument();
    expect(screen.getByText('Cloud (70%)')).toBeInTheDocument();
    expect(screen.getByText('Datos & IA (90%)')).toBeInTheDocument();
    expect(screen.getByText('QA & Testing (60%)')).toBeInTheDocument();
    expect(screen.getByText('Ciberseg. (45%)')).toBeInTheDocument();
    expect(screen.getByText('Gestión (80%)')).toBeInTheDocument();
  });

  it('es de solo lectura: no responde a clics', () => {
    const { container } = render(
      <AffinityRadar affinityData={mockData as any} variant="mini" />
    );

    expect(container.querySelector('.cursor-pointer')).toBeNull();

    fireEvent.click(screen.getByText('Desarrollo (86%)'));
    expect(screen.queryByText('ÁREA SELECCIONADA (CLICK)')).not.toBeInTheDocument();
  });

  it('pinta el radar en rojo solo cuando esta destacado', () => {
    const { container, rerender } = render(
      <AffinityRadar affinityData={mockData as any} variant="mini" />
    );
    expect(container.querySelector('polygon.stroke-red-700')).toBeNull();

    rerender(<AffinityRadar affinityData={mockData as any} variant="mini" highlighted />);
    expect(container.querySelector('polygon.stroke-red-700')).not.toBeNull();
  });
});