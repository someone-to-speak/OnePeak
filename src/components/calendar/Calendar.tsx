import { dateUtils } from "@/utils/chatbot/date";
import { useState } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { DayHeader } from "./DayHeader";
import { DateGrid } from "./DateGrid";

type CalendarProps = {
  onSelectDate: (date: Date) => void;
  className?: string;
};

const Calendar: React.FC<CalendarProps> = ({ onSelectDate, className = "" }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(dateUtils.getToday());
  const today = dateUtils.getToday();

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
    <div className={`my-1 p-5 ${className}`}>
      <CalendarHeader currentDate={currentDate} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} />
      <div className="border p-5">
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
