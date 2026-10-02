export interface DashboardIndicators {
  totalGraduates: number;
  verifiedGraduates: number;
  observedGraduates: number;
  activeMentors: number;
}

export async function getDashboardIndicators(): Promise<DashboardIndicators> {
  const response = await fetch(
    "http://localhost:3000/reports/dashboard/indicators"
  );

  if (!response.ok) {
    throw new Error("No se pudieron cargar los indicadores del dashboard");
  }

  return response.json();
}