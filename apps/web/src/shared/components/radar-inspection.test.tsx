import React from 'react';
import { render, screen } from '@testing-library/react';
import { RadarInspection } from './radar-inspection';

describe('RadarInspection Component', () => {
  it('se renderiza correctamente y muestra el texto guía', () => {
    // Si tu componente requiere props obligatorias (como áreas o datos), pásalas aquí de forma simulada
    render(<RadarInspection />);
    
    expect(
      screen.getByText(/Haz clic en un área para inspeccionar sus respaldos/i)
    ).toBeInTheDocument();
  });
});