import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import {
  EVENT_STATUS,
  type EventItem,
  type EventStatus,
} from '@umsspira/shared-types';

import { supabase } from '../../shared/lib/supabase';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  /**
   * T4
   * Crea un nuevo evento.
   */
  async createEvent(
    createEventDto: CreateEventDto,
    userId: string,
  ): Promise<EventItem> {
    const {
      title,
      description,
      startDate,
      endDate,
      maxCapacity,
      location,
      status,
    } = createEventDto;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // La fecha de finalización debe ser posterior al inicio.
    if (end <= start) {
      throw new BadRequestException(
        'La fecha de finalización debe ser posterior a la fecha de inicio',
      );
    }

    // El cupo debe ser mayor a cero.
    if (maxCapacity <= 0) {
      throw new BadRequestException(
        'El cupo máximo debe ser mayor a 0',
      );
    }

    // Si no se envía un estado, se crea como BORRADOR.
    const initialStatus: EventStatus =
      status ?? EVENT_STATUS.BORRADOR;

    /*
     * En shared-types manejamos:
     * BORRADOR | PUBLICADO | CANCELADO
     *
     * En la base de datos se almacena:
     * borrador | publicado | cancelado
     */
    const databaseStatus = initialStatus.toLowerCase();
    const createdAt = new Date().toISOString();

    const { data, error } = await supabase
      .from('evento')
      .insert([
        {
          id_usuario: userId,
          titulo: title,
          descripcion: description ?? null,
          fecha_inicio: startDate,
          fecha_fin: endDate,
          cupo_maximo: maxCapacity,
          ubicacion: location ?? null,
          estado: databaseStatus,
          fecha_creacion: createdAt,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(
        `Error al guardar el evento: ${error.message}`,
      );
    }

    return {
      id: data.id,
      title: data.titulo,
      description: data.descripcion ?? null,
      startDate: data.fecha_inicio,
      endDate: data.fecha_fin,
      maxCapacity: data.cupo_maximo,
      location: data.ubicacion ?? null,
      status: data.estado.toUpperCase() as EventStatus,
      createdBy: data.id_usuario,
      createdAt: data.fecha_creacion,
    };
  }

  /**
   * T7
   * Catálogo para el egresado.
   *
   * Devuelve únicamente eventos PUBLICADOS
   * que todavía no han finalizado.
   *
   * Los eventos se ordenan por fecha de inicio
   * de manera ascendente.
   */
  async getCatalog(): Promise<EventItem[]> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('evento')
      .select('*')
      .eq(
        'estado',
        EVENT_STATUS.PUBLICADO.toLowerCase(),
      )
      .gt('fecha_fin', now)
      .order('fecha_inicio', {
        ascending: true,
      });

    if (error) {
      throw new InternalServerErrorException(
        `Error al consultar el catálogo de eventos: ${error.message}`,
      );
    }

    return (data ?? []).map((row) =>
      this.mapCatalogRow(row),
    );
  }

  /**
   * Convierte una fila de la tabla "evento"
   * al modelo EventItem utilizado por la API.
   */
  private mapCatalogRow(row: any): EventItem {
    return {
      id: row.id,
      title: row.titulo,
      description: row.descripcion ?? null,
      startDate: row.fecha_inicio,
      endDate: row.fecha_fin,
      maxCapacity: row.cupo_maximo,
      location: row.ubicacion ?? null,
      status: row.estado.toUpperCase() as EventStatus,
      createdBy: row.id_usuario,
      createdAt: row.fecha_creacion,
    };
  }
}
