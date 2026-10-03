'use client';

import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

import EventCard from '@/shared/components/event-card';
import type { EventItem } from '@umsspira/shared-types';

type SortOrder = 'nearest' | 'furthest';

const catalogEvents: EventItem[] = [];

export default function EventsCatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('nearest');

  return (
    <main className="min-h-screen bg-[#EEE9DF] px-5 py-10 text-[#2C3B4D] sm:px-8 lg:px-16 lg:py-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#A35139]">
            Catálogo
          </p>
          <h1
            className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Eventos universitarios
          </h1>
          <p className="mt-2 text-sm text-[#2C3B4D]/75 sm:text-base">
            Descubre actividades, talleres y encuentros de la comunidad UMSS.
          </p>
        </div>

        <section
          aria-label="Filtros del catálogo"
          className="mb-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_100px_minmax(180px,205px)]"
        >
          <label className="flex h-12 items-center gap-3 rounded-md border border-[#C9C1B1] bg-white/50 px-4 text-sm text-[#2C3B4D]/60 shadow-sm">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Buscar eventos</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar eventos por nombre o palabra clave..."
              className="w-full bg-transparent outline-none placeholder:text-[#2C3B4D]/50"
            />
          </label>

          <label className="relative flex h-12 items-center rounded-md border border-[#C9C1B1] bg-white/50 px-4 text-sm text-[#2C3B4D]/75 shadow-sm">
            <span className="sr-only">Filtrar por fecha</span>
            <select
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="w-full appearance-none bg-transparent outline-none"
            >
              <option value="all">Todas las fechas</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
            </select>
            <ChevronDown size={15} className="pointer-events-none absolute right-3" aria-hidden="true" />
          </label>

          <button
            type="button"
            onClick={() => setSearchTerm(searchTerm.trim())}
            className="h-12 rounded-md bg-[#FFB162] px-5 text-sm font-semibold text-[#2C3B4D] shadow-sm transition-colors hover:bg-[#f5a351]"
          >
            Buscar
          </button>

          <label className="relative flex h-12 items-center rounded-md border border-[#C9C1B1] bg-white/50 px-4 text-sm text-[#2C3B4D]/75 shadow-sm">
            <span className="sr-only">Ordenar eventos</span>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as SortOrder)}
              className="w-full appearance-none bg-transparent outline-none"
            >
              <option value="nearest">Ordenar: fecha más próxima</option>
              <option value="furthest">Ordenar: fecha más lejana</option>
            </select>
            <ChevronDown size={15} className="pointer-events-none absolute right-3" aria-hidden="true" />
          </label>
        </section>

        <p className="mb-7 text-xs font-semibold text-[#2C3B4D]/70">
          {catalogEvents.length} eventos disponibles
        </p>

        {catalogEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {catalogEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#C9C1B1] bg-white/40 px-6 py-16 text-center">
            <p className="text-sm font-semibold">No encontramos eventos</p>
            <p className="mt-2 text-sm text-[#2C3B4D]/65">
              El catálogo estará disponible cuando existan eventos publicados.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}