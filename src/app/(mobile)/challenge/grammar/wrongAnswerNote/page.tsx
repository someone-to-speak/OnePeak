import { createClient } from "@/utils/supabase/server";
import GrammarList from "@/components/wrongAnswer/GrammarList";

const WrongGrammarPage = async () => {
  // supabase의 auth 데이터 가져오는 함수
  const fetchUserInfo = async () => {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    // console.log("user", user);
    return user?.id as string;
  };
  const userId = await fetchUserInfo();
  // console.log("userId", userId);

  return (
    <div>
      <h1>단어 오답노트</h1>
      <GrammarList userId={userId} />
    </div>
  );
};

export default WrongGrammarPage;
