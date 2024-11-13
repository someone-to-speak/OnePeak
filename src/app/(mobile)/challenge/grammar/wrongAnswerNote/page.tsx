import { createClient } from "@/utils/supabase/server";
import GrammarList from "@/components/wrongAnswer/GrammarList";
import WithIconHeader from "@/components/ui/WithIconHeader";

const WrongGrammarPage = async () => {
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
      <WithIconHeader title="문법 오답노트" />
      <GrammarList userId={userId} />
    </div>
  );
};

export default WrongGrammarPage;
