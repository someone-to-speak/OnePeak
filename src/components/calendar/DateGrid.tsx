import { dateUtils } from "@/utils/chatbot/date";

type DateGridProps = {
  dates: Date[];
  selectedDate: Date;
  currentDate: Date;
  today: Date;
  onDateClick: (date: Date) => void;
  className?: string;
};

export const DateGrid: React.FC<DateGridProps> = ({
  dates,
  selectedDate,
  currentDate,
  today,
  onDateClick,
  className = ""
}) => (
  <div className={`grid grid-cols-7 text-center ${className}`}>
    {dates.map((date, index) => (
      <div
        key={index}
        onClick={() => onDateClick(date)}
        className={`py-2 cursor-pointer ${
          dateUtils.isSameMonth(date, currentDate) ? "cursor-pointer text-gray-300" : "cursor-not-allowed text-gray-800"
        } ${dateUtils.isSameDayForUI(date, today) ? "bg-primary-700 font-bold text-white rounded-lg" : ""}
          ${dateUtils.isSameDayForUI(date, selectedDate) ? "bg-primary-500 text-white font-bold rounded-lg" : ""}`}
      >
        {date.getDate()}
      </div>
    ))}
  </div>
);
