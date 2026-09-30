'use client';

import React, { useState } from 'react';
import { AffinityAreaScore } from '@umsspira/shared-types/src/affinity';

export interface AffinityRadarProps {
  data?: AffinityAreaScore[];
  selectedArea?: string | null;
  onSelectArea?: (areaId: string | null) => void;
  keywords?: string[];
  className?: string;
}

const AREA_LABELS: Record<string, string> = {
  'software-development': 'Desarrollo de Software',
  'cloud-devops': 'Cloud & DevOps',
  'cybersecurity': 'Ciberseguridad',
  'data-ai': 'Datos e IA',
  'it-governance': 'Gestión de TI',
  'infrastructure': 'Infraestructura',
};

const DEFAULT_AXES = [
  'software-development',
  'cloud-devops',
  'cybersecurity',
  'data-ai',
  'it-governance',
  'infrastructure',
];

export const AffinityRadar: React.FC<AffinityRadarProps> = ({
  data = [],
  selectedArea = null,
  onSelectArea,
  keywords = [],
  className = '',
}) => {
  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  const activeArea = selectedArea !== undefined ? selectedArea : internalSelected;

  const hasData = Boolean(data && data.length > 0);

  const normalizedData = DEFAULT_AXES.map((axisId) => {
    const item = data.find((d) => d.area === axisId || (d as unknown as Record<string, string>).areaId === axisId);
    return {
      id: axisId,
      label: AREA_LABELS[axisId] || axisId,
      affinity: item ? item.affinity : 0,
    };
  });

  const handleAreaClick = (areaId: string) => {
    const next = activeArea === areaId ? null : areaId;
    if (onSelectArea) {
      onSelectArea(next);
    } else {
      setInternalSelected(next);
    }
  };

  const topAreas = [...normalizedData]
    .sort((a, b) => b.affinity - a.affinity)
    .filter((a) => a.affinity > 0)
    .slice(0, 2);

  const size = 360;
  const center = size / 2;
  const radius = 120;
  const totalAxes = DEFAULT_AXES.length;
  const angleStep = (2 * Math.PI) / totalAxes;

  const points = normalizedData
    .map((d, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (d.affinity / 100) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className={`w-full max-w-md mx-auto bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Radar de Afinidad</h3>
        <p className="text-xs text-gray-500">
          Evaluación de afinidad técnica para tu perfil de Titulado.
        </p>
      </div>

      <div className="relative flex justify-center items-center">
        {!hasData ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-orange-50 rounded-full flex items-center justify-center text-orange-500 font-bold text-xl">
              🎯
            </div>
            <p className="text-sm font-medium text-gray-600">
              Aún no tienes un perfil de afinidad generado.
            </p>
            <button className="px-4 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors">
              Completar perfil
            </button>
          </div>
        ) : (
          <svg width={size} height={size} className="overflow-visible">
            {[0.25, 0.5, 0.75, 1].map((level) => {
              const gridPoints = DEFAULT_AXES
                .map((_, i) => {
                  const angle = i * angleStep - Math.PI / 2;
                  const r = radius * level;
                  return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
                })
                .join(' ');
              return (
                <polygon
                  key={level}
                  points={gridPoints}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray={level === 1 ? 'none' : '3 3'}
                />
              );
            })}

            {normalizedData.map((d, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const x2 = center + radius * Math.cos(angle);
              const y2 = center + radius * Math.sin(angle);

              const labelRadius = radius + 28;
              const lx = center + labelRadius * Math.cos(angle);
              const ly = center + labelRadius * Math.sin(angle);

              const isSelected = activeArea === d.id;

              return (
                <g key={d.id} className="cursor-pointer" onClick={() => handleAreaClick(d.id)}>
                  <line
                    x1={center}
                    y1={center}
                    x2={x2}
                    y2={y2}
                    stroke={isSelected ? '#f97316' : '#d1d5db'}
                    strokeWidth={isSelected ? '2.5' : '1'}
                    className="transition-all duration-200"
                  />
                  <foreignObject
                    x={lx - 55}
                    y={ly - 14}
                    width="110"
                    height="32"
                    className="overflow-visible"
                  >
                    <div
                      className={`text-center text-[11px] leading-tight font-medium px-1 py-0.5 rounded transition-all ${
                        isSelected
                          ? 'bg-orange-500 text-white font-bold shadow-sm'
                          : 'text-gray-600 hover:text-orange-600'
                      }`}
                    >
                      {d.label}
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            <polygon
              points={points}
              fill="rgba(249, 115, 22, 0.25)"
              stroke="#f97316"
              strokeWidth="2"
              className="transition-all duration-300"
            />

            {normalizedData.map((d, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const r = (d.affinity / 100) * radius;
              const cx = center + r * Math.cos(angle);
              const cy = center + r * Math.sin(angle);
              const isSelected = activeArea === d.id;

              return (
                <g key={d.id} className="cursor-pointer" onClick={() => handleAreaClick(d.id)}>
                  <circle cx={cx} cy={cy} r="12" fill="transparent" />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 6 : 4}
                    fill={isSelected ? '#ea580c' : '#f97316'}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-transform duration-200 hover:scale-125 [transform-box:fill-box] origin-center"
                  />
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {hasData && activeArea && (
        <div className="mt-4 p-2.5 bg-orange-100/70 border border-orange-300 rounded-lg text-center">
          <span className="text-xs font-bold text-orange-800 tracking-wide uppercase">
            ÁREA SELECCIONADA (CLICK):{' '}
            <span className="text-orange-950 font-extrabold">
              {AREA_LABELS[activeArea] || activeArea}
            </span>
          </span>
        </div>
      )}

      {hasData && topAreas.length > 0 && (
        <div className="space-y-4 pt-4 mt-4 border-t border-gray-100">
          <div className="bg-orange-50/50 p-3.5 rounded-xl border border-orange-100/60">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Áreas con mayor afinidad identificadas:
            </p>
            <div className="flex flex-wrap gap-2">
              {topAreas.map((area, idx) => (
                <span
                  key={area.id}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all ${
                    idx === 0
                      ? 'bg-orange-500 text-white border-orange-500 font-semibold shadow-xs'
                      : 'bg-gray-800 text-white border-gray-800'
                  }`}
                >
                  {area.label} ({area.affinity}%)
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {hasData && keywords.length > 0 && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
            Palabras clave más influyentes:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw, i) => (
              <span
                key={i}
                className="text-[11px] bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AffinityRadar;