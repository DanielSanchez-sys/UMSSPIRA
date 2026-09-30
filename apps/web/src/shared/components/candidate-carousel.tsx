'use client';

import React, { useState } from 'react';
import { CandidateCard } from './candidate-card';
import type { SearchCandidateResult } from './nlp-search';
import { ChevronLeft, ChevronRight, Users, Sparkles, Filter } from 'lucide-react';

interface CandidateCarouselProps {
  candidates: SearchCandidateResult[];
  onSelectCandidate: (graduateId: string) => void;
  selectedGraduateId?: string;
  searchQuery?: string;
}

export const CandidateCarousel: React.FC<CandidateCarouselProps> = ({
  candidates,
  onSelectCandidate,
  selectedGraduateId,
  searchQuery,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const maxIndex = Math.max(0, candidates.length - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleCandidates = candidates.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Resultados del Ranking NLP ({candidates.length} Egresados)
            </h3>
          </div>
          {searchQuery ? (
            <p className="text-xs text-blue-600 font-medium mt-0.5 flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Resultados ordenados por similitud semántica contra la oferta</span>
            </p>
          ) : (
            <p className="text-xs text-slate-500 mt-0.5">
              Carrusel interactivo de graduados clasificados con métricas de afinidad.
            </p>
          )}
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <span className="text-xs text-slate-400 font-mono mr-2">
            {currentIndex + 1}-{Math.min(currentIndex + itemsPerPage, candidates.length)} de {candidates.length}
          </span>

          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleCandidates.map((candidate) => (
          <div
            key={candidate.graduateId}
            className={`transition-all duration-300 rounded-2xl ${
              selectedGraduateId === candidate.graduateId ? 'ring-4 ring-blue-500/20 shadow-xl' : ''
            }`}
          >
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
        ))}
      </div>
    </div>
  );
};
