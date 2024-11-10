"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../../../../database.types";
import { uploadImage } from "@/utils/myPage/imageUpload";
import { Camera } from "lucide-react";
import Image from "next/image";
import WithIconHeader from "@/components/ui/WithIconHeader";
import Button from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

type UserInfoType = Tables<"user_info">;

const EditProfilePage = () => {
  return (
    <Suspense>
      <EditProfile />
    </Suspense>
  );
};

const EditProfile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams?.get("userId");
  const [selectedProfile, setSelectedProfile] = useState<UserInfoType | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      const { data } = await supabase.from("user_info").select("*").eq("id", userId).single();

      if (data) {
        setSelectedProfile(data);
        setPreviewUrl(data.profile_url);
      }
    };

    fetchUserProfile();
  }, [supabase, userId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userId) {
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
        .eq("id", userId);

      if (error) {
        alert("프로필 업데이트에 실패했습니다.");
      } else {
        alert("프로필이 성공적으로 업데이트되었습니다.");
        router.push("/myPage");
      }
    }
  };

  return (
    <div className="w-full flex flex-col justify-center relative min-h-[calc(100vh-80px)]">
      <div className="absolute top-0">
        <WithIconHeader title="프로필 수정" />
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center pb-[24px]">
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
        <div className="flex flex-col gap-[20px] w-full">
          <div className="flex flex-col gap-[6px]">
            <Typography size={16} weight="medium">
              닉네임
            </Typography>
            <div className="h-[50px] py-2.5 bg-[#fcfcfc] rounded-xl border border-[#a5a5a5] justify-start items-center inline-flex hover:border hover:border-[#7bd232]">
              <input
                type="text"
                value={selectedProfile?.nickname}
                onChange={(e) => setSelectedProfile((prev) => ({ ...prev!, nickname: e.target.value }))}
                required
                placeholder="닉네임을 입력해주세요."
                className="text-left px-[20px] text-black text-sm font-medium font-['Pretendard'] leading-[21px]"
              />
            </div>
          </div>
          <div className="flex flex-col w-full gap-[6px]">
            <Typography size={16} weight="medium">
              상태 메세지
            </Typography>
            <div className="h-[50px] py-2.5 bg-[#fcfcfc] rounded-xl border border-[#a5a5a5] justify-start items-center inline-flex hover:border hover:border-[#7bd232]">
              <input
                type="text"
                value={selectedProfile?.state_msg}
                onChange={(e) => setSelectedProfile((prev) => ({ ...prev!, state_msg: e.target.value }))}
                required
                placeholder="상태 메세지를 입력해주세요."
                className="text-left px-[20px] text-black text-sm font-medium font-['Pretendard'] leading-[21px]"
              />
            </div>
          </div>
        </div>
        <div className="w-full absolute bottom-0">
          <Button text="왼료"></Button>
        </div>
      </form>
    </div>
  );
};
export default EditProfilePage;
