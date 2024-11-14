export const dateUtils = {
  // 오늘 날짜의 자정을 기준으로 설정
  getToday: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  },

  // 날짜 형식 통일 (YYYY-MM-DD)
  formatDate: (date: Date | string) => {
    const targetDate = new Date(date);
    return targetDate
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      })
      .replace(/\. /g, "-")
      .replace(".", "");
  },

  getMonthAndDay: (date: Date | string) => {
    // UTC 문자열에서 날짜 부분만 추출
    const dateStr =
      typeof date === "string"
        ? date.split("T")[0] // ISO 문자열이면 T 이전의 날짜 부분만
        : dateUtils.formatDate(date);

    const [year, month, day] = dateStr.split("-");

    return {
      year: parseInt(year, 10),
      month: parseInt(month, 10),
      day: parseInt(day, 10)
    };
  },

  // 년, 월 형식으로 포맷팅
  formatYearMonth: (date: Date) => {
    return `${date.getFullYear()}.${date.getMonth() + 1}`;
  },

  isSameDay: (date1: Date | string, date2: Date | string) => {
    // 모든 날짜를 YYYY-MM-DD 형식으로 통일
    const getDateOnly = (date: Date | string) => {
      if (typeof date === "string") {
        // UTC ISO 문자열인 경우
        return date.split("T")[0];
      }
      // Date 객체인 경우
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const d1Str = getDateOnly(date1);
    const d2Str = getDateOnly(date2);

    return d1Str === d2Str;
  },

  // 날짜의 시작(자정)을 반환
  getStartOfDay: (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  },

  // 월 조정
  getAdjustedMonth: (date: Date, adjustment: number) => {
    return new Date(date.getFullYear(), date.getMonth() + adjustment, 1);
  },

  // 같은 월인지 확인
  isSameMonth: (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
  },

  // 날짜 배열 생성 함수 (줄 수에 맞게 동적으로 조정)
  generateCalendarDates: (currentDate: Date) => {
    const dates = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 현재 달의 첫 번째와 마지막 날
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();

    // 시작일을 기준으로 필요한 빈 칸 수 계산 (이전 달 날짜)
    const startDay = firstDayOfMonth.getDay(); // 요일 0 (일요일) ~ 6 (토요일)
    for (let i = startDay; i > 0; i--) {
      // 이전 달 날짜 추가
      dates.push(new Date(year, month - 1, lastDayOfMonth.getDate() - i));
    }

    // 현재 달 날짜 추가
    for (let i = 1; i <= totalDaysInMonth; i++) {
      dates.push(new Date(year, month, i));
    }

    // 필요 줄 수 계산 (날짜 수가 5줄로 충분한지 확인)
    const totalCells = dates.length;
    const totalRows = Math.ceil(totalCells / 7);

    // 다음 달 날짜 추가 (6줄 필요할 때만)
    if (totalRows < 6) {
      const remainingDays = 7 * totalRows - totalCells;
      for (let i = 1; i <= remainingDays; i++) {
        dates.push(new Date(year, month + 1, i));
      }
    } else if (totalRows === 5) {
      // 이미 5줄에 꽉 차 있을 경우 남은 빈 칸만 채움
      const remainingDays = 35 - dates.length;
      for (let i = 1; i <= remainingDays; i++) {
        dates.push(new Date(year, month + 1, i));
      }
    }

    return dates;
  },

  // UI용 날짜 비교 (Date 객체끼리 비교)
  isSameDayForUI: (date1: Date, date2: Date) => {
    return date1.toLocaleDateString() === date2.toLocaleDateString();
  }
};
