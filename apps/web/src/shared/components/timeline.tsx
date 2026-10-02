import {
  CheckCircle2,
  FileText,
} from 'lucide-react';

import type { TimelineSection } from '@/modules/profile/data/profile-data';

type TimelineProps = {
  sections: TimelineSection[];
};

export default function Timeline({ sections }: TimelineProps) {
  return (
    <div className="w-full">
      {sections.map((section) => (
        <section
          key={section.title}
          className="mb-10 last:mb-0"
        >
          {/* Título de la sección */}
          <h2 className="mb-4 text-[11px] font-bold tracking-wide text-[#a35f4f]">
            {section.title}
          </h2>

          {/* Línea vertical */}
          <div className="relative ml-2 border-l border-[#b86b58]">
            {section.items.map((item) => (
              <article
                key={`${section.title}-${item.title}`}
                className="relative pb-7 pl-6 last:pb-2"
              >
                {/* Punto de la línea de tiempo */}
                <span
                  className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full border border-[#b86b58] bg-[#eeeade]"
                  aria-hidden="true"
                />

                {/* Contenido del elemento */}
                <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-6">
                  
                  {/* Información principal */}
                  <div className="min-w-0">
                    <h3 className="font-serif text-[18px] font-bold leading-tight text-[#263746]">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-[13px] text-[#555555]">
                      {item.subtitle}
                    </p>

                    {/* Documento de respaldo */}
                    {item.document && (
                      <a
                        href="#"
                        className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-[#d6d1c6] bg-white px-2 py-1.5 text-[11px] text-[#444444] shadow-sm transition hover:bg-[#f5f3ed]"
                      >
                        <FileText className="h-3.5 w-3.5 text-[#a34f42]" />
                        {item.document}
                      </a>
                    )}
                  </div>

                  {/* Fecha y estado */}
                  <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
                    
                    {/* Fecha */}
                    <span className="text-[13px] font-semibold text-[#996052]">
                      {item.date}
                    </span>

                    {/* Respaldo verificado */}
                    {item.showStatus && item.document && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#dceee5] px-2 py-1 text-[9px] font-bold tracking-wide text-[#176548]">
                        <CheckCircle2 className="h-3 w-3" />
                        RESPALDO VERIFICADO
                      </span>
                    )}

                    {/* Sin respaldo */}
                    {item.showStatus && !item.document && (
                      <span className="inline-flex items-center rounded-md bg-[#e8e8e8] px-2 py-1 text-[9px] font-bold tracking-wide text-[#555555]">
                        SIN RESPALDO
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}