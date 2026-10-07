import { validarCertificacion, validarExperiencia, validarFormacion } from './reglas-perfil';

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

  it('rechaza un año posterior al actual', () => {
    expect(
      validarCertificacion({ nombre: 'AWS', entidadEmisora: 'Amazon', anioEmision: anioSiguiente, grado: 'Asociado' })
        .anioEmision,
    ).toBe('El año no puede ser mayor al año actual.');
  });
});
