// api/review.ts
import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../database.types";
import { AiMessages } from "@/type";

type ReviewType = Tables<"review">;
type SituationType = Tables<"situation">;
type ReviewContentType = Tables<"review_content">;

const supabase = createClient();

export const reviewApi = {
  // 유저 정보 조회
  getUserInfo: async () => {
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // 리뷰 데이터 조회
  getReviews: async (userId: string) => {
    const { data, error } = await supabase
      .from("review")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data as ReviewType[];
  },

  // situation 조회
  getSituations: async () => {
    try {
      const { data, error } = await supabase.from("situation").select("*");

      if (error) {
        throw error;
      }

      if (data) {
        // 데이터가 3개 이상일 경우 랜덤으로 3개 선택
        const randomSiuations = data.sort(() => 0.5 - Math.random()).slice(0, 3);
        return randomSiuations;
      }
      return [];
    } catch (error) {
      console.log("situation을 가져오는 데에 실패하였습니다!", error);
      throw error;
    }
  },
  // 각 level별로 랜덤 situation 조회
  getEachLevel: async () => {
    try {
      const { data: allData, error } = await supabase.from("situation").select("*");

      if (error) {
        throw error;
      }

      if (!allData || allData.length === 0) {
        return [];
      }

      // 레벨별로 데이터 분류
      const level1Data = allData.filter((item) => item.level === 1);
      const level2Data = allData.filter((item) => item.level === 2);
      const level3Data = allData.filter((item) => item.level === 3);

      // 각 레벨에서 랜덤으로 1개씩 선택
      const getRandomItem = (array: SituationType[]) => {
        if (array.length === 0) return null;
        return array[Math.floor(Math.random() * array.length)];
      };

      const result = [getRandomItem(level1Data), getRandomItem(level2Data), getRandomItem(level3Data)].filter(
        (item) => item !== null
      ); // null 항목 제거

      return result;
    } catch (error) {
      console.log("situation을 가져오는 데에 실패하였습니다!", error);
      throw error;
    }
  },

  // TODO: 민정님 오류 알려드리기!!
  // insert에서 오류나는 거 타입에서 자동으로 세팅되는 벨류 값을 필수 타입으로 설정해서 여기서도 인자로 넘겨줘야만 함
  // 타입 파일도 수정

  // AI 튜터 학습 내용 저장
  postLearnMessage: async (messages: AiMessages[], review_id: number) => {
    const { data, error } = await supabase.from("review_content").insert({ messages, review_id }).select();

    if (error) {
      console.log("review 테이블 추가 오류: ", error);
      throw error; // 에러 전파
    }
    return data;
  },

  // AI 튜터 학습 내용 조회
  getLearnMessage: async (userId: string, reviewId: string): Promise<ReviewContentType[]> => {
    const { data, error } = await supabase
      .from("review_content")
      .select("*")
      .eq("user_id", userId)
      .eq("review_id", reviewId);
    console.log(data);
    if (error) {
      console.log("getLearnMessage  호출 오류: ", error);
    }
    return data || [];
  }
};
