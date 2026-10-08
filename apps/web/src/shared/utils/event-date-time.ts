import {
  EVENT_DATE_MAX_YEAR,
  EVENT_DATE_MIN_YEAR,
} from '@umsspira/shared-types';

const eventDateFormatter = new Intl.DateTimeFormat('es-BO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const eventTimeFormatter = new Intl.DateTimeFormat('es-BO', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const eventDateTimeFormatter = new Intl.DateTimeFormat('es-BO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const eventMonthFormatter = new Intl.DateTimeFormat('es-BO', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function toEventIsoDateTime(date: string, time: string): string {
  const localDateTime = new Date(`${date}T${time}:00`);

  if (Number.isNaN(localDateTime.getTime())) {
    return `${date}T${time}:00`;
  }

  return localDateTime.toISOString();
}

export function isEventInputDateValid(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return false;

  const [, yearValue, monthValue, dayValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);

  if (year < EVENT_DATE_MIN_YEAR || year > EVENT_DATE_MAX_YEAR) {
    return false;
  }

  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year
    && date.getMonth() === month - 1
    && date.getDate() === day;
}

export function toDateTimeInputParts(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    const [date = '', time = ''] = value.split('T');
    return {
      date,
      time: time.slice(0, 5),
    };
  }

  const date = [
    parsedDate.getFullYear(),
    String(parsedDate.getMonth() + 1).padStart(2, '0'),
    String(parsedDate.getDate()).padStart(2, '0'),
  ].join('-');
  const time = [
    String(parsedDate.getHours()).padStart(2, '0'),
    String(parsedDate.getMinutes()).padStart(2, '0'),
  ].join(':');

  return { date, time };
}

export function formatEventInputSchedule(
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string,
): string {
  if (!startDate) return 'Fecha por definir';

  const formattedStartDate = formatInputDate(startDate);
  const formattedStartTime = startTime || 'Hora por definir';

  if (endDate && endDate !== startDate) {
    return `${formattedStartDate} · ${formattedStartTime} / ${formatInputDate(endDate)} · ${endTime || 'Hora por definir'}`;
  }

  return `${formattedStartDate} · ${formattedStartTime}${endTime ? `–${endTime}` : ''}`;
}

export function formatEventSchedule(
  startValue: string,
  endValue: string,
): string {
  const start = new Date(startValue);
  const end = new Date(endValue);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return 'Horario no disponible';
  }

  if (getLocalDateKey(start) === getLocalDateKey(end)) {
    return `${eventDateFormatter.format(start)} · ${eventTimeFormatter.format(start)}–${eventTimeFormatter.format(end)}`;
  }

  return `${eventDateFormatter.format(start)} · ${eventTimeFormatter.format(start)} / ${eventDateFormatter.format(end)} · ${eventTimeFormatter.format(end)}`;
}

export function formatEventDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Fecha no disponible'
    : eventDateFormatter.format(date);
}

export function formatEventDateTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Fecha no disponible'
    : eventDateTimeFormatter.format(date);
}

export function formatEventMonth(value: string): string {
  const month = new Date(`${value}-01T00:00:00Z`);
  return Number.isNaN(month.getTime())
    ? value
    : eventMonthFormatter.format(month);
}

export function getEventMonthKey(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 7);
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
  ].join('-');
}

function getLocalDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function formatInputDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  const monthNames = [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dic',
  ];

  return `${String(day).padStart(2, '0')} ${monthNames[month - 1] ?? ''} ${year}`;
}
