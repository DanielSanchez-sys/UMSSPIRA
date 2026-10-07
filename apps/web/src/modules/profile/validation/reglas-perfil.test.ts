import { validarCertificacion, validarExperiencia, validarFormacion, validarRespaldo } from './reglas-perfil';

const anioSiguiente = String(new Date().getFullYear() + 1);

describe('validarFormacion', () => {
  it('no devuelve errores con datos válidos', () => {
    expect(
      validarFormacion({ institucion: 'UMSS', titulo: 'Ingeniería de Sistemas', anioEgreso: '2022', grado: 'Licenciatura' }),
    ).toEqual({});
  });

  it('marca los campos obligatorios vacíos', () => {
    expect(validarFormacion({ institucion: '   ', titulo: '', anioEgreso: '', grado: '' })).toEqual({
      institucion: 'La institución es obligatoria.',
      titulo: 'El título es obligatorio.',
      anioEgreso: 'El año de egreso es obligatorio.',
      grado: 'Selecciona un grado.',
    });
  });

  it('rechaza un año de egreso posterior al actual o sin 4 dígitos', () => {
    const base = { institucion: 'UMSS', titulo: 'Sistemas', grado: 'Licenciatura' };
    expect(validarFormacion({ ...base, anioEgreso: anioSiguiente }).anioEgreso).toBe(
      'El año de egreso no puede ser mayor al año actual.',
    );
    expect(validarFormacion({ ...base, anioEgreso: '202' }).anioEgreso).toBe('El año de egreso debe tener 4 dígitos.');
  });

  it('rechaza textos más largos que los de la base de datos', () => {
    const errores = validarFormacion({ institucion: 'a'.repeat(151), titulo: 'x', anioEgreso: '2020', grado: 'Licenciatura' });
    expect(errores.institucion).toBe('La institución no puede superar los 150 caracteres.');
  });
});

describe('validarExperiencia', () => {
  const base = { empresa: 'Jalasoft', cargo: 'Desarrollador', fechaInicio: '2023-08-01', fechaFin: '2024-01-01' };

  it('no devuelve errores con datos válidos', () => {
    expect(validarExperiencia(base, false)).toEqual({});
  });

  it('exige fecha fin solo si no es el trabajo actual', () => {
    expect(validarExperiencia({ ...base, fechaFin: '' }, false).fechaFin).toBeDefined();
    expect(validarExperiencia({ ...base, fechaFin: '' }, true)).toEqual({});
  });

  it('rechaza una fecha fin anterior a la fecha inicio', () => {
    expect(validarExperiencia({ ...base, fechaFin: '2022-03-01' }, false).fechaFin).toBe(
      "La fecha 'Hasta' no puede ser anterior a 'Desde'",
    );
  });

  it('acepta una fecha fin igual a la fecha inicio', () => {
    expect(validarExperiencia({ ...base, fechaFin: base.fechaInicio }, false)).toEqual({});
  });

  it('rechaza una fecha inicio o fin posterior a hoy', () => {
    const futura = `${new Date().getFullYear() + 1}-01-01`;
    expect(validarExperiencia({ ...base, fechaInicio: futura }, true).fechaInicio).toBe(
      'La fecha inicio no puede ser posterior a hoy.',
    );
    expect(validarExperiencia({ ...base, fechaFin: futura }, false).fechaFin).toBe(
      'La fecha fin no puede ser posterior a hoy.',
    );
  });

  describe('a las 22:00 hora local', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      // Constructor con año, mes y día: es hora local, no UTC (en UTC-4 ya sería el 8 de octubre)
      jest.setSystemTime(new Date(2026, 9, 7, 22, 0));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('rechaza la fecha de mañana y acepta la de hoy', () => {
      expect(validarExperiencia({ ...base, fechaFin: '2026-10-08' }, false).fechaFin).toBe(
        'La fecha fin no puede ser posterior a hoy.',
      );
      expect(validarExperiencia({ ...base, fechaFin: '2026-10-07' }, false)).toEqual({});
    });
  });

  it('limita el cargo a 100 caracteres', () => {
    expect(validarExperiencia({ ...base, cargo: 'c'.repeat(101) }, false).cargo).toBe(
      'El cargo no puede superar los 100 caracteres.',
    );
  });
});

describe('validarCertificacion', () => {
  it('marca la entidad emisora y el grado obligatorios', () => {
    expect(validarCertificacion({ nombre: 'AWS', entidadEmisora: '', anioEmision: '2024', grado: '' })).toEqual({
      entidadEmisora: 'La entidad emisora es obligatoria.',
      grado: 'Selecciona un grado.',
    });
  });

  it('rechaza un año sin 4 dígitos', () => {
    expect(
      validarCertificacion({ nombre: 'AWS', entidadEmisora: 'Amazon', anioEmision: '202', grado: 'Asociado' }).anioEmision,
    ).toBe('El año debe tener 4 dígitos.');
  });

  it('rechaza un año posterior al actual', () => {
    expect(
      validarCertificacion({ nombre: 'AWS', entidadEmisora: 'Amazon', anioEmision: anioSiguiente, grado: 'Asociado' })
        .anioEmision,
    ).toBe('El año no puede ser mayor al año actual.');
  });
});

describe('validarRespaldo', () => {
  function archivo(nombre: string, tipo: string, tamanio = 1024) {
    const resultado = new File(['contenido'], nombre, { type: tipo });
    Object.defineProperty(resultado, 'size', { value: tamanio });
    return resultado;
  }

  it('acepta JPG, PNG y PDF', () => {
    expect(validarRespaldo(archivo('foto.jpg', 'image/jpeg'))).toBeUndefined();
    expect(validarRespaldo(archivo('foto.png', 'image/png'))).toBeUndefined();
    expect(validarRespaldo(archivo('certificado.pdf', 'application/pdf'))).toBeUndefined();
  });

  it('rechaza otros formatos', () => {
    expect(validarRespaldo(archivo('foto.gif', 'image/gif'))).toBe('Formato no permitido. Solo JPG, PNG o PDF');
    expect(
      validarRespaldo(
        archivo('cv.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
      ),
    ).toBe('Formato no permitido. Solo JPG, PNG o PDF');
  });

  it('rechaza archivos de más de 5 MB y acepta exactamente 5 MB', () => {
    expect(validarRespaldo(archivo('grande.pdf', 'application/pdf', 5 * 1024 * 1024 + 1))).toBe(
      'El archivo no puede superar 5 MB',
    );
    expect(validarRespaldo(archivo('limite.pdf', 'application/pdf', 5 * 1024 * 1024))).toBeUndefined();
  });
});
