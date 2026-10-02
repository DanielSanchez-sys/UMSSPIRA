import { FileText } from 'lucide-react';

import type { TimelineItem, TimelineSection } from '@/modules/profile/data/profile-data';

type TimelineProps = {
  sections: TimelineSection[];
};

function Connector() {
  return (
    <div className="relative flex w-6 shrink-0 justify-center" aria-hidden="true">
      <span className="absolute inset-y-0 w-0.5 bg-umss-terracotta" />
      <span className="relative mt-1.5 h-3 w-3 rounded-full border-2 border-umss-cream bg-umss-terracotta" />
    </div>
  );
}

function StatusBadge({ status }: { status: NonNullable<TimelineItem['status']> }) {
  const verified = status === 'verified';
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center gap-1 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-[0.05em] ${
        verified ? 'bg-[#D1E7DD] text-[#0F5132]' : 'bg-[#E2E3E5] text-[#383D41]'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${verified ? 'bg-[#0F5132]' : 'bg-[#383D41]'}`} />
      {verified ? 'Respaldo verificado' : 'Sin respaldo'}
    </span>
  );
}

export default function Timeline({ sections }: TimelineProps) {
  return (
    <div className="w-full">
      {sections.map((section) => (
        <section key={section.title}>
          {/* Título de la sección */}
          <div className="flex gap-4 pb-5">
            <Connector />
            <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-umss-terracotta">
              {section.title}
            </h2>
          </div>

          {section.items.length === 0 && (
            <p className="pb-8 pl-10 text-sm font-medium text-umss-navy/60">Sin registros</p>
          )}

          {section.items.map((item) => (
            <article key={`${section.title}-${item.title}`} className="flex gap-4">
              <Connector />

              <div className="flex min-w-0 flex-1 flex-col gap-2 pb-8">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-6">
                  {/* Información principal */}
                  <div className="min-w-0 space-y-1">
                    <h3 className="text-xl font-bold leading-6 text-umss-navy">{item.title}</h3>
                    <p className="text-sm font-medium text-umss-navy/80">{item.subtitle}</p>
                    {item.detail && <p className="text-xs text-umss-navy/60">{item.detail}</p>}
                  </div>

                  {/* Fecha */}
                  {item.date && (
                    <span
                      className={`shrink-0 text-sm ${
                        section.dateTone === 'muted'
                          ? 'font-semibold text-umss-navy/60'
                          : 'font-bold text-umss-terracotta'
                      }`}
                    >
                      {item.date}
                    </span>
                  )}

                  {/* Estado del respaldo */}
                  {item.status && <StatusBadge status={item.status} />}
                </div>

                {/* Documento de respaldo */}
                {item.document && (
                  <a
                    href="#"
                    className="inline-flex w-fit items-center gap-1.5 rounded-md border border-umss-sand bg-white px-2 py-1.5 text-[11px] font-semibold text-umss-navy transition hover:bg-umss-cream"
                  >
                    <FileText className="h-3.5 w-3.5 text-umss-terracotta" aria-hidden="true" />
                    {item.document}
                  </a>
                )}
              </div>
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}