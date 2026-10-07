import {
  getRedirectPath,
  login,
  LOGIN_ERROR_MESSAGE,
  ROLE_ERROR_MESSAGE,
} from './auth.service';

const mockSignInWithPassword = jest.fn();
const mockSignOut = jest.fn();
const mockMaybeSingle = jest.fn();
const mockSupabaseClient = {
  auth: {
    signInWithPassword: mockSignInWithPassword,
    signOut: mockSignOut,
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        maybeSingle: mockMaybeSingle,
      })),
    })),
  })),
};

jest.mock('@/shared/lib/supabase', () => ({
  getSupabaseClient: () => mockSupabaseClient,
}));

describe('auth service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignInWithPassword.mockResolvedValue({
      data: { user: { id: 'user-id' } },
      error: null,
    });
    mockMaybeSingle.mockResolvedValue({
      data: { rol: 'administrador' },
      error: null,
    });
    mockSignOut.mockResolvedValue({ error: null });
  });

  it('autentica y obtiene el rol asociado al UUID de Supabase Auth', async () => {
    await expect(
      login({ email: 'admin@umss.edu.bo', password: 'secret' }),
    ).resolves.toBe('administrador');
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('usuario');
  });

  it.each([
    ['administrador', '/events'],
    ['titulado', '/events/catalog'],
    ['egresado', '/events/catalog'],
  ] as const)('redirige el rol %s a %s', (role, expectedPath) => {
    expect(getRedirectPath(role)).toBe(expectedPath);
  });

  it('usa un mensaje genérico para credenciales inválidas', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null },
      error: new Error('invalid credentials'),
    });

    await expect(
      login({ email: 'admin@umss.edu.bo', password: 'wrong' }),
    ).rejects.toThrow(LOGIN_ERROR_MESSAGE);
  });

  it('cierra la sesión si el usuario no tiene un rol permitido', async () => {
    mockMaybeSingle.mockResolvedValue({
      data: { rol: 'otro' },
      error: null,
    });

    await expect(
      login({ email: 'user@umss.edu.bo', password: 'secret' }),
    ).rejects.toThrow(ROLE_ERROR_MESSAGE);
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
