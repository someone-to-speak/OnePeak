import { dateUtils } from "@/utils/chatbot/date";

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
  <div className={`flex justify-center mb-4 ${className}`}>
    <button onClick={onPrevMonth} className="px-3 py-1 bg-gray-200 rounded">
      이전
    </button>
    <span className="text-lg font-semibold mx-10">{dateUtils.formatYearMonth(currentDate)}</span>
    <button onClick={onNextMonth} className="px-3 py-1 bg-gray-200 rounded">
      다음
    </button>
  </div>
);
