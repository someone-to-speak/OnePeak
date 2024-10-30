"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Tables } from "../../../../database.types";
import Link from "next/link";

type SituationType = Tables<"situation">;

const TodayLearn = () => {
  const supabase = createClient();
  const [situations, setSituations] = useState<SituationType[]>([]);

  // situation 조회
  const getSituations = async () => {
    const { data, error } = await supabase.from("situation").select("*");

    if (data) {
      setSituations(data);
    } else {
      console.log(error);
    }

    return data;
  };

  useEffect(() => {
    getSituations();
  }, []);

  // TODO: 기능 구현 후 캐러셀 적용

  return (
    <div className="h-64">
      <h1 className="text-3xl font-bold">오늘의 학습</h1>
      <p>매일 업데이트 되는 맞춤 커리큘럼 {situations.length}</p>
      <div className="flex flex-row">
        {situations.map((situation) => {
          return (
            <Link href={{ pathname: "/chatbot", query: { situation: situation.situation, level: situation.level } }}>
              <div key={situation.id} className="w-60 h-60 border border-spacing-2">
                <p>{situation.situation}</p>
                <p>난이도: {situation.level}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TodayLearn;