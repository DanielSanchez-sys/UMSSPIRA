'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AuthServiceError,
  getCurrentUserIdentity,
  getRedirectPath,
  type UserRole,
} from '../services/auth.service';
import { AuthenticatedUserProvider } from './authenticated-user-context';

type AccessState = 'checking' | 'allowed' | 'error';
type UserIdentity = { userId: string; role: UserRole };

export function EventsAccessGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [accessState, setAccessState] = useState<AccessState>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [identity, setIdentity] = useState<UserIdentity | null>(null);

  useEffect(() => {
    let isMounted = true;
    setAccessState('checking');
    setErrorMessage(null);

    async function checkAccess() {
      try {
        const currentIdentity = await getCurrentUserIdentity();

        if (!isMounted) {
          return;
        }

        if (!currentIdentity) {
          router.replace('/login');
          return;
        }
        setIdentity(currentIdentity);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof AuthServiceError
              ? error.message
              : 'No se pudo verificar el acceso. Intenta nuevamente.',
          );
          setAccessState('error');
        }
      }
    }

    void checkAccess();
    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!identity) return;

    const isCatalogPath =
      pathname === '/events/catalog'
      || pathname.startsWith('/events/catalog/');
    const hasAccess = identity.role === 'administrador'
      ? !isCatalogPath
      : isCatalogPath;

    if (!hasAccess) {
      setAccessState('checking');
      router.replace(getRedirectPath(identity.role));
      return;
    }

    setAccessState('allowed');
  }, [identity, pathname, router]);

  if (accessState === 'allowed') {
    return identity ? (
      <AuthenticatedUserProvider userId={identity.userId}>
        {children}
      </AuthenticatedUserProvider>
    ) : null;
  }

  if (accessState === 'error') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#EEE9DF] p-6 text-[#2C3B4D]">
        <section className="max-w-md space-y-4 rounded-xl bg-white p-8 text-center shadow">
          <h1 className="text-xl font-semibold">No se pudo validar tu acceso</h1>
          <p role="alert" className="text-sm text-[#A35139]">
            {errorMessage}
          </p>
          <Link
            href="/login"
            className="inline-flex rounded-lg bg-[#FFB162] px-5 py-3 text-sm font-semibold"
          >
            Volver al inicio de sesión
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-[#EEE9DF] text-sm text-[#2C3B4D]"
      role="status"
    >
      Verificando tu acceso...
    </main>
  );
}
