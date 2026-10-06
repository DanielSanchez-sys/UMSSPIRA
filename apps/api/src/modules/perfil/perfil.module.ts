import { Module } from '@nestjs/common';
import { FORMACION_REPOSITORIO, FormacionAcademicaService } from './formacion-academica.service';
import { PerfilExportarController } from './perfil-exportar.controller';
import { PerfilRegistroController } from './perfil-registro.controller';
import { PerfilRegistrosController } from './perfil-registros.controller';
import { PerfilResumenController } from './perfil-resumen.controller';
import { PerfilRepository } from './perfil.repository';

@Module({
  controllers: [
    PerfilRegistroController,
    PerfilResumenController,
    PerfilRegistrosController,
    PerfilExportarController,
  ],
  providers: [
    PerfilRepository,
    { provide: FORMACION_REPOSITORIO, useExisting: PerfilRepository },
    FormacionAcademicaService,
  ],
  exports: [PerfilRepository, FormacionAcademicaService],
})
export class PerfilModule {}