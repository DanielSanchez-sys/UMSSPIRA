import { act, renderHook } from '@testing-library/react';
import { AuthServiceError, login } from '../services/auth.service';
import { useAuth } from './use-auth';

const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('../services/auth.service', () => {
  const actual = jest.requireActual('../services/auth.service');
  return { ...actual, login: jest.fn() };
});

const mockedLogin = jest.mocked(login);

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ['administrador', '/events'],
    ['titulado', '/events/catalog'],
    ['egresado', '/events/catalog'],
  ] as const)('redirige a %s según el rol %s', async (role, path) => {
    mockedLogin.mockResolvedValue(role);
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn({
        email: 'user@umss.edu.bo',
        password: 'secret',
      });
    });

    expect(mockReplace).toHaveBeenCalledWith(path);
    expect(result.current.error).toBeNull();
  });

  it('muestra errores del servicio sin redirigir', async () => {
    mockedLogin.mockRejectedValue(new AuthServiceError('Rol no válido'));
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn({
        email: 'user@umss.edu.bo',
        password: 'secret',
      });
    });

    expect(result.current.error).toBe('Rol no válido');
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
