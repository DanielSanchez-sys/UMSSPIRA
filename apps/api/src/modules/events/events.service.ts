import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { supabase } from '../../shared/lib/supabase';
import { CreateEventDto } from './dto/create-event.dto';
import { EventItem, EventStatus, EVENT_STATUS } from '@umsspira/shared-types';

@Injectable()
export class EventsService {

  async createEvent(createEventDto: CreateEventDto, userId: string): Promise<EventItem> {
    const { title, description, startDate, endDate, maxCapacity, location, status } = createEventDto;

    // 1. Validaciones de negocio adicionales
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      throw new BadRequestException('La fecha de finalización debe ser posterior a la fecha de inicio');
    }

    if (maxCapacity <= 0) {
      throw new BadRequestException('El cupo máximo debe ser mayor a 0');
    }

    const initialStatus: EventStatus = status || EVENT_STATUS.BORRADOR;

    // 2. Insertar en la tabla "evento" usando los nombres exactos de la BD
    const { data, error } = await supabase
      .from('evento')
      .insert([
        {
          id_usuario: userId,
          titulo: title,
          descripcion: description || null,
          fecha_inicio: startDate,
          fecha_fin: endDate,
          cupo_maximo: maxCapacity,
          ubicacion: location || null,
          estado: initialStatus,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(`Error al guardar el evento: ${error.message}`);
    }

    // 3. Mapear los datos retornados por la BD hacia la estructura EventItem
    return {
      id: data.id,
      title: data.titulo,
      description: data.descripcion ?? null,
      startDate: data.fecha_inicio,
      endDate: data.fecha_fin,
      maxCapacity: data.cupo_maximo,
      location: data.ubicacion ?? null,
      status: data.estado as EventStatus,
      createdBy: data.id_usuario,
      createdAt: data.fecha_creacion,
    };
  }

    /**T7
   * Catálogo para el egresado (HU2).
   * Devuelve solo eventos PUBLICADOS que no han finalizado,
   * ordenados por fecha de inicio ascendente.
   */
    async getCatalog(): Promise<EventItem[]> {
      const now = new Date().toISOString();
  
      const { data, error } = await supabase
        .from('evento')
        .select('*')
        .eq('estado', EVENT_STATUS.PUBLICADO) // excluye BORRADOR y CANCELADO
        .gt('fecha_fin', now) // excluye eventos ya finalizados
        .order('fecha_inicio', { ascending: true });
  
      if (error) {
        throw new InternalServerErrorException(
          `Error al consultar el catálogo de eventos: ${error.message}`,
        );
      }
  
      return (data ?? []).map((row) => this.mapCatalogRow(row));
    }
  
    // Convierte una fila de la tabla "evento" a la estructura EventItem
    private mapCatalogRow(row: any): EventItem {
      return {
        id: row.id,
        title: row.titulo,
        description: row.descripcion ?? null,
        startDate: row.fecha_inicio,
        endDate: row.fecha_fin,
        maxCapacity: row.cupo_maximo,
        location: row.ubicacion ?? null,
        status: row.estado as EventStatus,
        createdBy: row.id_usuario,
        createdAt: row.fecha_creacion,
      };
    }

}