'use client';

import React from 'react';
import { Building2, Download, ShieldCheck } from 'lucide-react';

export const SiteFooter: React.FC = () => {
  return (
    <footer className="bg-abyssal-blue text-white mt-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gradient-to-r from-blue-fantastic to-abyssal-blue p-6 sm:p-8 rounded-2xl border border-slate-700/60 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-truffle-trouble/20 text-burning-flame border border-truffle-trouble/40 text-[10px] font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>CONVENIOS EMPRESARIALES FCYT</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                ¿Buscas contratar cohortes completas de graduados o formular pasantías institucionales?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                La Dirección de Interacción Social y la Unidad de Titulación FCyT coordinan procesos de selección directa y validación personalizada de competencias técnicas para empresas aliadas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button className="px-5 py-2.5 bg-truffle-trouble hover:bg-truffle-trouble/90 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2">
                <Building2 className="w-4 h-4" />
                <span>Solicitar Alianza Corporativa</span>
              </button>
              <button className="px-5 py-2.5 bg-abyssal-blue border border-slate-600 hover:bg-slate-800 text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center space-x-2">
                <Download className="w-4 h-4 text-slate-400" />
                <span>Descargar Guía de Validación SIS</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-burning-flame text-abyssal-blue font-black flex items-center justify-center text-xs">
              U
            </div>
            <span className="font-bold text-slate-200">UMSSPIRA</span>
            <span>• Universidad Mayor de San Simón • FCyT</span>
          </div>

          <p className="text-[11px] font-mono">
            © 2026 UMSSPIRA. Sistema de compatibilidad SIG-MATCH e Inteligencia de Competencias.
          </p>
        </div>
      </div>
    </footer>
  );
};
