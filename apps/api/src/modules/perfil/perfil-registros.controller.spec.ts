import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';

import { PerfilRegistrosController } from './perfil-registros.controller';
import { PerfilRepository } from './perfil.repository';
import { Registro } from './perfil.mappers';

describe('PerfilRegistrosController', () => {
  const TITULADO_ID = 'titulado-1';

  let controller: PerfilRegistrosController;
  let repository: jest.Mocked<
    Pick<PerfilRepository, 'obtenerPorId'>
  >;

  beforeEach(() => {
    process.env.TITULADO_ID_PRUEBA = TITULADO_ID;

    repository = {
      obtenerPorId: jest.fn(),
    };

    controller = new PerfilRegistrosController(
      repository as unknown as PerfilRepository,
    );
  });

  afterEach(() => {
    delete process.env.TITULADO_ID_PRUEBA;
    jest.clearAllMocks();
  });

  it('devuelve el registro cuando existe y pertenece al titulado actual', async () => {
    const registro: Registro = {
      id: 'certificacion-1',
      idTitulado: TITULADO_ID,
      fechaCreacion: '2026-10-01',
      nombre: 'AWS Cloud Practitioner',
      entidadEmisora: 'Amazon Web Services',
      grado: 'Profesional',
      anioEmision: 2024,
    };

    repository.obtenerPorId.mockResolvedValue(registro);

    const resultado = await controller.obtenerRegistro(
      'certificaciones',
      'certificacion-1',
      {} as Request,
    );

    expect(repository.obtenerPorId).toHaveBeenCalledWith(
      'certificaciones',
      'certificacion-1',
    );

    expect(resultado).toEqual(registro);
  });

  it('responde 404 cuando la sección no existe', async () => {
    await expect(
      controller.obtenerRegistro(
        'seccion-invalida',
        'registro-1',
        {} as Request,
      ),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(repository.obtenerPorId).not.toHaveBeenCalled();
  });

  it('responde 404 cuando el registro no existe', async () => {
    repository.obtenerPorId.mockResolvedValue(null);

    await expect(
      controller.obtenerRegistro(
        'certificaciones',
        'registro-inexistente',
        {} as Request,
      ),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(repository.obtenerPorId).toHaveBeenCalledWith(
      'certificaciones',
      'registro-inexistente',
    );
  });

  it('responde 403 cuando el registro pertenece a otro titulado', async () => {
    const registroAjeno: Registro = {
      id: 'certificacion-2',
      idTitulado: 'otro-titulado',
      fechaCreacion: '2026-10-01',
      nombre: 'Scrum Master',
      entidadEmisora: 'Entidad externa',
      grado: 'Profesional',
      anioEmision: 2025,
    };

    repository.obtenerPorId.mockResolvedValue(registroAjeno);

    await expect(
      controller.obtenerRegistro(
        'certificaciones',
        'certificacion-2',
        {} as Request,
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});