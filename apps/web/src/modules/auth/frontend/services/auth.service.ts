import { getSupabaseClient } from '@/shared/lib/supabase';

export type UserRole = 'administrador' | 'titulado' | 'egresado';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const LOGIN_ERROR_MESSAGE =
  'Correo electrónico o contraseña incorrectos';
export const ROLE_ERROR_MESSAGE =
  'No pudimos verificar el rol de esta cuenta. Contacta al administrador.';

export class AuthServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthServiceError';
  }
}

function getAuthClient() {
  try {
    return getSupabaseClient();
  } catch {
    throw new AuthServiceError(
      'La configuración pública de Supabase está incompleta. Contacta al administrador.',
    );
  }
}

function parseRole(role: string | null): UserRole | null {
  const normalizedRole = role
    ?.trim()
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (normalizedRole === 'administrador' || normalizedRole === 'admin') {
    return 'administrador';
  }

  if (normalizedRole === 'titulado') {
    return 'titulado';
  }

  if (normalizedRole === 'egresado') {
    return 'egresado';
  }

  return null;
}

async function getRoleForUser(userId: string): Promise<UserRole> {
  const { data, error } = await getSupabaseClient()
    .from('usuario')
    .select('rol')
    .eq('usuario_id', userId)
    .maybeSingle();

  if (error || !data) {
    throw new AuthServiceError(ROLE_ERROR_MESSAGE);
  }

  const role = parseRole(data.rol);

  if (!role) {
    throw new AuthServiceError(ROLE_ERROR_MESSAGE);
  }

  return role;
}

export async function getCurrentUserIdentity(): Promise<{
  userId: string;
  role: UserRole;
} | null> {
  const { data, error } = await getAuthClient().auth.getUser();

  if (error) {
    throw new AuthServiceError(
      'No se pudo verificar la sesión. Intenta nuevamente.',
    );
  }

  if (!data.user) {
    return null;
  }

  return {
    userId: data.user.id,
    role: await getRoleForUser(data.user.id),
  };
}

export async function login(
  credentials: LoginCredentials,
): Promise<UserRole> {
  const supabase = getAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email.trim(),
    password: credentials.password,
  });

  if (error || !data.user) {
    throw new AuthServiceError(LOGIN_ERROR_MESSAGE);
  }

  try {
    return await getRoleForUser(data.user.id);
  } catch (roleError) {
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      throw new AuthServiceError(
        'No se pudo validar el rol ni cerrar la sesión. Intenta nuevamente.',
      );
    }

    throw roleError;
  }
}

export function getRedirectPath(role: UserRole): string {
  return role === 'administrador' ? '/events' : '/events/catalog';
}
