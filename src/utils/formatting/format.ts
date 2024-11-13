export function formatDate(dateStr: string) {
  const date = new Date(dateStr);

  // 날짜를 원하는 형식으로 포맷팅
  const formattedDate = `${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(
    2,
    "0"
  )} ${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`;

  return formattedDate;
}
