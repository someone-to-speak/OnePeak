import { dateUtils } from "@/utils/chatbot/date";
import { useState } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { DayHeader } from "./DayHeader";
import { DateGrid } from "./DateGrid";

type CalendarProps = {
  setSelectedDate: (date: Date) => void;
  selectedDate: Date;
  className?: string;
};

const Calendar: React.FC<CalendarProps> = ({ setSelectedDate, selectedDate, className = "" }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = dateUtils.getToday();

  // 날짜 클릭
  const handleDateClick = (date: Date) => {
    const newDate = dateUtils.getStartOfDay(date);
    setSelectedDate(newDate);
  };

  // 이전 달로 이동
  const handlePrevMonth = () => {
    setCurrentDate(dateUtils.getAdjustedMonth(currentDate, -1));
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    setCurrentDate(dateUtils.getAdjustedMonth(currentDate, 1));
  };

  // 날짜 생성
  const dates = dateUtils.generateCalendarDates(currentDate);

  return (
    <div className={`my-1 ${className}`}>
      <CalendarHeader currentDate={currentDate} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} />
      <div className="border p-5 border-primary-500 rounded-[15px] ">
        <DayHeader />
        <DateGrid
          dates={dates}
          selectedDate={selectedDate}
          currentDate={currentDate}
          today={today}
          onDateClick={handleDateClick}
        />
      </div>
    </div>
  );
};

export default Calendar;
