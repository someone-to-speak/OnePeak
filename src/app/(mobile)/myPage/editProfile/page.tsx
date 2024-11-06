"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../../../../database.types";
import { uploadImage } from "@/utils/myPage/imageUpload";
import { Input, Button, Spinner } from "@nextui-org/react";
import { Camera } from "lucide-react";
import Image from "next/image";
import WithIconHeader from "@/components/ui/WithIconHeader";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      setLoading(true);
      const { data, error } = await supabase.from("user_info").select("*").eq("id", userId).single();

      if (error) {
        setError("프로필 정보를 가져오는 데 실패했습니다.");
      } else {
        setSelectedProfile(data);
        setPreviewUrl(data.profile_url);
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [supabase, userId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userId) {
      setLoading(true);
      let imageUrl = selectedProfile?.profile_url;

      if (file) {
        try {
          const data = await uploadImage(file);
          imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Profile_url/${data.path}`;
          alert("이미지가 성공적으로 업로드 되었습니다!");
        } catch {
          setError("이미지 업로드에 실패했습니다.");
          setLoading(false);
          return;
        }
      }

      if (!selectedProfile) return;
      const { nickname, state_msg } = selectedProfile;

      if (!nickname || !imageUrl || !state_msg) {
        alert("모든 필드를 입력해 주세요.");
        setLoading(false);
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
        console.error("Update error", error);
      } else {
        alert("프로필이 성공적으로 업데이트되었습니다.");
        router.push("/myPage");
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center relative min-h-[calc(100vh-55px)]">
      <div className="absolute top-0">
        <WithIconHeader title="프로필 수정" />
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center pb-[24px]">
          <div className="relative">
            <div className="w-[100px] h-[100px] rounded-[54px] overflow-hidden shadow-md relative">
              <Image
                fill
                src={previewUrl || "/images/profile.png"}
                alt="프로필 이미지"
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100px, (max-width: 1200px) 200px, 200px"
              />
            </div>
            <label htmlFor="file-upload" className="absolute right-0 bottom-0 mb-0 mr-0 cursor-pointer">
              <input type="file" id="file-upload" onChange={handleFileChange} className="hidden" />
              <Button
                type="button"
                onClick={() => document.getElementById("file-upload")?.click()}
                className="w-[27.27px] h-[27.27px] p-[3.64px] bg-[#686868] rounded-full text-white shadow-md hover:bg-gray-600 transition duration-150"
              >
                <Camera size={18} />
              </Button>
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-[20px] w-full">
          <div className="flex flex-col gap-[6px]">
            <p className="text-black text-base font-medium font-['Pretendard'] leading-normal">닉네임</p>
            <div className="h-[50px] px-[20px] py-2.5 bg-[#fcfcfc] rounded-xl border border-[#a5a5a5] justify-start items-center gap-2.5 inline-flex hover:border hover:border-[#7bd232]">
              <Input
                type="text"
                value={selectedProfile?.nickname}
                onChange={(e) => setSelectedProfile((prev) => ({ ...prev!, nickname: e.target.value }))}
                required
                placeholder="닉네임을 입력해주세요."
                className="text-center text-black text-sm font-medium font-['Pretendard'] leading-[21px]"
              />
            </div>
          </div>
          <div className="flex flex-col w-full gap-[6px]">
            <p className="text-black text-base font-medium font-['Pretendard'] leading-normal">상태 메세지</p>
            <div className="h-[50px] px-[20px] py-2.5 bg-[#fcfcfc] rounded-xl border border-[#a5a5a5] justify-start items-center gap-2.5 inline-flex hover:border hover:border-[#7bd232]">
              <Input
                type="text"
                value={selectedProfile?.state_msg}
                onChange={(e) => setSelectedProfile((prev) => ({ ...prev!, state_msg: e.target.value }))}
                required
                placeholder="상태 메세지를 입력해주세요."
                className="text-center text-black text-sm font-medium font-['Pretendard'] leading-[21px]"
              />
            </div>
          </div>
        </div>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        <div className="w-full absolute bottom-0">
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-[54px] p-2.5 bg-[#7bd232] rounded-[10px] justify-center items-center gap-2.5 inline-flex text-center text-[#fcfcfc] mb-[10px] text-lg font-bold font-['SUIT'] leading-[27px]"
          >
            {loading ? <Spinner size="sm" /> : "완료"}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default EditProfilePage;
