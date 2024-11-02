import { dateUtils } from "@/utils/chatbot/date";
import { useState } from "react";

const Calendar: React.FC<{ onSelectDate: (date: Date) => void }> = ({ onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(dateUtils.getToday());
  const [selectedDate, setSelectedDate] = useState<Date>(dateUtils.getToday());
  const today = dateUtils.getToday();

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => {
    const newDate = dateUtils.getStartOfDay(date);

    setSelectedDate(newDate);
    onSelectDate(newDate);
  };

  const handlePrevMonth = () => {
    setCurrentDate(dateUtils.getAdjustedMonth(currentDate, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(dateUtils.getAdjustedMonth(currentDate, 1));
  };

  const dates = dateUtils.generateCalendarDates(currentDate);

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
      <div className="border p-5">
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
              onClick={() => handleDateClick(date)}
              className={`py-2 cursor-pointer ${
                dateUtils.isSameMonth(date, currentDate) ? "text-black" : "text-gray-300"
              }
              ${dateUtils.isSameDay(date, today) ? "bg-blue-100 font-bold rounded-lg" : ""}
              ${dateUtils.isSameDay(date, selectedDate) ? "bg-blue-300 text-white font-bold rounded-lg" : ""}`}
            >
              {date.getDate()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
