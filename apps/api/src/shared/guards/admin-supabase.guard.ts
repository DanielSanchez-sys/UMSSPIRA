import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { SupabaseClient, User } from '@supabase/supabase-js';

import { createAuthenticatedSupabaseClient, supabase } from '../lib/supabase';

export interface AuthenticatedAdmin {
  id: string;
  user: User;
  supabase: SupabaseClient;
}

interface AuthenticatedRequest {
  headers: {
    authorization?: string;
  };
  authenticatedAdmin?: AuthenticatedAdmin;
}

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedAdmin => {
    const request =
      context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.authenticatedAdmin) {
      throw new UnauthorizedException('Se requiere una sesión autenticada.');
    }

    return request.authenticatedAdmin;
  },
);

@Injectable()
export class AdminSupabaseGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    const accessToken = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];

    if (!accessToken) {
      throw new UnauthorizedException('Se requiere iniciar sesión.');
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      throw new UnauthorizedException('La sesión no es válida o ha expirado.');
    }

    const authenticatedSupabase =
      createAuthenticatedSupabaseClient(accessToken);
    const { data: profile, error: profileError } = await authenticatedSupabase
      .from('usuario')
      .select('rol')
      .eq('usuario_id', user.id)
      .maybeSingle();

    if (profileError) {
      throw new UnauthorizedException(
        'No se pudo verificar el rol de la cuenta.',
      );
    }

    const role = profile?.rol
      ?.trim()
      .toLocaleLowerCase('es')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (role !== 'administrador' && role !== 'admin') {
      throw new ForbiddenException(
        'Se requiere una cuenta de administrador para gestionar eventos.',
      );
    }

    request.authenticatedAdmin = {
      id: user.id,
      user,
      supabase: authenticatedSupabase,
    };

    return true;
  }
}
