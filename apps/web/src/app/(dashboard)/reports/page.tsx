"use client";

import KpiCard from "../../../modules/reports/components/KpiCard";
import { useDashboardIndicators } from "../../../modules/reports/hooks/useDashboardIndicators";

export default function ReportsPage() {
  const { data, loading, error } = useDashboardIndicators();

  if (loading) {
    return (
      <div className="p-6">
        <p>Cargando indicadores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Dashboard de indicadores
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Egresados registrados"
          value={data.totalGraduates}
        />

        <KpiCard
          title="Egresados verificados"
          value={data.verifiedGraduates}
        />

        <KpiCard
          title="Egresados observados"
          value={data.observedGraduates}
        />

        <KpiCard
          title="Mentores activos"
          value={data.activeMentors}
        />
      </div>
    </main>
  );
}