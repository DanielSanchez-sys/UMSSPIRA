"use client";

import { useState } from 'react';
import { ArrowRightIcon, AwardIcon, BrainCogIcon, CalendarDaysIcon, CircleCheckIcon, CircleIcon, ContactIcon, LockIcon, MessagesSquareIcon, XIcon, type LucideIcon } from 'lucide-react';
import { ApprovedChip } from './approved-chip';
import { StatusBadge } from './status-badge';
import { PrimaryButton, SecondaryButton } from './ui';

const steps = ['Participación como mentor', 'Áreas técnicas', 'Intereses de mentoría', 'Disponibilidad', 'Información del perfil'];
const options: { title: string; description: string; icon: LucideIcon; action: string; locked?: boolean }[] = [
  { title: 'Áreas técnicas', description: 'Define las áreas técnicas en las que puedes brindar orientación.', icon: BrainCogIcon, action: 'Configurar áreas' },
  { title: 'Intereses de mentoría', description: 'Selecciona los temas específicos sobre los que deseas orientar.', icon: MessagesSquareIcon, action: 'Configurar intereses', locked: true },
  { title: 'Disponibilidad', description: 'Indica si puedes atender nuevas solicitudes de orientación.', icon: CalendarDaysIcon, action: 'Configurar disponibilidad' },
  { title: 'Información del perfil', description: 'Presenta tu descripción, experiencia e información relevante para la mentoría.', icon: ContactIcon, action: 'Agregar información' },
];

export function ActivePanel() {
  const [selected, setSelected] = useState<(typeof options)[number] | null>(null);
  const SelectedIcon = selected?.icon;
  return <>
    <section aria-labelledby="active-title" className="active-panel-card">
      <div className="active-panel-content">
        <div className="active-panel-topbar"><StatusBadge variant="active">Activo</StatusBadge><ApprovedChip /></div>
        <div className="active-panel-hero">
          <span aria-hidden="true" className="active-panel-hero-icon"><AwardIcon /></span>
          <h2 id="active-title" className="active-panel-title">Tu participación como mentor está activa</h2>
          <p className="active-panel-intro">Ahora puedes configurar las áreas e intereses en los que deseas brindar orientación a otros miembros de la comunidad.</p>
        </div>
        <div className="active-panel-progress">
          <div className="active-panel-progress-heading"><h3>Completa tu perfil de mentor</h3><span>1 de 5 pasos completados</span></div>
          <div className="active-panel-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={5} aria-valuenow={1} aria-label="Progreso de configuración"><div /></div>
          <ol className="active-panel-steps">{steps.map((step, index) => <li key={step} className={index === 0 ? 'is-complete' : undefined}>
            {index === 0 ? <CircleCheckIcon aria-hidden="true" /> : <CircleIcon aria-hidden="true" />}
            {index + 1}. {step}<span className="sr-only">{index === 0 ? '(completado)' : '(pendiente)'}</span>
          </li>)}</ol>
        </div>
        <div className="active-panel-settings">
          <h3 className="active-panel-section-title">Configuración del perfil</h3>
          <div className="active-panel-options">{options.map((option) => <article key={option.title} className={`active-panel-option${option.locked ? ' is-locked' : ''}`}>
            <div className="active-panel-option-top">
              <span aria-hidden="true" className="active-panel-option-icon"><option.icon /></span>
              <span className={`active-panel-option-status${option.locked ? ' is-locked' : ''}`}>{option.locked ? 'Bloqueado' : 'Pendiente de configurar'}</span>
            </div>
            <h3 className="active-panel-option-title">{option.title}</h3>
            <p className="active-panel-option-description">{option.description}</p>
            {option.locked && <p className="active-panel-lock-reason"><LockIcon aria-hidden="true" />Primero configura al menos un área técnica.</p>}
            <div className="active-panel-option-action">{option.locked ? <SecondaryButton disabled iconRight={LockIcon}>{option.action}</SecondaryButton> : <PrimaryButton iconRight={ArrowRightIcon} onClick={() => setSelected(option)}>{option.action}</PrimaryButton>}</div>
          </article>)}</div>
        </div>
      </div>
    </section>
    {selected && <div className="active-panel-dialog-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="notice-title" aria-describedby="notice-description" className="active-panel-dialog">
        <div className="active-panel-dialog-top"><span aria-hidden="true" className="active-panel-hero-icon">{SelectedIcon && <SelectedIcon />}</span><button type="button" aria-label="Cerrar aviso" onClick={() => setSelected(null)} className="active-panel-dialog-close"><XIcon /></button></div>
        <p className="active-panel-dialog-eyebrow">Configuración del perfil</p><h2 id="notice-title" className="active-panel-dialog-title">{selected.title}</h2><p id="notice-description" className="active-panel-dialog-description">Esta sección estará disponible próximamente. Tu participación como mentor ya está activa.</p>
        <div className="active-panel-dialog-action"><PrimaryButton onClick={() => setSelected(null)}>Entendido</PrimaryButton></div>
      </section>
    </div>}
  </>;
}
