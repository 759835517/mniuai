import { format, formatDistanceToNow, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

function parseSafeDate(iso?: string | null): Date | null {
  if (!iso) return null;
  const date = parseISO(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTime(iso?: string | null): string {
  const date = parseSafeDate(iso);
  return date ? format(date, "yyyy-MM-dd HH:mm", { locale: zhCN }) : "";
}

export function formatDate(iso?: string | null): string {
  const date = parseSafeDate(iso);
  return date ? format(date, "yyyy-MM-dd", { locale: zhCN }) : "";
}

export function formatRelativeTime(iso?: string | null): string {
  const date = parseSafeDate(iso);
  if (!date) return "";
  return formatDistanceToNow(date, { addSuffix: true, locale: zhCN });
}

export function formatXp(xp: number): string {
  if (xp >= 10000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toLocaleString();
}

export function formatPercent(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}
