// Reglas de validación del perfil: las mismas que aplican los DTOs del backend (apps/api/src/modules/perfil/dto)
// para que el egresado vea el error junto al campo antes de enviar.

export type ErroresFormulario<Campo extends string> = Partial<Record<Campo, string>>;

export type DatosFormacion = { institucion: string; titulo: string; anioEgreso: string; grado: string };
export type DatosExperiencia = { empresa: string; cargo: string; fechaInicio: string; fechaFin: string };
export type DatosCertificacion = { nombre: string; entidadEmisora: string; anioEmision: string; grado: string };

function texto(valor: string, etiqueta: string, maximo: number, femenino = false): string | undefined {
  const limpio = valor.trim();
  if (!limpio) return `${etiqueta} es ${femenino ? 'obligatoria' : 'obligatorio'}.`;
  if (limpio.length > maximo) return `${etiqueta} no puede superar los ${maximo} caracteres.`;
  return undefined;
}

function anio(valor: string, etiqueta: string): string | undefined {
  if (!valor) return `${etiqueta} es obligatorio.`;
  if (!/^\d{4}$/.test(valor)) return `${etiqueta} debe tener 4 dígitos.`;
  if (Number(valor) > new Date().getFullYear()) return `${etiqueta} no puede ser mayor al año actual.`;
  return undefined;
}

// Fecha local AAAA-MM-DD: toISOString() usa UTC y en Bolivia (UTC-4) da el día siguiente desde las 20:00
function hoy(): string {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  return `${ahora.getFullYear()}-${mes}-${dia}`;
}

// Quita los campos sin error para que "sin errores" sea un objeto vacío
function limpiar<Campo extends string>(errores: Record<Campo, string | undefined>): ErroresFormulario<Campo> {
  return Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje)) as ErroresFormulario<Campo>;
}

export function validarFormacion(datos: DatosFormacion): ErroresFormulario<keyof DatosFormacion> {
  return limpiar({
    institucion: texto(datos.institucion, 'La institución', 150, true),
    titulo: texto(datos.titulo, 'El título', 150),
    anioEgreso: anio(datos.anioEgreso, 'El año de egreso'),
    grado: datos.grado ? undefined : 'Selecciona un grado.',
  });
}

export function validarExperiencia(
  datos: DatosExperiencia,
  trabajoActual: boolean,
): ErroresFormulario<keyof DatosExperiencia> {
  let fechaInicio: string | undefined;
  if (!datos.fechaInicio) fechaInicio = 'La fecha inicio es obligatoria.';
  else if (datos.fechaInicio > hoy()) fechaInicio = 'La fecha inicio no puede ser posterior a hoy.';

  let fechaFin: string | undefined;
  if (!trabajoActual) {
    if (!datos.fechaFin) fechaFin = 'La fecha fin es obligatoria si no trabajas aquí actualmente.';
    else if (datos.fechaFin > hoy()) fechaFin = 'La fecha fin no puede ser posterior a hoy.';
    else if (datos.fechaInicio && datos.fechaFin < datos.fechaInicio)
      fechaFin = "La fecha 'Hasta' no puede ser anterior a 'Desde'";
  }

  return limpiar({
    empresa: texto(datos.empresa, 'La empresa', 150, true),
    cargo: texto(datos.cargo, 'El cargo', 100),
    fechaInicio,
    fechaFin,
  });
}

export function validarCertificacion(datos: DatosCertificacion): ErroresFormulario<keyof DatosCertificacion> {
  return limpiar({
    nombre: texto(datos.nombre, 'El nombre de la certificación', 150),
    entidadEmisora: texto(datos.entidadEmisora, 'La entidad emisora', 150, true),
    anioEmision: anio(datos.anioEmision, 'El año'),
    grado: datos.grado ? undefined : 'Selecciona un grado.',
  });
}

const TIPOS_RESPALDO = ['image/jpeg', 'image/png', 'application/pdf'];
const TAMANIO_MAXIMO_RESPALDO = 5 * 1024 * 1024;

// El atributo accept del input se puede saltar eligiendo "Todos los archivos", por eso se revisa aquí
export function validarRespaldo(archivo: File): string | undefined {
  if (!TIPOS_RESPALDO.includes(archivo.type)) return 'Formato no permitido. Solo JPG, PNG o PDF';
  if (archivo.size > TAMANIO_MAXIMO_RESPALDO) return 'El archivo no puede superar 5 MB';
  return undefined;
}

export function cantidadErrores(errores: object): number {
  return Object.keys(errores).length;
}
