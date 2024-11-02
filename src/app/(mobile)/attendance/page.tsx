"use client";

import Calendar from "@/components/calendar/Calendar";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();

  const handleDateSelect = () => {};
  return (
    <div className="p-5">
      <div className="flex">
        <button onClick={() => router.back()} className="mr-5">
          🔙
        </button>
        <p>출석</p>
      </div>
      <Calendar onSelectDate={handleDateSelect} />
    </div>
  );
};

export default page;
