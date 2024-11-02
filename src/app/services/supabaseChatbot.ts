// api/review.ts
import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../../database.types";

type ReviewType = Tables<"review">;

export const reviewApi = {
  // 유저 정보 조회
  getUserInfo: async () => {
    const supabase = createClient();
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // 리뷰 데이터 조회
  getReviews: async (userId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("review")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as ReviewType[];
  }
};
