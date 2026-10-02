'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type SeccionAcordeonProps = {
  numero: number;
  titulo: string;
  descripcion: string;
  children?: React.ReactNode;
};

export function SeccionAcordeon({ numero, titulo, descripcion, children }: SeccionAcordeonProps) {
  const [abierta, setAbierta] = useState(false);

  return (
    <section className="rounded-2xl border border-[#C9C1B1]/70 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
      <button
        type="button"
        onClick={() => setAbierta(!abierta)}
        aria-expanded={abierta}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left md:px-6 md:py-[18px]"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1B2632] text-xs font-bold text-white">
            {String(numero).padStart(2, '0')}
          </span>
          <span>
            <span className="block text-base font-semibold leading-[22px] text-[#2C3B4D] md:text-lg">
              {titulo}
            </span>
            <span className="block text-xs text-[#2C3B4D]/70">{descripcion}</span>
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-3">
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-md border border-[#C9C1B1] bg-white">
            {abierta ? (
              <ChevronUp className="h-4 w-4 text-[#2C3B4D]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#2C3B4D]" />
            )}
          </span>
        </span>
      </button>

      {abierta && (
        <div className="border-t border-[#C9C1B1]/70 px-4 py-4 md:px-6 md:py-5">{children}</div>
      )}
    </section>
  );
}

export function AcordeonPerfil() {
  return (
    <div className="flex flex-col gap-4">
      <SeccionAcordeon
        numero={1}
        titulo="Formación académica"
        descripcion="Tu formación académica principal"
      />
      <SeccionAcordeon
        numero={2}
        titulo="Experiencia laboral"
        descripcion="Tu experiencia profesional más relevante"
      />
      <SeccionAcordeon
        numero={3}
        titulo="Certificaciones"
        descripcion="Credenciales que respaldan tu perfil"
      />
    </div>
  );
}