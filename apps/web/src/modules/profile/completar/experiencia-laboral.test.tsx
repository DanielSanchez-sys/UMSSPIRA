import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { FormularioExperiencia } from './experiencia-laboral';

describe('FormularioExperiencia · validaciones', () => {
  it('muestra los errores de los campos obligatorios', () => {
    const onAgregar = jest.fn();
    render(<FormularioExperiencia experiencias={[]} onAgregar={onAgregar} />);

    fireEvent.click(screen.getByRole('button', { name: 'Agregar experiencia' }));

    expect(screen.getByText('La empresa es obligatoria.')).toBeInTheDocument();
    expect(screen.getByText('El cargo es obligatorio.')).toBeInTheDocument();
    expect(onAgregar).not.toHaveBeenCalled();
  });

  it('rechaza una fecha fin anterior a la fecha inicio', () => {
    const { container } = render(<FormularioExperiencia experiencias={[]} onAgregar={jest.fn()} />);
    const [inicio, fin] = Array.from(container.querySelectorAll('input[type="date"]'));
    fireEvent.change(screen.getByPlaceholderText('Ej. Jalasoft'), { target: { value: 'Jalasoft' } });
    fireEvent.change(screen.getByPlaceholderText('Ej. Desarrollador Frontend'), { target: { value: 'Dev' } });
    fireEvent.change(inicio, { target: { value: '2023-08-01' } });
    fireEvent.change(fin, { target: { value: '2022-03-01' } });

    fireEvent.click(screen.getByRole('button', { name: 'Agregar experiencia' }));

    expect(screen.getByText("La fecha 'Hasta' no puede ser anterior a 'Desde'")).toBeInTheDocument();
  });
});
