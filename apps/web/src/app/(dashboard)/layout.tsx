import React from 'react';
import { AdminNavbar } from '@/shared/components/admin-navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-container">
      <AdminNavbar />
      {children}
    </div>
  );
}