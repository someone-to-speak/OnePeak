import { Typography } from "../ui/typography";

type DayHeaderProps = {
  className?: string;
};

const DAYS_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"] as const;

export const DayHeader: React.FC<DayHeaderProps> = ({ className = "" }) => (
  <div className={`grid grid-cols-7 text-center font-medium text-gray-300${className}`}>
    {DAYS_OF_WEEK.map((day) => (
      <div key={day} className="py-2">
        <Typography size={16} weight={"normal"}>
          {day}
        </Typography>
      </div>
    ))}
  </div>
);
