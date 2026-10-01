import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RadarErrorState } from './radar-error-state';

describe('RadarErrorState', () => {
  const defaultProps = {
    onRetry: jest.fn(),
    isRetrying: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra el aviso de error con role alert', () => {
    render(<RadarErrorState {...defaultProps} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('No se pudo actualizar, vuelve a intentarlo.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
  });

  it('ejecuta onRetry al hacer clic en Reintentar', () => {
    const onRetry = jest.fn();
    render(<RadarErrorState {...defaultProps} onRetry={onRetry} />);

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('deshabilita Reintentar mientras isRetrying es true', () => {
    const onRetry = jest.fn();
    render(<RadarErrorState {...defaultProps} onRetry={onRetry} isRetrying={true} />);

    const button = screen.getByRole('button', { name: 'Reintentar' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onRetry).not.toHaveBeenCalled();
  });
});
