import { ConflictException } from '@nestjs/common';
import { FormacionAcademicaService } from './formacion-academica.service';
import { PerfilRegistroService } from './perfil-registro.service';
import { PerfilRepository } from './perfil.repository';

describe('PerfilRegistroService', () => {
  let repositorio: jest.Mocked<PerfilRepository>;
  let formacionService: jest.Mocked<FormacionAcademicaService>;
  let servicio: PerfilRegistroService;

  beforeEach(() => {
    repositorio = { insertar: jest.fn() } as unknown as jest.Mocked<PerfilRepository>;
    formacionService = { crear: jest.fn() } as unknown as jest.Mocked<FormacionAcademicaService>;
    servicio = new PerfilRegistroService(repositorio, formacionService);
  });

  // T1.6
  it('guarda la formación académica a través del servicio que revisa duplicados', async () => {
    const datos = { institucion: 'UMSS', titulo: 'Ing. de Sistemas', grado: 'Licenciatura', anioEgreso: 2024 };
    formacionService.crear.mockResolvedValue({ id: 'f1', ...datos });

    await expect(servicio.crearFormacion('t1', datos)).resolves.toEqual({ id: 'f1', ...datos });
    expect(formacionService.crear).toHaveBeenCalledWith('t1', datos);
  });

  it('deja pasar el 409 cuando la formación está duplicada', async () => {
    formacionService.crear.mockRejectedValue(new ConflictException());

    await expect(
      servicio.crearFormacion('t1', { institucion: 'UMSS', titulo: 'Ing.', grado: 'Licenciatura', anioEgreso: 2024 }),
    ).rejects.toBeInstanceOf(ConflictException);
  });


});

