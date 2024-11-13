"use client";

import React, { useMemo, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tables } from "../../../database.types";

type Review = Tables<"review">;

type CalendarProps = {
  onRangeSelect?: (range: { start: Date; end: Date }) => void;
  initialDate?: Date;
  reviews: Review[];
};

type DateRange = {
  start: Date | null;
  end: Date | null;
};

const RangeCalendar: React.FC<CalendarProps> = ({ onRangeSelect, initialDate = new Date() }) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    start: null,
    end: null
  });

  // 현재 보고 있는 월의 첫날과 마지막날 계산
  const firstDayOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), [currentDate]);

  const lastDayOfMonth = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
    [currentDate]
  );

  // 달력에 표시할 날짜들 생성
  const calendarDates = useMemo(() => {
    const dates: Date[] = [];
    const startDay = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    // 이전 달의 날짜들
    for (let i = startDay - 1; i >= 0; i--) {
      dates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), -i));
    }

    // 현재 달의 날짜들
    for (let i = 1; i <= totalDays; i++) {
      dates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    // 다음 달의 날짜들 (6주를 채우기 위해)
    const remainingDays = 42 - dates.length;
    for (let i = 1; i <= remainingDays; i++) {
      dates.push(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i));
    }

    return dates;
  }, [currentDate, firstDayOfMonth, lastDayOfMonth]);

  // 날짜 비교 함수
  const isSameDay = useCallback((date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }, []);

  // 날짜가 범위 내에 있는지 확인
  const isInRange = useCallback(
    (date: Date) => {
      if (!selectedRange.start || !selectedRange.end) return false;
      return date >= selectedRange.start && date <= selectedRange.end;
    },
    [selectedRange]
  );

  // 날짜가 범위의 시작 또는 끝인지 확인
  const isRangeEnd = useCallback(
    (date: Date) => {
      if (!selectedRange.start || !selectedRange.end) return false;
      return isSameDay(date, selectedRange.start) || isSameDay(date, selectedRange.end);
    },
    [selectedRange, isSameDay]
  );

  // 날짜 선택 처리
  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedRange((prev) => {
        if (!prev.start || prev.end) {
          // 새로운 범위 시작
          return { start: date, end: null };
        } else if (date < prev.start) {
          // 시작일보다 이전 날짜 선택 시
          return { start: date, end: prev.start };
        } else {
          // 범위 완성
          const range = { start: prev.start, end: date };
          onRangeSelect?.(range);
          return range;
        }
      });
    },
    [onRangeSelect]
  );

  // 이전/다음 달 이동
  const changeMonth = useCallback((increment: number) => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + increment, 1));
  }, []);

  // 날짜가 현재 달에 속하는지 확인
  const isCurrentMonth = useCallback(
    (date: Date) => {
      return date.getMonth() === currentDate.getMonth();
    },
    [currentDate]
  );

  // 요일 표시
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow p-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h2>

        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDates.map((date, index) => {
          const isToday = isSameDay(date, new Date());
          const inRange = isInRange(date);
          const isEnd = isRangeEnd(date);

          // 범위 내 날짜의 스타일 계산
          let rangeStyle = "";
          if (inRange) {
            if (index % 7 === 0) {
              rangeStyle = "rounded-l-lg";
            } else if (index % 7 === 6) {
              rangeStyle = "rounded-r-lg";
            }
          }

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateSelect(date)}
              className={`
                relative py-2 text-sm font-medium
                ${isCurrentMonth(date) ? "text-gray-400" : "text-gray-900"}
                ${isEnd ? "bg-blue-600 text-white z-10 rounded-lg" : ""}
                ${inRange && !isEnd ? "bg-blue-100" : ""}
                ${rangeStyle}
                ${isToday ? "ring-2 ring-blue-600" : ""}
                hover:bg-blue-50
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* 선택된 날짜 범위 표시 */}
      {(selectedRange.start || selectedRange.end) && (
        <div className="mt-4 text-sm text-gray-600">
          {selectedRange.start && (
            <span>
              시작: {selectedRange.start.toLocaleDateString()}
              {selectedRange.end && <span> ~ 종료: {selectedRange.end.toLocaleDateString()}</span>}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default RangeCalendar;
