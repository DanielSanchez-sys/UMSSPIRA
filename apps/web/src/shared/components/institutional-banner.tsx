'use client';

export default function InstitutionalBanner() {
  return (
    // Contenedor principal con el color de fondo Palladian
    <div className="w-full bg-[#EEE9DF] py-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Sección de texto */}
        <div className="text-gray-800">
          <h2 className="text-xl font-bold mb-1">CONVENIOS EMPRESARIALES FCYT</h2>
          <p className="text-sm">¿Buscas contratar cohortes completas de graduados o formular pasantías institucionales?</p>
          <p className="text-xs text-gray-600 mt-1">
            La Dirección de Interacción Social y la Bolsa de Trabajo FCYT organizan sesiones de selección directa y validación presencial de competencias técnicas de nuestros titulados.
          </p>
        </div>

        {/* Sección de botones */}
        <div className="flex flex-col sm:flex-row gap-3 min-w-max">
          {/* Botón Principal (Burning Flame) */}
          <button className="bg-[#FFB162] hover:bg-orange-400 text-[#1B2632] font-semibold py-2 px-6 rounded-md shadow-sm transition-colors text-sm">
            Solicitar Alianza Corporativa
          </button>
          
          {/* Botón Secundario (Oatmeal) */}
          <button className="bg-[#C9C1B1] hover:bg-gray-300 text-[#1B2632] font-semibold py-2 px-6 rounded-md shadow-sm transition-colors text-sm flex items-center justify-center gap-2">
            <span>Descargar Guía de Validación SIS</span>
          </button>
        </div>

      </div>
    </div>
  );
}