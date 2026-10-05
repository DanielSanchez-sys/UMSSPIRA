'use client';

import { useState } from 'react';
import type {
  Company,
  UpdateCompanyPayload,
} from '@umsspira/shared-types';

import { CompanyDetails } from './company-details';
import { CompanyHeader } from './company-header';
import { EditCompanyForm } from '@/shared/components/edit-company-form';

const companyMock: Company = {
  id: '1',
  nombre: 'Panificadora San Jose S.R.L.',
  nit: '1023456019',
  descripcion:
    'Panificadora San Jose S.R.L. es una empresa dedicada a la elaboración y comercialización de productos de panadería y repostería de alta calidad, consolidada con más de 15 años de experiencia en el mercado local.',
  telefono: '+591 4 4251234',
  correo: 'contacto@panificadorasanjose.com',
  sitioWeb: 'https://www.panificadorasanjose.com',
  direccion: 'Avenida San Martin #450, Zona Norte, Cochabamba, Bolivia',
  tamano: '50 - 100 empleados',
  eslogan: 'Calidad y tradición para cada día.',
};

export default function CompaniesPage() {
  const [company, setCompany] = useState<Company>(companyMock);
  const [isEditing, setIsEditing] = useState(false);

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  async function handleSubmit(
    data: UpdateCompanyPayload,
  ): Promise<void> {
    setCompany((currentCompany) => ({
      ...currentCompany,
      ...data,
    }));

    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-[#EEE9DF] p-6 sm:p-8">
        <div className="mx-auto max-w-7xl">
          <EditCompanyForm
            company={company}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEE9DF] p-6 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Componente HU-02: Banner y Encabezado de la empresa */}
        <CompanyHeader />

        {/* Componente HU-03: Detalles, Descripcion y Contacto */}
        <CompanyDetails
          description={company.descripcion}
          taxId={company.nit}
          companySize={company.tamano}
          address={company.direccion}
          email={company.correo}
          phone={company.telefono}
          website={company.sitioWeb}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}