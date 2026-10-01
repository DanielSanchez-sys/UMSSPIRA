'use client';

import React, { useState } from 'react';
import { CandidateCard } from './candidate-card';
import type { SearchCandidateResult } from './nlp-search';

interface CandidateCarouselProps {
  candidates: SearchCandidateResult[];
  onSelectCandidate: (graduateId: string) => void;
  selectedGraduateId?: string;
  searchQuery?: string;
}

export const CandidateCarousel: React.FC<CandidateCarouselProps> = ({
  candidates = [],
  onSelectCandidate,
  selectedGraduateId,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalCandidates = candidates.length || 48; // Usa 48 si no hay datos aún
  const maxIndex = Math.max(0, candidates.length - itemsPerPage);

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  const visibleCandidates = candidates.slice(currentIndex, currentIndex + itemsPerPage);

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
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button className="bg-[#FFB162] text-[#1B2632] px-6 py-2 rounded-md font-semibold hover:bg-orange-400 transition shadow-sm">
            Buscar
          </button>
        </div>
      </div>

      {/* Carousel Controls & Pagination */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-700">
          Mostrando {currentIndex + 1}-{Math.min(currentIndex + itemsPerPage, totalCandidates)} de {totalCandidates} titulados
        </span>
        <div className="flex gap-2">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            &lt; 
          </button>
          <button 
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            &gt; 
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.length > 0 ? (
          visibleCandidates.map((candidate) => (
            <div key={candidate.graduateId}>
              <CandidateCard
                graduateId={candidate.graduateId}
                name={candidate.name}
                career={candidate.career}
                graduationYear={candidate.graduationYear}
                skills={candidate.skills}
                professionalDescription={candidate.professionalDescription}
                affinity={candidate.affinity}
                nlpScore={candidate.nlpScore}
                featured={candidate.featured}
                onSelectCandidate={onSelectCandidate}
              />
            </div>
          ))
        ) : (
          <div className="col-span-3 bg-white border border-gray-200 rounded-lg p-8 shadow-sm flex flex-col items-center justify-center">
            <p className="text-gray-500 text-sm font-medium">No hay candidatos disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};