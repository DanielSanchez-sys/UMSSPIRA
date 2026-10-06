
import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { esSeccion } from './perfil.constants';
import { PerfilRepository } from './perfil.repository';
import { obtenerTituladoId } from './titulado-actual';

@Controller('perfil')
export class PerfilRegistrosController {
  constructor(private readonly perfilRepository: PerfilRepository) {}

  @Get(':seccion/:id')
  async obtenerRegistro(
    @Param('seccion') seccionParam: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    if (!esSeccion(seccionParam)) {
      throw new NotFoundException('La sección solicitada no existe');
    }

    const registro = await this.perfilRepository.obtenerPorId(
      seccionParam,
      id,
    );

    if (!registro) {
      throw new NotFoundException('El registro no existe');
    }

    const tituladoId = await obtenerTituladoId(req);

    if (registro.idTitulado !== tituladoId) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a este registro',
      );
    }

    return registro;
  }
}