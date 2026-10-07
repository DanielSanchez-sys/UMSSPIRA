import { apiClient } from './api-client';
import { getSupabaseClient } from '@/shared/lib/supabase';

jest.mock('@/shared/lib/supabase', () => ({
  getSupabaseClient: jest.fn(),
}));

const mockGetSession = jest.fn();

describe('apiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(getSupabaseClient).mockReturnValue({
      auth: { getSession: mockGetSession },
    } as unknown as ReturnType<typeof getSupabaseClient>);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ success: true }),
    });
  });

  it('envía el access token de Supabase como bearer al backend', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { access_token: 'verified-session-token' } },
      error: null,
    });

    await apiClient('/api/events', {
      method: 'POST',
      body: { title: 'Evento' },
    });

    const [, request] = jest.mocked(global.fetch).mock.calls[0];
    expect(new Headers(request?.headers).get('Authorization')).toBe(
      'Bearer verified-session-token',
    );
  });

  it('informa si no puede recuperar la sesión autenticada', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: new Error('storage failure'),
    });

    await expect(apiClient('/api/events')).rejects.toThrow(
      'No se pudo recuperar la sesión de Supabase.',
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
