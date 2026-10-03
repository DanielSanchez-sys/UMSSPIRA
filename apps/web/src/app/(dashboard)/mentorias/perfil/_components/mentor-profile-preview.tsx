'use client';

import { useState } from 'react';
import { CirclePauseIcon, InfoIcon } from 'lucide-react';
import { PageLayout } from '@/shared/components/page-layout';
import { ConfirmModal } from '@/shared/components/confirm-modal';
import { ActivePanel } from './active-panel';
import { InactivePanel } from './inactive-panel';

type PreviewState = 'activo' | 'inactivo' | 'bloqueado';

const REQUIREMENTS = {
  activo: { egresado: true, perfil: true, sinRestricciones: true },
  inactivo: { egresado: true, perfil: true, sinRestricciones: true },
  bloqueado: { egresado: false, perfil: true, sinRestricciones: true },
};

// Vista de revisión local: datos fijos, no activa ni desactiva nada real.
export function MentorProfilePreview() {
  const [state, setState] = useState<PreviewState>('activo');
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  return (
    <PageLayout
      breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Mentorías', href: '/mentorias' }, { label: 'Revisión visual' }]}
      title="Revisión visual (solo desarrollo)"
      description="Simulación con datos fijos. No representa un cambio real."
    >
      <div role="group" aria-label="Estado a revisar" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {(['activo', 'inactivo', 'bloqueado'] as const).map((s) => (
          <button key={s} type="button" aria-pressed={state === s} onClick={() => setState(s)}>{s}</button>
        ))}
        <button type="button" onClick={() => setOpen(true)}>Abrir modal</button>
        <label>
          <input type="checkbox" checked={confirming} onChange={(e) => setConfirming(e.target.checked)} /> confirming
        </label>
      </div>

      {state === 'activo' ? (
        <ActivePanel />
      ) : (
        <InactivePanel requirements={REQUIREMENTS[state]} activating={false} onActivate={() => undefined} />
      )}

      <ConfirmModal
        open={open}
        icon={CirclePauseIcon}
        eyebrow="Confirmación de estado"
        title="Desactivar participación como mentor"
        description="¿Deseas desactivar tu participación como mentor?"
        confirmLabel="Desactivar participación"
        confirming={confirming}
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      >
        <p>
          <InfoIcon aria-hidden="true" width={16} height={16} /> Tu configuración e historial se conservarán intactos.
        </p>
      </ConfirmModal>
    </PageLayout>
  );
}