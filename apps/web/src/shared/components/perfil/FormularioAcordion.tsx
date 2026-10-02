'use client';

import { useState } from 'react';
import { BarraProgreso } from './barra-Progreso';
import { SeccionAcordeon } from './seccion-acordeon';
import { FormularioExperiencia, type Experiencia } from './experiencia';

export function AcordeonPerfil() {
  // Cada sección guardará aquí sus registros (T1.3, T1.4 y T1.5).
  const [formaciones] = useState<unknown[]>([]);
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [certificaciones] = useState<unknown[]>([]);

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
      />
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
      />
    </div>
  );
}