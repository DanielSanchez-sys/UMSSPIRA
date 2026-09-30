'use client';

import React from 'react';
import { useAffinityCalculation } from '../hooks/use-affinity-calculation';
import { ProgressBar } from './progress-bar';
import { Spinner } from './spinner';
import { ErrorAlert } from './error-alert';
import { Calculator, Sparkles, RefreshCw } from 'lucide-react';

export const AffinityCalculator: React.FC = () => {
  const { data, isLoading, error, calculate, retry, reset } = useAffinityCalculation();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <span>Cálculo de Vectores de Afinidad (HU-8)</span>
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Solicita el cálculo dinámico y gestiona los estados de carga, error y reintento.
          </p>
        </div>
      </div>

      {/* Estado 1: Botón Inicial para Solicitar Cálculo */}
      {!isLoading && !data && !error && (
        <div className="text-center py-8 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 p-6">
          <Sparkles className="w-10 h-10 text-blue-500 mx-auto mb-3 animate-bounce" />
          <h3 className="text-base font-semibold text-slate-800">Cálculo de Afinidad Pendiente</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
            Presione el botón para iniciar el cálculo del perfil con el modelo de IA y procesar las 6 áreas técnicas.
          </p>
          <button
            onClick={() => calculate()}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all transform hover:-translate-y-0.5"
          >
            <Calculator className="w-4 h-4" />
            <span>Solicitar Cálculo de Afinidad</span>
          </button>
        </div>
      )}

      {/* Estado 2: Estado de Carga (Spinner) */}
      {isLoading && (
        <div className="py-12 bg-blue-50/40 rounded-lg border border-blue-100 flex flex-col items-center justify-center space-y-3" role="status">
          <Spinner size="lg" text="Calculando vectores de afinidad en tiempo real..." />
          <p className="text-xs text-slate-400">Por favor espere mientras procesamos las métricas...</p>
        </div>
      )}

      {/* Estado 3: Estado de Error + Reintento */}
      {error && !isLoading && (
        <div className="space-y-4">
          <ErrorAlert
            title="Fallo al procesar el cálculo"
            message={error}
            onRetry={retry}
            isRetrying={isLoading}
          />
        </div>
      )}

      {/* Estado 4: Estado Exitoso (Resultados Calculados con ProgressBars de la Tarea #7) */}
      {data && !isLoading && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-sm">
            <span className="font-semibold flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Cálculo completado exitosamente</span>
            </span>
            <span className="text-xs font-mono text-emerald-600">
              {new Date(data.calculatedAt).toLocaleTimeString()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {data.areas.map((item) => (
              <div key={item.area} className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <ProgressBar label={item.area} value={item.affinity} />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <button
              onClick={reset}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              Limpiar resultados
            </button>
            <button
              onClick={() => calculate()}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Recalcular</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
