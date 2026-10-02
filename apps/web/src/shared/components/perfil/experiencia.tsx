'use client';

import { useState } from 'react';

export type Experiencia = {
  empresa: string;
  cargo: string;
  periodo: string;
};

const VACIO: Experiencia = { empresa: '', cargo: '', periodo: '' };

const CAMPOS: { nombre: keyof Experiencia; etiqueta: string; ejemplo: string }[] = [
  { nombre: 'empresa', etiqueta: 'Empresa', ejemplo: 'Ej. Jalasoft' },
  { nombre: 'cargo', etiqueta: 'Cargo', ejemplo: 'Ej. Desarrollador Frontend' },
  { nombre: 'periodo', etiqueta: 'Periodo', ejemplo: 'Ej. 2022 - 2024' },
];

export function FormularioExperiencia() {
  const [datos, setDatos] = useState<Experiencia>(VACIO);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-3">
        {CAMPOS.map((campo) => (
          <label key={campo.nombre} className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-[#1B2632]">
              {campo.etiqueta} <span className="text-[#A35139]">*</span>
            </span>
            <input
              type="text"
              value={datos[campo.nombre]}
              onChange={(e) => setDatos({ ...datos, [campo.nombre]: e.target.value })}
              placeholder={campo.ejemplo}
              className="h-11 rounded-lg border border-[#C9C1B1] bg-[#EEE9DF] px-3 text-sm text-[#1B2632] outline-none placeholder:text-[#2C3B4D]/40 focus:border-2 focus:border-[#2C3B4D] focus:bg-white"
            />
          </label>
        ))}
      </div>
    </div>
  );
}