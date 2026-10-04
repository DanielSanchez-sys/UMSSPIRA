import { CompanyDetails } from "./company-details";
import { CompanyHeader } from "./company-header";

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-[#EEE9DF] p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Componente HU-02: Banner y Encabezado de la empresa */}
        <CompanyHeader />

        {/* Componente HU-03: Detalles, Descripcion y Contacto */}
        <CompanyDetails />
      </div>
    </div>
  );
}
