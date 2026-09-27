import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const COLOMBO_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

type PlatformDateParts = {
  year: number;
  month: number;
  day: number;
  weekday: number;
  hour: number;
  minute: number;
};

function getPlatformDateParts(value: string): PlatformDateParts | undefined {
  // Date-only and datetime-local values represent Sri Lankan wall time already.
  const local = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?)?$/.exec(value);
  if (local) {
    const year = Number(local[1]);
    const month = Number(local[2]);
    const day = Number(local[3]);
    return {
      year,
      month,
      day,
      weekday: new Date(Date.UTC(year, month - 1, day)).getUTCDay(),
      hour: Number(local[4] ?? 0),
      minute: Number(local[5] ?? 0),
    };
  }

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return undefined;
  const colomboDate = new Date(timestamp + COLOMBO_OFFSET_MS);
  return {
    year: colomboDate.getUTCFullYear(),
    month: colomboDate.getUTCMonth() + 1,
    day: colomboDate.getUTCDate(),
    weekday: colomboDate.getUTCDay(),
    hour: colomboDate.getUTCHours(),
    minute: colomboDate.getUTCMinutes(),
  };
}

function formatTime(parts: PlatformDateParts) {
  const hour = parts.hour % 12 || 12;
  return `${hour}:${String(parts.minute).padStart(2, "0")} ${parts.hour < 12 ? "AM" : "PM"}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEventDate(date: string) {
  const parts = getPlatformDateParts(date);
  if (!parts) return "Date unavailable";
  return `${WEEKDAYS_SHORT[parts.weekday]}, ${MONTHS_SHORT[parts.month - 1]} ${parts.day} · ${formatTime(parts)}`;
}

export function formatDateTime(date: string) {
  const parts = getPlatformDateParts(date);
  if (!parts) return "Date unavailable";
  return `${parts.day} ${MONTHS_SHORT[parts.month - 1]} ${parts.year} · ${formatTime(parts)}`;
}

export function formatShortDate(date: string) {
  const parts = getPlatformDateParts(date);
  if (!parts) return "Date unavailable";
  return `${parts.day} ${MONTHS_SHORT[parts.month - 1]} ${parts.year}`;
}

export function formatDayMonth(date: string) {
  const parts = getPlatformDateParts(date);
  if (!parts) return "Date unavailable";
  return `${String(parts.day).padStart(2, "0")} ${MONTHS_SHORT[parts.month - 1]}`;
}

export function formatCalendarDay(date: string) {
  const parts = getPlatformDateParts(date);
  if (!parts) return { day: "—", month: "" };
  return { day: String(parts.day), month: MONTHS_SHORT[parts.month - 1] };
}

export function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "0";
  const sign = value < 0 ? "-" : "";
  const [whole, decimal] = String(Math.abs(value)).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}${grouped}${decimal ? `.${decimal}` : ""}`;
}

export function titleCase(value: string) {
  return value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
