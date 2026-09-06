/** 纯函数：把 "2026-09-01 09:00:00" / Date 串 格式化为 2026.09.01 */
export function formatDate(input?: string): string {
  if (!input) return "";
  const d = new Date(input.includes(" ") ? input.replace(" ", "T") : input);
  if (isNaN(d.getTime())) return input;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hm =
    input.includes(":") && !input.endsWith(":00")
      ? ` ${d.getHours().toString().padStart(2, "0")}:${d
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      : "";
  return `${y}.${m}.${day}${hm}`;
}
