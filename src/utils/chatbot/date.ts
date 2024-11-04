export const dateUtils = {
  // 오늘 날짜의 자정을 기준으로 설정
  getToday: () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
  },

  // 날짜 형식 통일 (YYYY-MM-DD)
  formatDate: (date: Date | string) => {
    const targetDate = new Date(date);
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  },
  // supabase 날짜와 클라이언트 날짜를 비교
  convertToKST: (date: Date | string) => {
    const day = new Date(date);
    day.setHours(day.getHours() - 9); // UTC - 9
    return day;
  },

  // 두 날짜가 같은 날인지 비교
  isSameDay: (date1: Date | string, date2: Date | string) => {
    const d1 = new Date(date1);
    d1.setHours(d1.getHours() + 9);

    const d2 = new Date(date2);

    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  },

  // 날짜에서 월과 일만 추출
  getMonthAndDay: (date: Date | string) => {
    const [year, month, day] = dateUtils.formatDate(date).split("-");
    return {
      month: parseInt(month, 10),
      day: parseInt(day, 10)
    };
  },

  // 캘린더 컴포넌트
  // 1. 년, 월 형식으로 포맷팅
  formatYearMonth: (date: Date) => {
    return `${date.getFullYear()}.${date.getMonth() + 1}`;
  },

  // 2. 날짜의 시작(자정)을 반환
  getStartOfDay: (date: Date) => {
    // return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  },

  // 3. 월 조정
  getAdjustedMonth: (date: Date, adjustment: number) => {
    return new Date(date.getFullYear(), date.getMonth() + adjustment, 1);
  },

  // 4. 같은 월인지 확인
  isSameMonth: (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
  },

  // 5. 날짜 배열 생성 함수 (줄 수에 맞게 동적으로 조정)
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
  }
};
