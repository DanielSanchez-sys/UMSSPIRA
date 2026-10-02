import { ProfileRecordsManager } from '@/modules/profile/components/profile-records-manager';
import { DashboardShell } from '@/shared/components/dashboard-shell';

export default function ProfileRecordsPage() {
  return (
    <DashboardShell activeHref="/profile" userName="Carlos Mendoza" userRole="Egresado">
      <ProfileRecordsManager />
    </DashboardShell>
  );
}
