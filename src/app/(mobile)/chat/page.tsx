"use client";

import { Typography } from "@/components/ui/typography";
import UserProfile from "@/components/ui/userProfile";
import { useConversation } from "@/hooks/useConversation";
import { useRouter } from "next/navigation";

const Page = () => {
  const { conversationList, isFetched, isError } = useConversation();
  const router = useRouter();

  if (!isFetched) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Typography size={14} className="font-medium">
          잠시만 기다려주세요...
        </Typography>
      </div>
    );
  }

  if (isError) {
    return <div>에러가 발생...</div>;
  }

  return (
    <div className="flex flex-col pt-safe-offset-0 h-screen px-4 md:px-3">
      <div className="py-[10.5px] bg-white">
        <Typography size={18} className="font-bold ">
          채팅방
        </Typography>
      </div>
      {conversationList && conversationList.length > 0 ? (
        conversationList?.map((conversation) => (
          <div
            className="flex flex-col gap-2 md:gap-3 flex-1 overflow-visible md:p-[20px] md:bg-gray-900 md:rounded-[24px]"
            key={conversation.id}
          >
            <UserProfile
              name={conversation.participants.user_info.nickname}
              country={conversation.participants.user_info.my_language.language_img_url}
              profileImage={conversation.participants.user_info.profile_url}
              lastMessage={
                conversation.last_message_id.type === "text" ? conversation.last_message_id.content : "음성 파일"
              }
              learnLanguageUrl={conversation.participants.user_info.learn_language.language_img_url}
              learnLanguage={conversation.participants.user_info.learn_language.language_name}
              path="chat"
              onClick={() => router.push(`/chat/room?id=${conversation.id}`)}
            ></UserProfile>
          </div>
        ))
      ) : (
        <div className="flex-grow flex justify-center items-center">
          <Typography size={12} className="font-medium">
            대화 내역이 없습니다.
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Page;
