"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type DatePiece = Date | null;
type SelectedDate = DatePiece | [DatePiece, DatePiece];

const NewCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<SelectedDate>(new Date()); // 초기값은 현재 날짜
  console.log(selectedDate);
  return (
    <div className="Sample">
      <header>
        <h1>달력 작업 중</h1>
      </header>
      <div className="">
        <main className="bg--primary-700">
          <Calendar
            className="p-4 rounded-lg border border--primary-700 max-w-full w-[343px] h-[282px]"
            locale="ko"
            onChange={setSelectedDate}
            showWeekNumbers
            value={selectedDate}
            calendarType="hebrew"
            view="month"
            prev2Label={null}
            next2Label={null}
            showNeighboringMonth={false}
            formatDay={(locale, date) => date.toLocaleString("en", { day: "numeric" })}
          />
        </main>
      </div>
    </div>
  );
};

export default NewCalendar;
