import { dateUtils } from "@/utils/chatbot/date";
import { Typography } from "../ui/typography";

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
        className={`flex items-center justify-center py-1 md:py-4 cursor-pointer ${
          dateUtils.isSameMonth(date, currentDate) ? "cursor-pointer text-gray-300" : "cursor-not-allowed text-gray-800"
        } ${dateUtils.isSameDayForUI(date, today) ? "bg-primary-700 font-bold text-white rounded-lg" : ""}
        ${dateUtils.isSameDayForUI(date, selectedDate) ? "bg-primary-500 text-white font-bold rounded-lg" : ""}`}
      >
        <Typography
          size={14} // 크기는 필요에 따라 조절
          weight={
            dateUtils.isSameDayForUI(date, today) || dateUtils.isSameDayForUI(date, selectedDate) ? "bold" : "normal"
          }
          className={
            dateUtils.isSameDayForUI(date, today) || dateUtils.isSameDayForUI(date, selectedDate)
              ? "text-white"
              : dateUtils.isSameMonth(date, currentDate)
              ? "text-gray-300"
              : "text-gray-800"
          }
        >
          {date.getDate()}
        </Typography>
      </div>
    ))}
  </div>
);
