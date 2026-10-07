'use client';

import { createContext, useContext, type ReactNode } from 'react';

const AuthenticatedUserContext = createContext<string | null>(null);

export function AuthenticatedUserProvider({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  return (
    <AuthenticatedUserContext.Provider value={userId}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
}

export function useAuthenticatedUserId(): string | undefined {
  return useContext(AuthenticatedUserContext) ?? undefined;
}
