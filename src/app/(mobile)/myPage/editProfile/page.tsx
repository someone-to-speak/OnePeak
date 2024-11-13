"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/utils/myPage/imageUpload";
import { Camera } from "lucide-react";
import Image from "next/image";
import WithIconHeader from "@/components/ui/WithIconHeader";
import Button from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/hooks/useUser";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const EditProfile = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const supabase = createClient();
  const { userInfo, isLoading } = useUser();
  const [selectedProfile, setSelectedProfile] = useState(userInfo);

  useEffect(() => {
    if (userInfo) {
      setSelectedProfile(userInfo);
      setPreviewUrl(userInfo.profile_url);
    }
  }, [userInfo]);

  if (isLoading) return <LoadingSpinner />;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value.slice(0, 12);
    setSelectedProfile((prev) => ({ ...prev!, nickname: newNickname }));
  };

  const handleStateMsgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStateMsg = e.target.value.slice(0, 12);
    setSelectedProfile((prev) => ({ ...prev!, state_msg: newStateMsg }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userInfo?.id) {
      let imageUrl = selectedProfile?.profile_url;

      if (file) {
        try {
          const data = await uploadImage(file);
          imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Profile_url/${data.path}`;
        } catch {
          return;
        }
      }

      if (!selectedProfile) return;
      const { nickname, state_msg } = selectedProfile;

      if (!nickname || !imageUrl || !state_msg) {
        alert("모두 입력해주세요.");
        return;
      }

      const { error } = await supabase
        .from("user_info")
        .update({
          nickname,
          profile_url: imageUrl,
          state_msg
        })
        .eq("id", userInfo.id);

      if (error) {
        alert("프로필 업데이트에 실패했습니다.");
      } else {
        alert("프로필이 성공적으로 업데이트되었습니다.");
        router.push("/myPage");
      }
    }
  };

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
                sizes="(max-width: 768px) 100px, (max-width: 1200px) 200px, 200px"
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
              {selectedProfile?.nickname.length}/12
            </Typography>
          </div>
          <div className="h-[50px] py-2.5 bg-white rounded-xl border border-gray-600 justify-start items-center inline-flex hover:border hover:border-primary-500">
            <input
              type="text"
              value={selectedProfile?.nickname}
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
              {selectedProfile?.state_msg.length}/12
            </Typography>
          </div>
          <div className="h-[50px] py-2.5 rounded-xl border border-gray-600 justify-start items-center inline-flex hover:border hover:border-primary-500">
            <input
              type="text"
              value={selectedProfile?.state_msg}
              onChange={handleStateMsgChange}
              placeholder="상태 메세지를 입력해주세요."
              className="text-left px-[20px] text-black text-sm font-medium font-['Pretendard'] leading-[21px]"
            />
          </div>
        </div>
        <div className="w-full fixed bottom-[90px] md:static">
          <Button text="완료" disabled={!selectedProfile}></Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
