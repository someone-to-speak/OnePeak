export type Message = {
  role: "user" | "system" | "assistant";
  content: string;
};

export type CalendarDate = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
};
