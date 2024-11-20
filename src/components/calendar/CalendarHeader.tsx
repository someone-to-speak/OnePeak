import { dateUtils } from "@/utils/chatbot/date";
import { Typography } from "../ui/typography";

type CalendarHeaderProps = {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  className?: string;
};

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  className = ""
}) => (
  <div className={`flex justify-center items-center mb-[20px] ${className}`}>
    <button onClick={onPrevMonth} className="px-3 py-1 w-[20px]">
      ‹
    </button>
    <Typography size={20} weight={"bold"} className=" mx-10">
      {dateUtils.formatYearMonth(currentDate)}
    </Typography>
    <button onClick={onNextMonth} className="px-3 py-1">
      ›
    </button>
  </div>
);
