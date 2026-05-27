import { format, formatDistanceToNow, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), "yyyy-MM-dd HH:mm", { locale: zhCN });
}

export function formatDate(iso: string): string {
  return format(parseISO(iso), "yyyy-MM-dd", { locale: zhCN });
}

export function formatRelativeTime(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: zhCN });
}

export function formatXp(xp: number): string {
  if (xp >= 10000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toLocaleString();
}

export function formatPercent(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}
