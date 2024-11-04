import { createClient } from "@/utils/supabase/server";
import WordList from "@/components/wrongAnswer/WordList";
import Link from "next/link";

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
    <div>
      <div className="flex gap-4">
        <Link href={"/challenge"}>🔙</Link>
        <h1>문법 오답노트</h1>
      </div>
      <WordList userId={userId} />
    </div>
  );
};

export default WrongWordPage;
