import { format, formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

export function formatDate(date: Date | string, formatStr = "yyyy-MM-dd HH:mm:ss") {
  return format(new Date(date), formatStr, { locale: zhCN });
}

export function formatRelativeTime(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: zhCN });
}
