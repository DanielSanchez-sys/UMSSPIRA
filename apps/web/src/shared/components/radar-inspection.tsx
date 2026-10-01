"use client";

import React, { useState } from "react";
import mockData from "../mocks/affinity-vector-mock.json";
import { formatPercentage } from "@/shared/utils/percentage";

interface AreaData {
  area: string;
  affinity: number;
  certifications?: string[];
  projects?: string[];
}

interface RadarInspectionProps {
  selectedAreaId?: string | null;
  onSelectArea?: (area: AreaData) => void;
}

export default function RadarInspection({ selectedAreaId, onSelectArea }: RadarInspectionProps) {
  const areas: AreaData[] = mockData.areas || [];
  const [internalSelectedArea, setInternalSelectedArea] = useState<AreaData | null>(null);

  const selectedArea = internalSelectedArea;

  // Estado vacío obligatorio exigido por la HU2
  if (!areas || areas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-gray-500 bg-white shadow-sm">
        <p className="text-lg font-medium mb-2">Sin datos de historial laboral</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Completar perfil
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      {/* Panel izquierdo: Resumen de las 6 áreas con barras de progreso */}
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Resumen de Afinidad por Área</h3>
        <p className="text-sm text-gray-500">Haz clic en un área para inspeccionar sus respaldos</p>
        
        <div className="space-y-3">
          {areas.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setInternalSelectedArea(item);
                if (onSelectArea) onSelectArea(item);
              }}
              className={`p-3 border rounded-lg cursor-pointer transition ${
                selectedArea?.area === item.area ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-700 capitalize">{item.area.replace("-", " ")}</span>
                <span className="text-sm font-semibold text-blue-600">{formatPercentage(item.affinity)}</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${item.affinity}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho: Inspección detallada y respaldos */}
      <div className="flex flex-col p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Respaldos e Inspección</h3>
        
        {selectedArea ? (
          <div className="space-y-4">
            <h4 className="text-md font-bold text-blue-700 capitalize">
              Área: {selectedArea.area.replace("-", " ")}
            </h4>
            
            <div>
              <h5 className="font-semibold text-sm text-gray-700 mb-1">Certificaciones:</h5>
              {selectedArea.certifications && selectedArea.certifications.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {selectedArea.certifications.map((cert, idx) => (
                    <li key={idx}>{cert}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">No hay certificaciones registradas para esta área.</p>
              )}
            </div>

            <div>
              <h5 className="font-semibold text-sm text-gray-700 mb-1">Proyectos:</h5>
              {selectedArea.projects && selectedArea.projects.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {selectedArea.projects.map((proj, idx) => (
                    <li key={idx}>{proj}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">No hay proyectos registrados para esta área.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
            <p className="text-sm text-center">Haz clic en un área para inspeccionar sus respaldos.</p>
          </div>
        )}
      </div>
    </div>
  );
}