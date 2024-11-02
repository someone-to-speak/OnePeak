import { useState } from "react";

const MiniCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date(); // 오늘 날짜

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // 날짜 배열 생성 함수 (줄 수에 맞게 동적으로 조정)
  const generateCalendarDates = () => {
    const dates = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 현재 달의 첫 번째와 마지막 날
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();

    // 시작일을 기준으로 필요한 빈 칸 수 계산 (이전 달 날짜)
    const startDay = firstDayOfMonth.getDay(); // 요일 0 (일요일) ~ 6 (토요일)
    for (let i = startDay - 1; i >= 0; i--) {
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
  };

  const dates = generateCalendarDates();

  return (
    <div className="my-1 p-5">
      {/* 월 변경 버튼 및 현재 년/월 표시 */}
      <div className="flex justify-center mb-4">
        <button onClick={handlePrevMonth} className="px-3 py-1 bg-gray-200 rounded">
          이전
        </button>
        <span className="text-lg font-semibold mx-10">
          {currentDate.getFullYear()}.{currentDate.getMonth() + 1}
        </span>
        <button onClick={handleNextMonth} className="px-3 py-1 bg-gray-200 rounded">
          다음
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-center font-medium">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 text-center">
        {dates.map((date, index) => (
          <div
            key={index}
            className={`py-2 ${date.getMonth() === currentDate.getMonth() ? "text-black" : "text-gray-300"}
              ${date.toDateString() === today.toDateString() ? "bg-blue-100 font-bold rounded-lg" : ""}`}
          >
            {date.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;
