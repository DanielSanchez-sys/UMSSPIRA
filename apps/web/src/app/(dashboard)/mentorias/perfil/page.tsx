import { PageLayout } from '@/shared/components/page-layout';
import { ActivePanel } from './_components/active-panel';

export default function MentorProfilePage() {
  return (
    <main className="mentorias-shell">
      <PageLayout
        breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Mentorías', href: '/mentorias' }, { label: 'Mi perfil' }]}
        title="Mi perfil de mentor"
        description="Administra la información de tu participación en la red de mentorías."
      >
        <ActivePanel />
      </PageLayout>
    </main>
  );
}
