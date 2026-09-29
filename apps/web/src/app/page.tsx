import React from 'react';
import { ProgressBar } from '@/shared/components/progress-bar';
import { formatPercentage, clampPercentage } from '@/shared/utils/percentage';
import { AffinityCalculator } from '@/shared/components/affinity-calculator';
import affinityMock from '@/shared/mocks/affinity-vector-mock.json';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-bold text-slate-900">UMSSPIRA - Demostración de Requerimientos #7 y #8</h1>
          <p className="text-slate-600 mt-1">
            Manejo de estados de carga/error (HU-8) y redondeo/clamp de porcentajes (HU-7).
          </p>
        </header>

        {/* Sección 1: Calculador Interactivo con Spinner, Error y Reintento (HU-8) */}
        <section>
          <AffinityCalculator />
        </section>

        {/* Sección 2: Pruebas de Resguardo (Clamp & Edge Cases - HU-7) */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Pruebas de Resguardo (Edge Cases & Visual Clamp - HU-7)</h2>
          <p className="text-sm text-slate-500">
            Demostración de resguardo ante valores fuera de rango (-15%, 125%) o tipos no válidos (null, NaN).
          </p>

          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Entrada: <code className="font-mono text-red-600">-15.5</code> (Valor menor a 0)</span>
                <span>Procesado: <strong className="font-mono">{formatPercentage(-15.5)}</strong> (Clamped: {clampPercentage(-15.5)})</span>
              </div>
              <ProgressBar value={-15.5} label="Valor Negativo (-15.5)" />
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Entrada: <code className="font-mono text-amber-600">125.8</code> (Valor mayor a 100)</span>
                <span>Procesado: <strong className="font-mono">{formatPercentage(125.8)}</strong> (Clamped: {clampPercentage(125.8)})</span>
              </div>
              <ProgressBar value={125.8} label="Valor Sobregirado (125.8)" />
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Entrada: <code className="font-mono text-purple-600">null / undefined / NaN</code></span>
                <span>Procesado: <strong className="font-mono">{formatPercentage(null)}</strong> (Clamped: {clampPercentage(null)})</span>
              </div>
              <ProgressBar value={null} label="Valor Nulo/Inválido" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
