'use client';

import { useState } from 'react';

export default function CandidateCarousel() {
  // States for pagination (Waiting for Dajhana's JSON data)
  const [currentPage, setCurrentPage] = useState(1);
  const totalCandidates = 48; // Mock number based on Figma

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-[#F8F9FA]">
      
      {/* Header Section */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          Buscador de Talento y Afinidad Profesional
        </h1>
        <p className="text-gray-600 mt-2 text-sm">
          Compara competencias de titulados de Sistemas e Informática mediante gráficos de afinidad calculados y valida sus respaldos académicos y certificaciones oficiales.
        </p>
        <div className="mt-4 inline-block bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
          {totalCandidates} TITULADOS
        </div>
      </div>

      {/* 
        TODO: Integración Backend (Sprint 2) - [TAREA #32]
        - Aquí se debe conectar la llamada al endpoint de búsqueda y filtrado de la Epic 2.
        - El cálculo de afinidad se consumirá de la base de datos real en lugar del mock JSON.
      */}
      {/* Search Bar Section (Simulated) */}
      <div className="mb-8">
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Buscar por tecnología o habilidad (ej. React, Python, Cloud)..."
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-[#E65100] text-white px-6 py-2 rounded-md font-medium hover:bg-orange-700 transition">
            Buscar
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded border">Senior Full Stack, Cloud & Microservicios</span>
        </div>
      </div>

      {/* Carousel Controls & Pagination */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-700">
          Mostrando 1-3 de {totalCandidates} candidatos
        </span>
        <div className="flex gap-2">
          <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50">
            &lt; 
          </button>
          <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-100">
            &gt; 
          </button>
        </div>
      </div>

      {/* Candidate Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Placeholder Card 1 */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-gray-400 text-sm">Esperando el JSON de Dajhana...</p>
        </div>

        {/* Placeholder Card 2 (Hidden on mobile) */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hidden md:flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-gray-400 text-sm">Esperando el JSON de Dajhana...</p>
        </div>

        {/* Placeholder Card 3 (Hidden on mobile) */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hidden md:flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-gray-400 text-sm">Esperando el JSON de Dajhana...</p>
        </div>

      </div>
    </div>
  );
}