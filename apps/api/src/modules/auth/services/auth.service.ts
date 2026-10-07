// apps/api/src/modules/auth/services/auth.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { AuthRepository } from '../repositories/auth.repository';
import { UnauthorizedError } from '@/shared/errors';
import type { LoginInput, LoginResponse, UserRole } from '@umsspira/shared-types';

const ALLOWED_ROLES: UserRole[] = ['administrador', 'titulado'];

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly repo: AuthRepository) {}

  async login(input: LoginInput): Promise<LoginResponse> {
    const { data, error } = await this.repo.signInWithPassword(input.email, input.password);

    if (error || !data.session || !data.user) {
      // Solo en el log del servidor: al cliente siempre le llega el mensaje genérico
      this.logger.warn(
        `Login rechazado por Supabase: ${error?.code ?? error?.message ?? 'sin sesión'}`,
      );
      throw new UnauthorizedError();
    }

    const role = data.user.app_metadata?.role as UserRole | undefined;
    if (!role || !ALLOWED_ROLES.includes(role)) {
      this.logger.warn(`Login rechazado: rol inválido o ausente (${role ?? 'sin rol'})`);
      throw new UnauthorizedError();
    }

    return { accessToken: data.session.access_token, role };
  }
}