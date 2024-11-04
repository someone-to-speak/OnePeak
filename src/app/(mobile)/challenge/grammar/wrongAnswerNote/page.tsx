import { createClient } from "@/utils/supabase/server";
import GrammarList from "@/components/wrongAnswer/GrammarList";

const WrongGrammarPage = async () => {
  // supabase의 auth 데이터 가져오는 함수
  const fetchUserInfo = async () => {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    return user?.id as string;
  };
  const userId = await fetchUserInfo();

  return (
    <div>
      <h1>문법 오답노트</h1>
      <GrammarList userId={userId} />
    </div>
  );
};

export default WrongGrammarPage;
