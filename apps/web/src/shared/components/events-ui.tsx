import Image from 'next/image';
import Link from 'next/link';
import {
  Bell,
  Check,
  ChevronDown,
  Menu,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
} from 'lucide-react';

type AdminSection = 'management' | 'create' | 'drafts';

export function EventsHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="events-app">
      <header className="events-desktop-header">
        <Link href="/events" className="events-logo-link" aria-label="UMSSPIRA - Eventos">
          <Image
            src="/assets/events/umsspira-logo-desktop.png"
            alt="UMSSPIRA"
            width={170}
            height={56}
            priority
          />
        </Link>

        <nav className="events-main-nav" aria-label="Navegación principal">
          <span>Inicio</span>
          <span>Comunidad</span>
          <span>Directorio</span>
          <span>Bolsa de trabajo</span>
          <span>Mentorías</span>
          <Link href="/events" className="is-active">
            Eventos <ChevronDown size={13} strokeWidth={2.3} />
          </Link>
        </nav>

        <div className="events-header-actions" aria-label="Acciones de cuenta">
          <Search size={22} />
          <MessageSquare size={22} />
          <span className="events-notification-icon">
            <Bell size={22} />
          </span>
          <span className="events-profile-separator" />
          <span className="events-avatar">AD</span>
          <span className="events-profile-copy">
            <strong>Administración</strong>
            <small>Sin sesión</small>
          </span>
          <ChevronDown size={15} />
        </div>
      </header>

      <header className="events-mobile-header">
        <Menu size={24} aria-hidden="true" />
        <Link href="/events" aria-label="UMSSPIRA - Eventos">
          <Image
            src="/assets/events/umsspira-logo-2.png"
            alt="UMSSPIRA"
            width={107}
            height={30}
            priority
          />
        </Link>
        <span className="events-mobile-avatar" aria-label="Administración">AD</span>
      </header>

      {children}
    </div>
  );
}

export function EventAdminTabs({ active }: { active: AdminSection }) {
  const tabs: Array<{ key: AdminSection; label: string; href: string }> = [
    { key: 'management', label: 'Gestión', href: '/events' },
    { key: 'create', label: 'Crear evento', href: '/events/create' },
    { key: 'drafts', label: 'Borradores', href: '/events/drafts' },
  ];

  return (
    <nav className="event-admin-tabs" aria-label="Administración de eventos">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={active === tab.key ? 'page' : undefined}
          className={active === tab.key ? 'is-active' : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

const managementEvents = [
  {
    initials: 'TI',
    title: 'Feria de Empleo TI 2026',
    created: 'Creado por Administración · 26 sep 2026',
    date: '12 oct 2026',
    time: '09:00–17:00',
    location: 'Campus Central',
    capacity: 180,
    status: 'Publicado',
  },
  {
    initials: 'CS',
    title: 'Taller de Ciberseguridad',
    created: 'Creado por Administración · 25 sep 2026',
    date: '18 oct 2026',
    time: '14:00–17:00',
    location: 'Laboratorio 3',
    capacity: 40,
    status: 'Borrador',
  },
  {
    initials: 'EG',
    title: 'Encuentro de Egresados',
    created: 'Creado por Administración · 24 sep 2026',
    date: '25 oct 2026',
    time: '18:00–21:00',
    location: 'Auditorio FCyT',
    capacity: 120,
    status: 'Publicado',
  },
  {
    initials: 'IA',
    title: 'Seminario de IA Aplicada',
    created: 'Creado por Administración · 25 sep 2026',
    date: '05 nov 2026',
    time: '10:00–12:00',
    location: 'Auditorio Ing.',
    capacity: 80,
    status: 'Borrador',
  },
] as const;

export function EventManagementContent({ compact = false }: { compact?: boolean }) {
  return (
    <main className={`events-page events-management ${compact ? 'is-compact' : ''}`}>
      <div className="events-title-row">
        <div>
          <h1>Gestión de eventos</h1>
          <p>Administra los eventos universitarios de la comunidad UMSSPIRA.</p>
        </div>
        <Link href="/events/create" className="event-button event-button-primary events-create-button">
          <Plus size={16} /> Crear evento
        </Link>
      </div>

      <EventAdminTabs active="management" />

      <div className="event-metrics" aria-label="Resumen de eventos">
        <Metric value="12" label="Total de eventos" mobileLabel="Total" tone="orange" />
        <Metric value="8" label="Publicados" tone="blue" />
        <Metric value="4" label="Borradores" tone="red" />
      </div>

      <section className="events-list-panel">
        <div className="events-filters">
          <input aria-label="Buscar" placeholder="Buscar eventos por título…" readOnly />
          <select aria-label="Fecha" defaultValue="all">
            <option value="all">Todas las fechas</option>
          </select>
          <select aria-label="Estado" defaultValue="all">
            <option value="all">Todos los estados</option>
          </select>
          <button type="button" className="event-button event-button-primary">Filtrar</button>
        </div>

        <h2>Listado de eventos</h2>

        <div className="events-table" role="table" aria-label="Listado de eventos">
          <div className="events-table-head" role="row">
            <span>Evento</span><span>Fecha y hora</span><span>Ubicación</span>
            <span>Cupo</span><span>Estado</span><span>Acciones</span>
          </div>
          {managementEvents.map((event) => (
            <article className="events-table-row" role="row" key={event.title}>
              <div className="event-list-title">
                <span className={`event-thumb ${event.initials === 'EG' ? 'is-red' : ''}`}>
                  {event.initials}
                </span>
                <span><strong>{event.title}</strong><small>{event.created}</small></span>
              </div>
              <span className="event-date"><strong>{event.date}</strong><small>{event.time}</small></span>
              <span className="event-location">{event.location}</span>
              <span className="event-capacity">{event.capacity}</span>
              <StatusChip status={event.status} />
              <div className="event-row-actions">
                {event.status === 'Publicado' ? (
                  <button type="button" className="event-button event-button-secondary" disabled title="La ruta de detalle pertenece a HU2 y aún no existe">Ver</button>
                ) : (
                  <>
                    <button type="button" className="event-button event-button-secondary" disabled title="La edición aún no tiene una ruta disponible">Editar</button>
                    <button type="button" className="event-button event-button-primary" disabled title="La publicación de un borrador existente requiere integración pendiente">Publicar</button>
                  </>
                )}
                <MoreVertical size={18} aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
        <p className="events-list-footer">Mostrando 1–4 de 12 eventos</p>
      </section>
    </main>
  );
}

function Metric({ value, label, mobileLabel, tone }: { value: string; label: string; mobileLabel?: string; tone: string }) {
  return (
    <article className={`event-metric is-${tone}`}>
      <span className="metric-accent" />
      <strong>{value}</strong>
      <span className="metric-label-desktop">{label}</span>
      <span className="metric-label-mobile">{mobileLabel ?? label}</span>
    </article>
  );
}

export function StatusChip({ status }: { status: 'Publicado' | 'Borrador' }) {
  return <span className={`event-status ${status === 'Publicado' ? 'is-published' : 'is-draft'}`}>{status}</span>;
}

export interface EventSummary {
  title: string;
  dateLabel: string;
  location: string;
  maxCapacity: number;
}

export function EventConfirmDialog({
  event,
  isSubmitting,
  onCancel,
  onConfirm,
}: {
  event: EventSummary;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="event-modal-layer" role="presentation">
      <section className="event-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-event-title">
        <h2 id="confirm-event-title">¿Publicar este evento?</h2>
        <p>Una vez publicado será visible en el catálogo de la comunidad.</p>
        <div className="event-confirm-summary">
          <div className="event-confirm-cover"><span>FERIA TI</span><i /></div>
          <div>
            <strong>{event.title}</strong>
            <span>{event.dateLabel}</span>
            <span>{event.location || 'Ubicación por definir'} · Cupo {event.maxCapacity}</span>
          </div>
        </div>
        <div className="event-dialog-actions">
          <button type="button" className="event-button event-button-secondary" onClick={onCancel} disabled={isSubmitting}>Cancelar</button>
          <button type="button" className="event-button event-button-primary" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Publicando…' : 'Publicar evento'}
          </button>
        </div>
      </section>
    </div>
  );
}

export function EventSuccessDialog({ onBack }: { onBack: () => void }) {
  return (
    <div className="event-modal-layer" role="presentation">
      <section className="event-success-dialog" role="dialog" aria-modal="true" aria-labelledby="event-success-title">
        <span className="event-success-icon"><Check size={40} strokeWidth={3} /></span>
        <h2 id="event-success-title">¡Evento publicado correctamente!</h2>
        <p>El evento ya está disponible en el catálogo.</p>
        <div className="event-dialog-actions">
          <button type="button" className="event-button event-button-secondary event-back-button" onClick={onBack}>Volver a eventos</button>
          <button type="button" className="event-button event-button-primary event-view-button" disabled title="La ruta de detalle depende de HU2 y aún no existe">Ver evento</button>
        </div>
      </section>
    </div>
  );
}
