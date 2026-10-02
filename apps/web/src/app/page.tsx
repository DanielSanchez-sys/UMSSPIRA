'use client';

import React, { useState } from 'react';
import { SiteHeader } from '@/shared/components/site-header';
import { NlpSearch, type SearchCandidateResult } from '@/shared/components/nlp-search';
import { CandidateCard } from '@/shared/components/candidate-card';
import { EvidenceBreakdown } from '@/shared/components/evidence-breakdown';
import { GraduateAffinityView } from '@/shared/components/graduate-affinity-view';
import { Epic2IntegrationDocs } from '@/shared/components/epic2-integration-docs';
import { SiteFooter } from '@/shared/components/site-footer';
import candidatesData from '@/shared/mocks/candidates-mock.json';
import { computeMayorConcentracion } from '@/shared/utils/concentration';
import { ChevronLeft, ChevronRight, Users, Sparkles } from 'lucide-react';

export default function Home() {
  const [activeView, setActiveView] = useState<'recruiter' | 'graduate'>('recruiter');
  const [candidates, setCandidates] = useState<SearchCandidateResult[]>(() =>
    (candidatesData.candidates as SearchCandidateResult[]).map((cand) => ({
      ...cand,
      mayorConcentracion: computeMayorConcentracion('', cand),
    }))
  );
  const [selectedGraduateId, setSelectedGraduateId] = useState<string>(
    candidatesData.candidates[0].graduateId
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Selected candidate object
  const selectedCandidate =
    candidates.find((c) => c.graduateId === selectedGraduateId) || candidates[0];

  const handleSearchCompleted = (results: SearchCandidateResult[], query: string) => {
    setCandidates(results);
    setSearchQuery(query);
    if (results.length > 0) {
      setSelectedGraduateId(results[0].graduateId);
    }
  };

  return (
    <div className="min-h-screen bg-palladian text-abyssal-blue font-sans flex flex-col justify-between">
      <div>
        {/* Top Header Navbar */}
        <SiteHeader
          activeView={activeView}
          onToggleView={(view) => setActiveView(view)}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          {activeView === 'recruiter' ? (
            /* Modo Buscador (Reclutador) - Mockup 3 */
            <div className="space-y-10 animate-fadeIn">
              {/* Section 1: Buscador de Talento y Afinidad Profesional */}
              <section>
                <NlpSearch
                  onSearchCompleted={handleSearchCompleted}
                  isSearching={isSearching}
                  setIsSearching={setIsSearching}
                />
              </section>

              {/* Section 2: Comparativa de Egresados & Hexágonos de Afinidad */}
              <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-300/60 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-truffle-trouble" />
                      <h3 className="text-lg font-black text-abyssal-blue tracking-tight uppercase">
                        Comparativa de Egresados & Hexágonos de Afinidad
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Selecciona un candidato para inspeccionar la trazabilidad de sus materias, actas de grado y diplomas.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <span className="text-xs text-slate-500 font-mono mr-2">
                      Mostrando 1 - {Math.min(3, candidates.length)} de {candidates.length} candidatos
                    </span>
                    <button className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 3 Candidate Cards Grid with Hexágonos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {candidates.slice(0, 3).map((cand) => (
                    <CandidateCard
                      key={cand.graduateId}
                      graduateId={cand.graduateId}
                      name={cand.name}
                      career={cand.career}
                      graduationYear={cand.graduationYear}
                      skills={cand.skills}
                      professionalDescription={cand.professionalDescription}
                      affinity={cand.affinity}
                      nlpScore={cand.nlpScore}
                      featured={cand.featured}
                      isSelected={selectedGraduateId === cand.graduateId}
                      areas={cand.areas}
                      mayorConcentracion={cand.mayorConcentracion || cand.concentrationArea}
                      onSelectCandidate={(id) => setSelectedGraduateId(id)}
                    />
                  ))}
                </div>
              </section>

              {/* Section 3: Expediente Académico y Certificaciones Verificadas */}
              <section id="evidence-section">
                <EvidenceBreakdown candidateName={selectedCandidate.name} />
              </section>

              {/* Section 4: Documentación Técnica de Integración Tarea #32 */}
              <section>
                <Epic2IntegrationDocs />
              </section>
            </div>
          ) : (
            /* Modo Egresado (Mi Afinidad Profesional) - Mockup 1 */
            <GraduateAffinityView />
          )}
        </main>
      </div>

      {/* Footer Banner */}
      <SiteFooter />
    </div>
  );
}
