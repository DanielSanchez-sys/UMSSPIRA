import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import type { PostgrestError } from '@supabase/supabase-js';
// Cliente compartido del equipo (única línea a ajustar si exporta otro nombre).
import { supabase } from '../../shared/lib/supabase';
import { UpdateParticipationDto } from './dto/update-participation.dto';
import { Mentor } from './mentor.model';

const PG_UNIQUE_VIOLATION = '23505';

export interface ModuleStatus {
  module: string;
  status: 'ok';
  activeMentors: number;
  timestamp: string;
}

@Injectable()
export class MentorshipService {
  /** GET /mentorship/status */
  async getStatus(): Promise<ModuleStatus> {
    const { count, error } = await supabase
      .from('mentor')
      .select('id', { count: 'exact', head: true })
      .eq('esta_activo', true);
    if (error) this.fail(error);

    return {
      module: 'mentorship',
      status: 'ok',
      activeMentors: count ?? 0,
      timestamp: new Date().toISOString(),
    };
  }

  /** GET /mentorship/profiles */
  async getActiveProfiles(): Promise<Mentor[]> {
    const { data, error } = await supabase
      .from('mentor')
      .select('*')
      .eq('esta_activo', true)
      .order('fecha_creacion', { ascending: false });
    if (error) this.fail(error);
    return (data ?? []) as Mentor[];
  }

  /** GET /mentorship/mi-perfil */
  async getMyProfile(userId: string): Promise<Mentor> {
    const profile = await this.findById(userId);
    if (!profile) {
      throw new NotFoundException('El usuario no tiene perfil de mentor');
    }
    return profile;
  }

  /**
   * Regla 6.1.1: ¿es egresado aprobado?
   * Supuesto: la tabla `egresado` solo contiene egresados aprobados y su `id`
   * es el UUID del usuario. Consulta de SOLO LECTURA.
   */
  async isApprovedGraduate(userId: string): Promise<boolean> {
    const { count, error } = await supabase
      .from('egresado')
      .select('id', { count: 'exact', head: true })
      .eq('id', userId);
    if (error) this.fail(error);
    return (count ?? 0) > 0;
  }

  /** POST /mentorship/eligibility */
  async checkEligibility(userId: string): Promise<{ eligible: boolean }> {
    return { eligible: await this.isApprovedGraduate(userId) };
  }

  /** PATCH /mentorship/mi-perfil/participacion (core HU-6.1) */
  async setParticipation(userId: string, dto: UpdateParticipationDto): Promise<Mentor> {
    const existing = await this.findById(userId);
    const today = this.today();

    if (!dto.esta_activo) {
      // 6.1.4: solo cambia estado y fecha, nunca borra.
      if (!existing) {
        throw new NotFoundException('El usuario no tiene perfil de mentor');
      }
      return this.update(userId, { esta_activo: false, fecha_actualizacion: today });
    }

    // 6.1.1: solo egresados aprobados pueden activar.
    if (!(await this.isApprovedGraduate(userId))) {
      throw new ForbiddenException(
        'Solo los egresados aprobados pueden activar su participación como mentores',
      );
    }

    // 6.1.2: activar NO implica aprobación administrativa; solo esta_activo = true.
    if (existing) {
      const changes: Partial<Mentor> = { esta_activo: true, fecha_actualizacion: today };
      if (dto.experiencia !== undefined) changes.experiencia = dto.experiencia;
      if (dto.anios_exp !== undefined) changes.anios_exp = dto.anios_exp;
      return this.update(userId, changes);
    }

    // 6.1.3: PK = UUID del usuario => un solo registro por usuario.
    const { data, error } = await supabase
      .from('mentor')
      .insert({
        id: userId,
        esta_activo: true,
        experiencia: dto.experiencia ?? null,
        anios_exp: dto.anios_exp ?? null,
        fecha_creacion: today,
        fecha_actualizacion: today,
      })
      .select('*')
      .single();

    if (error) {
      // Concurrencia: dos requests creando el mismo registro a la vez.
      if (error.code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException('El usuario ya tiene un registro de mentor');
      }
      this.fail(error);
    }
    return data as Mentor;
  }

  /** PATCH /mentorship/deactivate/:userId */
  async deactivateByAdmin(userId: string): Promise<Mentor> {
    if (!(await this.findById(userId))) {
      throw new NotFoundException('Mentor no encontrado');
    }
    return this.update(userId, { esta_activo: false, fecha_actualizacion: this.today() });
  }

  /** POST /mentorship/profiles/reset (solo desarrollo, NO borra) */
  async resetMyProfile(userId: string): Promise<Mentor> {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Endpoint deshabilitado en producción');
    }
    return this.deactivateByAdmin(userId);
  }

  // ---------- helpers privados ----------

  private async findById(userId: string): Promise<Mentor | null> {
    const { data, error } = await supabase
      .from('mentor')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) this.fail(error);
    return (data as Mentor | null) ?? null;
  }

  private async update(userId: string, changes: Partial<Mentor>): Promise<Mentor> {
    const { data, error } = await supabase
      .from('mentor')
      .update(changes)
      .eq('id', userId)
      .select('*')
      .single();
    if (error) this.fail(error);
    return data as Mentor;
  }

  private fail(error: PostgrestError): never {
    throw new InternalServerErrorException(error.message);
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
