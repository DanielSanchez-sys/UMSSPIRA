'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AuthServiceError,
  getRedirectPath,
  login,
  type LoginCredentials,
} from '../services/auth.service';

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn(credentials: LoginCredentials): Promise<void> {
    setIsLoading(true);
    setError(null);

    try {
      const role = await login(credentials);
      router.replace(getRedirectPath(role));
    } catch (loginError) {
      setError(
        loginError instanceof AuthServiceError
          ? loginError.message
          : 'No se pudo completar el inicio de sesión. Verifica tu conexión e intenta nuevamente.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, error, signIn };
}
