export const dateUtils = {
  // TODO: 자정으로 바꿔야 함 (0, 0, 0)
  // 오늘 날짜의 정오를 기준으로 설정
  getToday: () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
    // return new Date(today.setHours(0, 0, 0, 0));
  },

  // 날짜 형식 통일 (YYYY-MM-DD)
  formatDate: (date: Date | string) => {
    const targetDate = new Date(date);
    return targetDate.toISOString().split("T")[0];
  },

  // 두 날짜가 같은 날인지 비교
  isSameDay: (date1: Date | string, date2: Date | string) => {
    return dateUtils.formatDate(date1) === dateUtils.formatDate(date2);
  },

  // 날짜에서 월과 일만 추출
  getMonthAndDay: (date: Date | string) => {
    const [year, month, day] = dateUtils.formatDate(date).split("-");
    return {
      month: parseInt(month, 10),
      day: parseInt(day, 10)
    };
  }
};
