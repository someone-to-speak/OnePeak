// "use client";

// import NewCalendar from "@/components/newCalendar/NewCalendar";
// import React from "react";

// const AttendanceCheck = () => {
//   return <NewCalendar />;
// };

// export default AttendanceCheck;

"use client";

import NewCalendar from "@/components/newCalendar/NewCalendar";
import { useQuery } from "@tanstack/react-query";
import { reviewApi } from "@/services/supabaseChatbot";

const AttendanceCheck = () => {
  // 유저 정보 조회
  const { data: user } = useQuery({
    queryKey: ["userInfo"],
    queryFn: reviewApi.getUserInfo
  });

  // 리뷰 데이터 조회
  const { data: reviews } = useQuery({
    queryKey: ["reviewList", user?.id],
    queryFn: () => (user ? reviewApi.getReviews(user.id) : Promise.resolve([])),
    enabled: !!user
  });

  return (
    <NewCalendar
      reviews={reviews ?? []}
      onRangeSelect={(range) => {
        console.log("선택된 범위:", range);
      }}
    />
  );
};

export default AttendanceCheck;
