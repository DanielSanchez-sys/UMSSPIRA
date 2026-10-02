import { SeccionAcordeon } from './seccion-acordeon';

const SECCIONES = [
  { titulo: 'Formación académica', descripcion: 'Tu formación académica principal' },
  { titulo: 'Experiencia laboral', descripcion: 'Tu experiencia profesional más relevante' },
  { titulo: 'Certificaciones', descripcion: 'Credenciales que respaldan tu perfil' },
];

export function AcordeonPerfil() {
  return (
    <div className="flex flex-col gap-4">
      {SECCIONES.map((seccion, indice) => (
        <SeccionAcordeon
          key={seccion.titulo}
          numero={indice + 1}
          titulo={seccion.titulo}
          descripcion={seccion.descripcion}
        />
      ))}
    </div>
  );
}