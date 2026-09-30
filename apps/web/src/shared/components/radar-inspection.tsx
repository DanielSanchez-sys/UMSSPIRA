"use client";

import React, { useState } from "react";
import mockData from "../mocks/affinity-vector-mock.json";

interface AreaData {
  area: string;
  affinity: number;
}

export default function RadarInspection() {
  const areas: AreaData[] = mockData.areas || [];
  const [selectedArea, setSelectedArea] = useState<AreaData | null>(null);

  if (!areas || areas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-gray-500">
        <p className="text-lg font-medium">No hay habilidades registradas en el radar</p>
        <p className="text-sm">Completa tu perfil para visualizar las métricas de afinidad.</p>
      </div>
    );
  }

  const center = 150;
  const radius = 100;
  const angleStep = (Math.PI * 2) / areas.length;

  const points = areas.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (item.affinity / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, item };
  });

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Gráfico Radial de Afinidad</h3>
        <svg width="300" height="300" className="overflow-visible">
          {[0.33, 0.66, 1].map((level, idx) => (
            <circle
              key={idx}
              cx={center}
              cy={center}
              r={radius * level}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {points.map((p, idx) => {
            const angle = idx * angleStep - Math.PI / 2;
            const endX = center + radius * Math.cos(angle);
            const endY = center + radius * Math.sin(angle);
            const isSelected = selectedArea?.area === p.item.area;

            return (
              <g key={idx}>
                <line
                  x1={center}
                  y1={center}
                  x2={endX}
                  y2={endY}
                  stroke={isSelected ? "#ea580c" : "#d1d5db"}
                  strokeWidth={isSelected ? "3" : "1"}
                  className="cursor-pointer transition-colors"
                  onClick={() => setSelectedArea(p.item)}
                />
                <text
                  x={endX * 1.15}
                  y={endY * 1.15}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`text-xs cursor-pointer font-medium ${
                    isSelected ? "fill-orange-600 font-bold" : "fill-gray-600"
                  }`}
                  onClick={() => setSelectedArea(p.item)}
                >
                  {p.item.area}
                </text>
              </g>
            );
          })}

          <polygon
            points={polygonPoints}
            fill="rgba(59, 130, 246, 0.3)"
            stroke="#3b82f6"
            strokeWidth="2"
          />

          {points.map((p, idx) => {
            const isSelected = selectedArea?.area === p.item.area;
            return (
              <circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r={isSelected ? "6" : "4"}
                fill={isSelected ? "#ea580c" : "#2563eb"}
                className="cursor-pointer transition-all"
                onClick={() => setSelectedArea(p.item)}
              />
            );
          })}
        </svg>
      </div>

      <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l pl-0 md:pl-6 pt-4 md:pt-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Panel de Inspección</h3>
          {selectedArea ? (
            <div className="space-y-4">
              <div className="inline-block bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-1 rounded">
                ÁREA SELECCIONADA (CLICK)
              </div>
              <div>
                <p className="text-sm text-gray-500">Área de Afinidad:</p>
                <p className="text-xl font-bold text-gray-900 capitalize">{selectedArea.area.replace("-", " ")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Puntaje:</p>
                <p className="text-2xl font-black text-blue-600">{selectedArea.affinity}%</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic mt-4">
              Haz clic en cualquier vértice, línea o etiqueta del gráfico para inspeccionar los detalles.
            </p>
          )}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Resumen Cuantitativo</p>
          <p className="text-xs text-gray-500 mt-1">Basado en el vector de afinidad del mock.</p>
        </div>
      </div>
    </div>
  );
}