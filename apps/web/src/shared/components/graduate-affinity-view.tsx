'use client';

import React, { useState } from 'react';
import { RadarChart } from './radar-chart';
import { ArrowLeft, Code, Database, Cloud, ShieldAlert, Lock, Target, AlertTriangle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const GraduateAffinityView: React.FC = () => {
  const [profileState, setProfileState] = useState<'calculated' | 'customizing'>('calculated');

  // Candidate's own 6-area technical vector (HU-1)
  const candidateAreas = [
    { area: 'desarrollo de software', affinity: 95 },
    { area: 'cloud & devops', affinity: 64 },
    { area: 'ciencia de datos & ia', affinity: 71 },
    { area: 'aseguramiento de calidad (QA)', affinity: 58 },
    { area: 'ciberseguridad y redes', affinity: 42 },
    { area: 'gestion de ti & gobernanza', affinity: 50 },
  ];

  const areaIcons = [
    { area: 'Desarrollo de Software', score: 95, icon: Code },
    { area: 'Ciencia de Datos & IA', score: 71, icon: Database },
    { area: 'Cloud, DevOps & Infraestructura', score: 64, icon: Cloud },
    { area: 'Gestión de TI & Gobernanza', score: 50, icon: ShieldAlert },
    { area: 'Ciberseguridad & Redes', score: 42, icon: Lock },
    { area: 'Aseguramiento de Calidad (QA)', score: 58, icon: Target },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back Link & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <a
            href="#"
            className="text-xs font-semibold text-truffle-trouble hover:underline flex items-center space-x-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a mi perfil</span>
          </a>
          <h2 className="text-3xl font-black text-abyssal-blue tracking-tight">
            Tu afinidad profesional
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Visualiza las áreas profesionales que más se relacionan con tu perfil académico y experiencia. Completa tu información para mantener actualizado tu mapa de afinidad.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="bg-oatmeal/40 p-1.5 rounded-2xl flex items-center space-x-1 shrink-0 border border-slate-300/60">
          <button
            onClick={() => setProfileState('calculated')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              profileState === 'calculated'
                ? 'bg-white text-abyssal-blue shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Perfil Calculado
          </button>
          <button
            onClick={() => setProfileState('customizing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              profileState === 'customizing'
                ? 'bg-burning-flame text-abyssal-blue shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Personalizar
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Gráfico de Afinidad */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="font-bold text-abyssal-blue text-lg flex items-center space-x-2">
                <span>Gráfico de afinidad</span>
                <span className="text-xs text-slate-400 font-normal">ℹ️</span>
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Vector Calculado NLP</span>
              </span>
            </div>

            {/* Embedded Hexagon Radar */}
            <div className="py-4 flex flex-col items-center justify-center bg-palladian/40 rounded-2xl border border-slate-200/60">
              <RadarChart
                data={candidateAreas}
                size={320}
                accentColor="#A35139"
                fillColor="rgba(163, 81, 57, 0.22)"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 font-mono">
              💡 <strong>Tu resultado mostrará:</strong> áreas profesionales, porcentaje de afinidad y palabras clave relacionadas con tu perfil.
            </p>

            <button className="px-5 py-2.5 bg-burning-flame hover:bg-burning-flame/90 text-abyssal-blue font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5 shrink-0">
              <span>Actualizar Perfil</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Resumen de tu afinidad */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-abyssal-blue text-lg">Resumen de tu afinidad</h3>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Verificado</span>
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Porcentajes de afinidad por área a partir de las palabras clave de tu perfil (HU-1):
            </p>

            {/* 6 Area Items with Icons */}
            <div className="space-y-2.5">
              {areaIcons.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-abyssal-blue">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">{item.area}</span>
                    </div>

                    <span className="text-xs font-extrabold text-truffle-trouble font-mono">
                      {item.score}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Warning Note Box */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900 space-y-1">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  Los resultados se actualizarán automáticamente cada vez que agregues nuevos títulos académicos, experiencia laboral o certificaciones oficiales.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button className="w-full py-3 bg-burning-flame hover:bg-burning-flame/90 text-abyssal-blue font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2">
              <span>Completar perfil</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
