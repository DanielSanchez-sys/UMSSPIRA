'use client';
import { useState } from 'react';
import { AlertCircle, Check, ChevronDown, ChevronUp } from 'lucide-react';

type SeccionAcordeonProps = {
  numero: number;
  titulo: string;
  descripcion: string;
  cantidad: number;
  // Campos con errores sin corregir en el formulario de la sección
  errores?: number;
  children?: React.ReactNode;
};

// Cabecera de sección según la v3 del Figma: número o check, título en mayúsculas y estado
export function SeccionAcordeon({ numero, titulo, descripcion, cantidad, errores = 0, children }: SeccionAcordeonProps) {
  const [abierta, setAbierta] = useState(false);
  const completa = cantidad > 0;

  let indicador = (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-umss-sand text-sm font-bold text-umss-navy">
      {numero}
    </span>
  );
  if (abierta) {
    indicador = (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-umss-terracotta text-sm font-bold text-white">
        {numero}
      </span>
    );
  } else if (completa) {
    indicador = (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D1E7DD] text-[#0F5132]">
        <Check className="h-4 w-4" aria-label="Sección completa" />
      </span>
    );
  }

  return (
    <section
      className={`rounded-2xl border bg-white transition-colors ${
        abierta || errores > 0 ? 'border-umss-terracotta' : 'border-umss-ink/10'
      }`}
    >
      <button
        type="button"
        onClick={() => setAbierta(!abierta)}
        aria-expanded={abierta}
        title={descripcion}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left md:px-6 md:py-[18px]"
      >
        <span className="flex min-w-0 items-center gap-3">
          {indicador}
          <span className="flex min-w-0 flex-wrap items-baseline gap-x-2">
            <span className="text-base font-bold uppercase text-umss-navy">
              {abierta ? titulo : `${numero}. ${titulo}`}
            </span>
            <span className={`text-[13px] ${completa ? 'font-medium text-[#0F5132]' : 'text-umss-navy/60'}`}>
              {completa ? `(Completado · ${cantidad} ${cantidad === 1 ? 'registro' : 'registros'})` : '(Sin iniciar)'}
            </span>
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-2">
          {errores > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-[#FDECEA] px-2.5 py-1 text-[11px] font-bold text-umss-terracotta">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {errores} {errores === 1 ? 'error' : 'errores'}
            </span>
          )}
          {abierta ? (
            <ChevronUp className="h-5 w-5 shrink-0 text-umss-navy" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-5 w-5 shrink-0 text-umss-navy" aria-hidden="true" />
          )}
        </span>
      </button>

      {/* Se oculta en vez de desmontarse para no perder lo escrito ni los errores al cerrar la sección */}
      <div hidden={!abierta} className="border-t border-umss-sand/70 px-4 py-4 md:px-6 md:py-5">
        {children}
      </div>
    </section>
  );
}
