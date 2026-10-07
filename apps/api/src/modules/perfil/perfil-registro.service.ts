import { Injectable } from '@nestjs/common';
import { CrearFormacionAcademicaDto } from './dto/crear-formacion-academica.dto';
import { FormacionAcademicaService } from './formacion-academica.service';
import { PerfilRepository } from './perfil.repository';

// HU1: guardar los registros del formulario de perfil (T1.6 a T1.9)
@Injectable()
export class PerfilRegistroService {
  constructor(
    private readonly repositorio: PerfilRepository,
    private readonly formacionService: FormacionAcademicaService,
  ) {}

  // T1.6: pasa por FormacionAcademicaService para que responda 409 si es duplicada (T2.5)
  crearFormacion(tituladoId: string, datos: CrearFormacionAcademicaDto) {
    return this.formacionService.crear(tituladoId, datos);
  }

}