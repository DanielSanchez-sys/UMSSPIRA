import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { PostgrestError } from '@supabase/supabase-js';
// Cliente compartido del equipo (única línea a ajustar si exporta otro nombre).
import { supabase } from '../../shared/lib/supabase';
import { UpdateMentorAreasDto } from './dto/update-mentor-areas.dto';
import { UpdateParticipationDto } from './dto/update-participation.dto';
import { Mentor } from './mentor.model';

const PG_UNIQUE_VIOLATION = '23505';
const MIN_MENTOR_AREAS = 1;
const MAX_MENTOR_AREAS = 5;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface Area {
  id: string;
  nombre: string;
  esta_activo: boolean;
}

interface MentorAreaLink {
  id: string;
  id_area: string;
}

export interface MentorAreasState {
  areas: Array<{ id: string; name: string }>;
  selectedAreaIds: string[];
  selectedAreas: Array<{ id: string; name: string; isActive: boolean }>;
}

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

  async getMyAreas(userId: string): Promise<MentorAreasState> {
    const [{ data: areaRows, error: areasError }, { data: mentorAreaRows, error: mentorAreasError }] =
      await Promise.all([
        supabase
          .from('area')
          .select('id, nombre, descripcion')
          .eq('esta_activo', true)
          .order('nombre', { ascending: true }),
        supabase
          .from('mentor_area')
          .select('id_area')
          .eq('id_mentor', userId),
      ]);
    if (areasError) this.fail(areasError);
    if (mentorAreasError) this.fail(mentorAreasError);

    const areas = new Map<string, MentorArea>();
    const seenAreaNames = new Set<string>();
    for (const row of areaRows ?? []) {
      const key = String(row.nombre).trim().toLocaleLowerCase('es');
      if (key && !seenAreaNames.has(key)) {
        const area = { id: row.id as string, nombre: row.nombre as string, descripcion: row.descripcion as string | null };
        areas.set(area.id, area);
        seenAreaNames.add(key);
      }
    }

    const selectedIds = [...new Set((mentorAreaRows ?? [])
      .map(row => row.id_area as string)
      .filter(id => areas.has(id)))];
    return { areas: [...areas.values()], selectedIds };
  }

  async updateMyAreas(userId: string, body: unknown): Promise<MentorAreasState> {
    if (!body || typeof body !== 'object' || !('areaIds' in body) || !Array.isArray(body.areaIds)) {
      throw new BadRequestException('Debes enviar una lista de áreas.');
    }
    const areaIds: unknown[] = body.areaIds;
    if (areaIds.length > MAX_MENTOR_AREAS) {
      throw new BadRequestException(`Puedes seleccionar hasta ${MAX_MENTOR_AREAS} áreas.`);
    }
    if (areaIds.some(id => typeof id !== 'string' || !UUID_V4.test(id))
      || new Set(areaIds).size !== areaIds.length) {
      throw new BadRequestException('La lista de áreas contiene identificadores inválidos o duplicados.');
    }

    if (areaIds.length > 0) {
      const { count, error } = await supabase
        .from('area')
        .select('id', { count: 'exact', head: true })
        .in('id', areaIds as string[])
        .eq('esta_activo', true);
      if (error) this.fail(error);
      if (count !== areaIds.length) {
        throw new BadRequestException('Solo puedes elegir áreas activas del catálogo.');
      }
    }

    const today = this.today();
    const { error: mentorError } = await supabase
      .from('mentor')
      .upsert({
        id: userId,
        esta_activo: false,
        fecha_creacion: today,
        fecha_actualizacion: today,
      }, { onConflict: 'id', ignoreDuplicates: true });
    if (mentorError) this.fail(mentorError);

    if (areaIds.length > 0) {
      const { error: saveError } = await supabase
        .from('mentor_area')
        .upsert(
          (areaIds as string[]).map(id => ({ id_mentor: userId, id_area: id, fecha_creacion: today })),
          { onConflict: 'id_mentor,id_area', ignoreDuplicates: true },
        );
      if (saveError) this.fail(saveError);

      const { error: removeError } = await supabase
        .from('mentor_area')
        .delete()
        .eq('id_mentor', userId)
        .not('id_area', 'in', `(${(areaIds as string[]).join(',')})`);
      if (removeError) this.fail(removeError);
    } else {
      const { error: removeError } = await supabase
        .from('mentor_area')
        .delete()
        .eq('id_mentor', userId);
      if (removeError) this.fail(removeError);
    }
    return this.getMyAreas(userId);
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

  /** GET /mentorship/my-profile/areas */
  async getMyAreas(userId: string): Promise<MentorAreasState> {
    await this.ensureActiveMentor(userId);

    const [{ data: catalog, error: catalogError }, { data: links, error: linksError }] =
      await Promise.all([
        supabase
          .from('area')
          .select('id, nombre, esta_activo')
          .eq('esta_activo', true)
          .order('nombre', { ascending: true }),
        supabase.from('mentor_area').select('id, id_area').eq('id_mentor', userId),
      ]);

    if (catalogError) this.fail(catalogError);
    if (linksError) this.fail(linksError);

    const selectedAreaIds = [
      ...new Set(((links ?? []) as MentorAreaLink[]).map(({ id_area }) => id_area)),
    ];
    const { data: selectedAreas, error: selectedAreasError } = selectedAreaIds.length
      ? await supabase
          .from('area')
          .select('id, nombre, esta_activo')
          .in('id', selectedAreaIds)
      : { data: [], error: null };

    if (selectedAreasError) this.fail(selectedAreasError);

    return {
      areas: ((catalog ?? []) as Area[]).map(({ id, nombre }) => ({ id, name: nombre })),
      selectedAreaIds,
      selectedAreas: ((selectedAreas ?? []) as Area[]).map(
        ({ id, nombre, esta_activo }) => ({
          id,
          name: nombre,
          isActive: esta_activo,
        }),
      ),
    };
  }

  /** PATCH /mentorship/my-profile/areas */
  async updateMyAreas(
    userId: string,
    dto: UpdateMentorAreasDto,
  ): Promise<MentorAreasState> {
    await this.ensureActiveMentor(userId);
    if (!(await this.isApprovedGraduate(userId))) {
      throw new ForbiddenException({
        code: 'MENTOR_NOT_ELIGIBLE',
        message: 'Solo un egresado aprobado puede modificar sus áreas técnicas',
      });
    }

    const requestedIds = dto?.areaIds;
    if (
      !Array.isArray(requestedIds) ||
      requestedIds.length < MIN_MENTOR_AREAS ||
      requestedIds.length > MAX_MENTOR_AREAS
    ) {
      throw new UnprocessableEntityException({
        code: 'CANTIDAD_AREAS_INVALIDA',
        message: `Debes seleccionar entre ${MIN_MENTOR_AREAS} y ${MAX_MENTOR_AREAS} áreas técnicas`,
      });
    }

    if (requestedIds.some((id) => typeof id !== 'string' || !UUID_PATTERN.test(id))) {
      throw new UnprocessableEntityException({
        code: 'AREA_NO_EXISTE',
        message: 'Las áreas deben seleccionarse usando IDs existentes del catálogo',
      });
    }

    const areaIds = [...new Set(requestedIds)];
    const { data: areas, error: areasError } = await supabase
      .from('area')
      .select('id, nombre, esta_activo')
      .in('id', areaIds);
    if (areasError) this.fail(areasError);

    const areasById = new Map(((areas ?? []) as Area[]).map((area) => [area.id, area]));
    const missingAreaId = areaIds.find((areaId) => !areasById.has(areaId));
    if (missingAreaId) {
      throw new UnprocessableEntityException({
        code: 'AREA_NO_EXISTE',
        message: 'Una o más áreas no existen en el catálogo',
      });
    }

    if (areaIds.some((areaId) => !areasById.get(areaId)?.esta_activo)) {
      throw new UnprocessableEntityException({
        code: 'AREA_INACTIVA',
        message: 'No se pueden asignar áreas inactivas',
      });
    }

    const { data: links, error: linksError } = await supabase
      .from('mentor_area')
      .select('id, id_area')
      .eq('id_mentor', userId);
    if (linksError) this.fail(linksError);

    const existingLinks = (links ?? []) as MentorAreaLink[];
    const requestedIdSet = new Set(areaIds);
    const retainedAreaIds = new Set<string>();
    const linksToRemove: string[] = [];
    for (const link of existingLinks) {
      if (requestedIdSet.has(link.id_area) && !retainedAreaIds.has(link.id_area)) {
        retainedAreaIds.add(link.id_area);
      } else {
        linksToRemove.push(link.id);
      }
    }

    const linksToAdd = areaIds.filter((areaId) => !retainedAreaIds.has(areaId));
    const { data: insertedLinks, error: insertError } = linksToAdd.length
      ? await supabase
          .from('mentor_area')
          .insert(
            linksToAdd.map((id_area) => ({
              id_mentor: userId,
              id_area,
              fecha_creacion: this.today(),
            })),
          )
          .select('id')
      : { data: [], error: null };
    if (insertError) this.fail(insertError);

    if (linksToRemove.length) {
      const { error: deleteError } = await supabase
        .from('mentor_area')
        .delete()
        .in('id', linksToRemove);
      if (deleteError) {
        const insertedIds = (insertedLinks ?? []).map(({ id }: { id: string }) => id);
        if (insertedIds.length) {
          const { error: rollbackError } = await supabase
            .from('mentor_area')
            .delete()
            .in('id', insertedIds);
          if (rollbackError) {
            throw new InternalServerErrorException(
              `No se pudieron completar ni revertir los vínculos de áreas: ${rollbackError.message}`,
            );
          }
        }
        this.fail(deleteError);
      }
    }

    return this.getMyAreas(userId);
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

  private async ensureActiveMentor(userId: string): Promise<void> {
    const { data, error } = await supabase
      .from('mentor')
      .select('id, esta_activo')
      .eq('id', userId)
      .maybeSingle();
    if (error) this.fail(error);
    if (!data || data.esta_activo !== true) {
      throw new ForbiddenException({
        code: 'MENTOR_PROFILE_INACTIVE',
        message: 'Se requiere un perfil de mentor activo para consultar o modificar sus áreas',
      });
    }
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
