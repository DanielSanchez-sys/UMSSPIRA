import { EditCertificationForm } from '@/modules/profile/components/edit-certification-form';
import { DashboardShell } from '@/shared/components/dashboard-shell';

export default function EditCertificationPage() {
  return (
    <DashboardShell
      activeHref="/profile"
      userName="Carlos Mendoza"
      userRole="Egresado"
    >
      <EditCertificationForm />
    </DashboardShell>
  );
}