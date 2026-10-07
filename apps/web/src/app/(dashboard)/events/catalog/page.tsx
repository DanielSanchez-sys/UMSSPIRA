'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { CalendarDays, ChevronDown, Search } from 'lucide-react';

import EventCard from '@/shared/components/event-card';
import { getEventCatalog } from '@/shared/services/events-service';
import type { EventItem } from '@umsspira/shared-types';

type SortOrder = 'nearest' | 'furthest';

export default function EventsCatalogPage() {
  const [catalogEvents, setCatalogEvents] = useState<EventItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('nearest');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCatalog() {
      try {
        const events = await getEventCatalog();

        if (isMounted) {
          setCatalogEvents(events);
          setErrorMessage(null);
        }
      } catch {
        if (isMounted) {
          setErrorMessage(
            'No se pudo cargar el catálogo de eventos. Intenta nuevamente más tarde.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedSearch(searchTerm.trim());
    setDateFilter(selectedMonth || 'all');
  }

  const visibleEvents = useMemo(() => {
    const normalizedSearch = appliedSearch.toLocaleLowerCase('es');
    const filteredEvents = catalogEvents.filter((event) => {
      const searchableText = [
        event.title,
        event.description ?? '',
        event.location ?? '',
      ]
        .join(' ')
        .toLowerCase();
      const eventMonth = event.startDate.slice(0, 7);
      const matchesSearch = searchableText.includes(normalizedSearch);
      const matchesDate = dateFilter === 'all' || eventMonth === dateFilter;

      return matchesSearch && matchesDate;
    });

    return [...filteredEvents].sort((firstEvent, secondEvent) => {
      const firstDate = new Date(firstEvent.startDate).getTime();
      const secondDate = new Date(secondEvent.startDate).getTime();

      return sortOrder === 'furthest'
        ? secondDate - firstDate
        : firstDate - secondDate;
    });
  }, [appliedSearch, catalogEvents, dateFilter, sortOrder]);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#EEE9DF] px-4 py-7 text-[#2C3B4D] sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-[1440px] min-w-0">
        <div className="mb-6 sm:mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#A35139]">
            Catálogo
          </p>
          <h1
            className="break-words text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Eventos universitarios
          </h1>
          <p className="mt-2 text-sm text-[#2C3B4D]/75 sm:text-base">
            Descubre actividades, talleres y encuentros de la comunidad UMSS.
          </p>
        </div>

        <form
          aria-label="Filtros del catálogo"
          onSubmit={applySearch}
          className="mb-6 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_minmax(180px,220px)_minmax(180px,220px)_120px]"
        >
          <label className="flex h-12 min-w-0 items-center gap-3 rounded-md border border-[#C9C1B1] bg-white/70 px-3 text-sm text-[#2C3B4D]/60 shadow-sm sm:col-span-2 xl:col-span-1">
            <Search size={17} aria-hidden="true" className="shrink-0" />
            <span className="sr-only">Buscar eventos</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar eventos..."
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-[#2C3B4D]/50"
            />
          </label>

          <label className="relative flex h-12 min-w-0 items-center gap-2 rounded-md border border-[#C9C1B1] bg-white/70 px-3 text-sm text-[#2C3B4D]/75 shadow-sm">
            <CalendarDays size={17} aria-hidden="true" className="shrink-0 text-[#A35139]" />
            <span className="sr-only">Filtrar por mes</span>
            <input
              type="month"
              aria-label="Filtrar por mes"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="w-full min-w-0 bg-transparent text-sm outline-none"
            />
          </label>

          <label className="relative flex h-12 min-w-0 items-center gap-2 rounded-md border border-[#C9C1B1] bg-white/70 px-3 text-sm text-[#2C3B4D]/75 shadow-sm">
            <span className="sr-only">Ordenar eventos</span>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as SortOrder)}
              className="w-full min-w-0 appearance-none bg-transparent pr-5 text-sm outline-none"
            >
              <option value="nearest">Fecha más próxima</option>
              <option value="furthest">Fecha más lejana</option>
            </select>
            <ChevronDown size={15} className="pointer-events-none absolute right-3 shrink-0" aria-hidden="true" />
          </label>

          <button
            type="button"
            onClick={() => {
              setAppliedSearch(searchTerm.trim());
              setDateFilter(selectedMonth || 'all');
            }}
            className="inline-flex h-12 w-full min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#FFB162] px-4 text-sm font-semibold text-[#2C3B4D] shadow-sm transition-colors hover:bg-[#f5a351]"
          >
            <Search size={16} aria-hidden="true" />
            <span>Buscar</span>
          </button>
        </form>

        {isLoading ? (
          <p className="py-16 text-center text-sm text-[#2C3B4D]/70" role="status">
            Cargando eventos...
          </p>
        ) : errorMessage ? (
          <div
            className="rounded-xl border border-[#A35139]/30 bg-white/50 px-6 py-16 text-center"
            role="alert"
          >
            <p className="text-sm font-semibold text-[#A35139]">{errorMessage}</p>
          </div>
        ) : visibleEvents.length > 0 ? (
          <>
            <p className="mb-7 text-xs font-semibold text-[#2C3B4D]/70">
              {visibleEvents.length} eventos disponibles
            </p>
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
              {visibleEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
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
