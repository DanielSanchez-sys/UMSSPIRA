'use client';

import React, { useState } from 'react';

export const AXIS_ORDER = [
  'Desarrollo de Software',
  'Cloud & DevOps',
  'Ciencia de Datos & IA',
  'Aseguramiento de Calidad (QA)',
  'Ciberseguridad & Redes',
  'Gestion de TI & Gobernanza',
] as const;

export interface AreaData {
  area: string;
  percentage: number;
}

interface AffinityRadarProps {
  data?: AreaData[];
  keywords?: string[];
  onSelectArea?: (areaName: string | null) => void;
}

export const AffinityRadar: React.FC<AffinityRadarProps> = ({
  data = [],
  keywords = [
    'Python',
    'JavaScript',
    'Backend',
    'Docker',
    'AWS',
    'Machine Learning',
    'SQL',
    'Git',
    'Agile',
    'Redes',
  ],
  onSelectArea,
}) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const normalizedData = AXIS_ORDER.map((axisName) => {
    const found = data.find(
      (d) => d.area.toLowerCase() === axisName.toLowerCase()
    );
    const rawVal = found ? found.percentage : 0;
    const clampedVal = Math.min(100, Math.max(0, Math.round(rawVal)));
    return {
      area: axisName,
      value: clampedVal,
    };
  });

  const hasData = data.length > 0 && normalizedData.some((d) => d.value > 0);

  const center = 200;
  const radius = 130;
  const totalAxes = AXIS_ORDER.length;
  const angleStep = (Math.PI * 2) / totalAxes;
  const startAngle = -Math.PI / 2;

  const getCoordinates = (index: number, valueFactor: number) => {
    const angle = startAngle + index * angleStep;
    const r = radius * valueFactor;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const polygonPoints = normalizedData
    .map((d, i) => {
      const coords = getCoordinates(i, d.value / 100);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  const handleAxisClick = (areaName: string) => {
    const nextSelection = selectedArea === areaName ? null : areaName;
    setSelectedArea(nextSelection);
    if (onSelectArea) {
      onSelectArea(nextSelection);
    }
  };

  const topAreas = [...normalizedData]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="relative flex justify-center items-center my-4 min-h-[380px]">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-400">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Completa tu perfil para descubrir tu afinidad profesional
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              Aun no podemos calcular tus areas de mayor afinidad. Necesitamos
              algunos datos de tu perfil para generar tu mapa de afinidad.
            </p>
            <button
              type="button"
              className="px-5 py-2.5 bg-orange-400 hover:bg-orange-500 text-white font-medium rounded-lg transition-colors shadow-sm text-sm"
            >
              Completar perfil &rarr;
            </button>
          </div>
        ) : (
          <svg
            viewBox="0 0 400 400"
            className="w-[400px] h-[400px] overflow-visible select-none"
          >
            {[0.25, 0.5, 0.75, 1].map((level) => {
              const gridPoints = AXIS_ORDER.map((_, i) => {
                const coords = getCoordinates(i, level);
                return `${coords.x},${coords.y}`;
              }).join(' ');
              return (
                <polygon
                  key={level}
                  points={gridPoints}
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  strokeDasharray={level === 1 ? undefined : '3 3'}
                />
              );
            })}

            {AXIS_ORDER.map((axis, i) => {
              const coords = getCoordinates(i, 1);
              const isSelected = selectedArea === axis;
              return (
                <line
                  key={`line-${axis}`}
                  x1={center}
                  y1={center}
                  x2={coords.x}
                  y2={coords.y}
                  stroke={isSelected ? '#EF4444' : '#E5E7EB'}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  className="transition-all duration-200"
                />
              );
            })}

            <polygon
              points={polygonPoints}
              fill="rgba(239, 68, 68, 0.15)"
              stroke="#EF4444"
              strokeWidth="2"
            />

            {normalizedData.map((d, i) => {
              const coords = getCoordinates(i, d.value / 100);
              const isSelected = selectedArea === d.area;
              return (
                <g
                  key={`point-${d.area}`}
                  className="cursor-pointer"
                  onClick={() => handleAxisClick(d.area)}
                >
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={isSelected ? 7 : 5}
                    fill={isSelected ? '#EF4444' : '#C53030'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all duration-200 hover:scale-125"
                  />
                </g>
              );
            })}

            {normalizedData.map((d, i) => {
              const labelCoords = getCoordinates(i, 1.28);
              const isSelected = selectedArea === d.area;

              return (
                <foreignObject
                  key={`label-${d.area}`}
                  x={labelCoords.x - 75}
                  y={labelCoords.y - 25}
                  width="150"
                  height="65"
                  className="overflow-visible"
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <button
                      type="button"
                      onClick={() => handleAxisClick(d.area)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border max-w-[140px] leading-tight ${
                        isSelected
                          ? 'bg-gray-900 text-white border-gray-900 ring-2 ring-red-500/50'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="truncate">{d.area}</span>
                      <span
                        className={
                          isSelected ? 'text-red-400 font-bold' : 'text-gray-500'
                        }
                      >
                        {d.value}%
                      </span>
                    </button>

                    {isSelected && (
                      <span className="mt-1 text-[9px] font-extrabold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 uppercase tracking-tighter whitespace-nowrap animate-pulse">
                        AREA SELECCIONADA
                      </span>
                    )}
                  </div>
                </foreignObject>
              );
            })}
          </svg>
        )}
      </div>

      {hasData && (
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="bg-orange-50/50 p-3.5 rounded-xl border border-orange-100/60">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Areas con mayor afinidad identificadas:
            </p>
            <div className="flex flex-wrap gap-2">
              {topAreas.map((area, idx) => (
                <span
                  key={area.area}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all ${
                    idx === 0
                      ? 'bg-orange-500 text-white border-orange-500 font-semibold shadow-xs'
                      : 'bg-gray-800 text-white border-gray-800'
                  }`}
                >
                  {idx + 1}. {area.area} ({area.value}%)
                </span>
              ))}
            </div>
          </div>

          <div className="p-1 space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Palabras clave mas influyentes:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-xs px-2.5 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-md font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};