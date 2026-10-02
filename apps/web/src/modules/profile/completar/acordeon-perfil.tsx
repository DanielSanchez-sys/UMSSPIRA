'use client';

import { useState } from 'react';
import { BarraProgreso } from './barra-progreso';
import { SeccionAcordeon } from './seccion-acordeon';
import { FormularioExperiencia, type Experiencia } from './experiencia-laboral';
import { FormacionAcademicaForm, type FormacionAcademica } from './formacion-academica';
import { FormularioCertificaciones, type Certificacion } from './certificaciones';

export function AcordeonPerfil() {
  // Cada sección guardará aquí sus registros (T1.3, T1.4 y T1.5).
  const [formaciones, setFormaciones] = useState<FormacionAcademica[]>([]);
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [certificaciones, setCertificaciones] = useState<Certificacion[]>([]);

  const cantidades = [formaciones.length, experiencias.length, certificaciones.length];
  const completas = cantidades.filter((cantidad) => cantidad > 0).length;

  return (
    <div className="flex flex-col gap-4">
      <BarraProgreso completas={completas} total={3} />

      <SeccionAcordeon
        numero={1}
        titulo="Formación académica"
        descripcion="Tu formación académica principal"
        cantidad={formaciones.length}
      >
        <FormacionAcademicaForm
          formaciones={formaciones}
          onAgregar={(formacion) => setFormaciones([...formaciones, formacion])}
        />
      </SeccionAcordeon>
      <SeccionAcordeon
        numero={2}
        titulo="Experiencia laboral"
        descripcion="Tu experiencia profesional más relevante"
        cantidad={experiencias.length}
        >
        <FormularioExperiencia 
          experiencias={experiencias} 
          onAgregar={(experiencia) => setExperiencias([...experiencias, experiencia])} 
        />
     </SeccionAcordeon>
      <SeccionAcordeon
        numero={3}
        titulo="Certificaciones"
        descripcion="Credenciales que respaldan tu perfil"
        cantidad={certificaciones.length}
      >
        <FormularioCertificaciones
          certificaciones={certificaciones}
          onAgregar={(certificacion) => setCertificaciones([...certificaciones, certificacion])}
        />
      </SeccionAcordeon>
    </div>
  );
}