import { createClient } from "@/utils/supabase/server";
import WordList from "@/components/wrongAnswer/WordList";
import WithIconHeader from "@/components/ui/WithIconHeader";

const WrongWordPage = async () => {
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
    <div className="flex flex-col gap-3 md:gap-[70px]">
      <WithIconHeader title="단어 오답노트" />
      <WordList userId={userId} />
    </div>
  );
};

export default WrongWordPage;
