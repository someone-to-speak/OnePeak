"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { toast } from "react-toastify";
import { Camera } from "lucide-react";
import Image from "next/image";
import WithIconHeader from "@/components/ui/WithIconHeader";
import Button from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useUser } from "@/hooks/useUser";
import ChatModal from "@/components/ChatModal";
import { useQueryClient } from "@tanstack/react-query";
import { useUserProfile } from "@/hooks/useUserProfile";

const EditProfile = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { userInfo, isLoading } = useUser();
  const { data: profile, isLoading: profileLoading } = useUserProfile(userInfo?.id || "");
  const { mutate } = useUpdateProfile();
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [stateMsg, setStateMsg] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 기존 프로필 정보 로딩
  useEffect(() => {
    if (profile) {
      setPreviewUrl(profile.profile_url);
      setNickname(profile.nickname || "");
      setStateMsg(profile.state_msg || "");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value.slice(0, 12));
  };

  const handleStateMsgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateMsg(e.target.value.slice(0, 12));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (profileLoading) return <LoadingSpinner />;

    if (!nickname || !stateMsg || !userInfo?.id) return;

    try {
      mutate(
        {
          userId: userInfo.id,
          nickname,
          state_msg: stateMsg,
          file,
          changedProfileUrl: userInfo.profile_url
        },
        {
          onSuccess: () => {
            setIsModalOpen(true);
            queryClient.invalidateQueries({ queryKey: ["userProfile", userInfo.id] });
          },
          onError: () => {
            toast.error("프로필 업데이트에 실패했습니다.");
          }
        }
      );
    } catch {
      toast.error("프로필 업데이트에 실패했습니다.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push("/myPage");
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col justify-center gap-[24px] md:gap-[70px]">
      <WithIconHeader title="프로필 수정" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-[10px] md:gap-[30px] w-[343px] mx-auto">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-[100px] h-[100px] rounded-[54px] overflow-hidden shadow-md relative">
              <Image
                fill
                src={previewUrl || "/app-icon.png"}
                alt="프로필 이미지"
                className="object-cover"
                priority
                sizes="auto"
              />
            </div>
            <label htmlFor="file-upload" className="absolute right-0 bottom-0 mb-0 mr-0 cursor-pointer">
              <input type="file" id="file-upload" onChange={handleFileChange} className="hidden" />
              <button
                type="button"
                onClick={() => document.getElementById("file-upload")?.click()}
                className="w-[30px] h-[30px] p-[3px] bg-[#686868] flex items-center justify-center rounded-full text-white shadow-md hover:bg-gray-600 transition duration-150"
              >
                <Camera size={18} />
              </button>
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-[6px]">
          <div className="flex flex-row items-center justify-between">
            <Typography size={16} weight="medium">
              닉네임
            </Typography>
            <Typography size={12} weight="medium" className="text-gray-500 text-right">
              {nickname?.length}/12
            </Typography>
          </div>
          <div className="h-[50px] py-2.5 bg-white rounded-xl border border-gray-600 justify-start items-center inline-flex hover:border hover:border-primary-500">
            <input
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              placeholder="닉네임을 입력해주세요."
              className="text-left px-[20px] text-black text-sm font-medium font-['Pretendard'] leading-[21px]"
            />
          </div>
        </div>
        <div className="flex flex-col w-full gap-[6px]">
          <div className="flex flex-row items-center justify-between">
            <Typography size={16} weight="medium">
              상태 메세지
            </Typography>
            <Typography size={12} weight="medium" className="text-gray-500 text-right">
              {stateMsg?.length}/12
            </Typography>
          </div>
          <div className="h-[50px] py-2.5 rounded-xl border border-gray-600 justify-start items-center inline-flex hover:border hover:border-primary-500">
            <input
              type="text"
              value={stateMsg}
              onChange={handleStateMsgChange}
              placeholder="상태 메세지를 입력해주세요."
              className="text-left px-[20px] text-black text-sm font-medium font-['Pretendard'] leading-[21px]"
            />
          </div>
        </div>
        <div className="w-full fixed bottom-[90px] md:static">
          <Button text="완료" disabled={!nickname || !stateMsg}></Button>
        </div>
      </form>

      <ChatModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalClose}
        title="프로필 수정 완료"
        description="프로필이 성공적으로 업데이트되었습니다."
        confirmButtonStyle="success"
        confirmText="확인"
        showCancel={false}
      />
    </div>
  );
};

export default EditProfile;
