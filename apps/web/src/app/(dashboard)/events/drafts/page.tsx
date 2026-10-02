import Link from 'next/link';
import { Plus } from 'lucide-react';
import { EventAdminTabs, StatusChip } from '@/shared/components/events-ui';

const drafts = [
  { initials: 'CS', title: 'Taller de Ciberseguridad', date: '18 oct 2026', location: 'Laboratorio 3', edited: 'hoy · 19:30' },
  { initials: 'IA', title: 'Seminario de IA Aplicada', date: '05 nov 2026', location: 'Auditorio Ing.', edited: 'hoy · 18:10' },
  { initials: 'TA', title: 'Encuentro Tech Alumni', date: '12 nov 2026', location: 'Campus Central', edited: 'ayer · 21:45' },
  { initials: 'CE', title: 'Charla de Empleabilidad', desktopTitle: 'Workshop de Emprendimiento Digital', date: '19 nov 2026', location: 'Aula Magna', edited: 'hoy · 16:05' },
] as const;

export default function EventDraftsPage() {
  return (
    <main className="events-page event-drafts-page">
      <div className="events-title-row">
        <div>
          <h1>Borradores</h1>
          <p>
            <span className="draft-desktop-title">Eventos guardados que todavía no son visibles para la comunidad.</span>
            <span className="draft-mobile-title">Eventos guardados para continuar editando después.</span>
          </p>
        </div>
        <Link href="/events/create" className="event-button event-button-primary events-create-button">
          <Plus size={16} /> Crear evento
        </Link>
      </div>

      <EventAdminTabs active="drafts" />

      <section className="event-drafts-panel">
        <input className="draft-search" aria-label="Buscar borradores" placeholder="Buscar borradores…" readOnly />
        <h2>4 borradores</h2>
        <div className="draft-list">
          {drafts.map((draft) => (
            <article className="draft-row" key={draft.title}>
              <div className="draft-main">
                <span className="event-thumb">{draft.initials}</span>
                <span>
                  <strong>
                    {'desktopTitle' in draft && <span className="draft-desktop-title">{draft.desktopTitle}</span>}
                    <span className={'desktopTitle' in draft ? 'draft-mobile-title' : undefined}>{draft.title}</span>
                  </strong>
                  <small>Última edición: {draft.edited}</small>
                </span>
              </div>
              <span className="draft-date"><span>{draft.date}</span><span>{draft.location}</span></span>
              <StatusChip status="Borrador" />
              <div className="draft-actions">
                <button type="button" className="event-button event-button-secondary" disabled title="La edición de borradores aún no tiene una ruta disponible">Continuar edición</button>
                <button type="button" className="event-button event-button-primary" disabled title="Publicar un borrador existente requiere integración pendiente">Publicar</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
