import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';

import { ProfileStoreProvider } from '@/modules/profile/state/profile-store';
import { AcordeonPerfil } from './acordeon-perfil';
import { SeccionAcordeon } from './seccion-acordeon';

const push = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

describe('SeccionAcordeon · contador de errores', () => {
  it('muestra el contador solo si hay errores', () => {
    const { rerender } = render(<SeccionAcordeon numero={1} titulo="Formación académica" descripcion="" cantidad={0} />);
    expect(screen.queryByText(/error/)).not.toBeInTheDocument();

    rerender(<SeccionAcordeon numero={1} titulo="Formación académica" descripcion="" cantidad={0} errores={3} />);
    expect(screen.getByText('3 errores')).toBeInTheDocument();
  });
});

describe('AcordeonPerfil · errores sin corregir', () => {
  beforeEach(() => push.mockClear());

  function renderAcordeon() {
    render(
      <ProfileStoreProvider>
        <AcordeonPerfil />
      </ProfileStoreProvider>,
    );
  }

  it('cuenta los errores de la sección y bloquea el guardado del perfil', () => {
    renderAcordeon();
    const cabecera = screen.getByRole('button', { name: /formación académica/i });
    const formacion = cabecera.closest('section') as HTMLElement;
    fireEvent.click(cabecera);

    fireEvent.click(within(formacion).getByRole('button', { name: /agregar formación/i }));

    expect(within(formacion).getByText('4 errores')).toBeInTheDocument();
    expect(screen.getByText('1 sección con errores')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Guardar perfil profesional' }));

    expect(screen.getByText('No se pudo guardar tu perfil')).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
