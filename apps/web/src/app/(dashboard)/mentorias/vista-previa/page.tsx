import { ArrowRightIcon } from 'lucide-react';
import { PageLayout } from '@/shared/components/page-layout';
import { SuccessBanner } from '@/shared/components/success-banner';
import { PrimaryButton, SecondaryButton } from '../perfil/_components/ui';
import { StatusBadge } from '../perfil/_components/status-badge';
import { ApprovedChip } from '../perfil/_components/approved-chip';

export default function MentoriasVisualPreview() {
  return (
    <main className="mentorias-shell">
      <PageLayout
        breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Mentorías', href: '/mentorias' }, { label: 'Vista previa' }]}
        eyebrow="Mentorías · HU 6.1"
        title="Componentes visuales"
        description="Estados fijos para revisar la base visual de ambos paneles."
      >
        <div className="preview-stack">
          <section aria-labelledby="buttons-title" className="preview-section">
            <h2 id="buttons-title" className="preview-title">Botones</h2>
            <div className="preview-buttons">
              <div className="preview-column">
                <PrimaryButton iconRight={ArrowRightIcon}>Guardar cambios</PrimaryButton>
                <PrimaryButton disabled>Guardar cambios</PrimaryButton>
                <PrimaryButton loading loadingLabel="Guardando cambios">Guardar cambios</PrimaryButton>
              </div>
              <div className="preview-column">
                <SecondaryButton iconRight={ArrowRightIcon}>Cancelar</SecondaryButton>
                <SecondaryButton disabled>Cancelar</SecondaryButton>
              </div>
            </div>
          </section>
          <section aria-labelledby="badges-title" className="preview-section">
            <h2 id="badges-title" className="preview-title">Estados y aprobación</h2>
            <div className="preview-badges">
              <StatusBadge variant="active">Mentor activo</StatusBadge>
              <StatusBadge variant="inactive">Mentor inactivo</StatusBadge>
              <ApprovedChip />
              <ApprovedChip approved={false} />
            </div>
          </section>
          <SuccessBanner title="Perfil actualizado">Tus cambios se guardaron correctamente.</SuccessBanner>
          <SuccessBanner title="No se pudieron guardar los cambios" tone="error">Intenta nuevamente en unos momentos.</SuccessBanner>
        </div>
      </PageLayout>
    </main>
  );
}
