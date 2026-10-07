import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CrearFormacionAcademicaDto } from './dto/crear-formacion-academica.dto';
import { PerfilRegistroService } from './perfil-registro.service';
import { obtenerTituladoId } from './titulado-actual';

// HU1: endpoints de guardado del formulario de perfil (T1.6 a T1.9)
@Controller('perfil')
export class PerfilRegistroController {
  constructor(private readonly servicio: PerfilRegistroService) {}

  // T1.6: POST /api/v1/perfil/formacion-academica
  @Post('formacion-academica')
  @HttpCode(201)
  async crearFormacion(@Req() req: Request, @Body() datos: CrearFormacionAcademicaDto) {
    const tituladoId = await obtenerTituladoId(req);
    return this.servicio.crearFormacion(tituladoId, datos);
  }

}