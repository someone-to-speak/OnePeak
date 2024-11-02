"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../../../../database.types";
import { uploadImage } from "@/utils/myPage/imageUpload";
import { Input, Button, Spinner } from "@nextui-org/react";
import { Camera, Icon } from "lucide-react";
import Image from "next/image";

type UserInfoType = Tables<"user_info">;

const EditProfile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams?.get("userId");
  const [profile, setProfile] = useState<UserInfoType | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<UserInfoType | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 미리보기 URL 상태 추가

  const supabase = createClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      setLoading(true);
      const { data, error } = await supabase.from("user_info").select("*").eq("id", userId).single();

      if (error) {
        console.error("프로필 불러오기 오류", error);
        setError("프로필 정보를 가져오는 데 실패했습니다.");
      } else {
        setProfile(data);
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
    <div className="flex flex-col justify-center h-screen">
      <form onSubmit={handleSubmit} className="flex-grow flex flex-col items-center justify-center space-y-4">
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex-shrink-0 mb-4">
            <Image
              src={previewUrl || "/images/profile.png"}
              alt="프로필 이미지"
              width={200}
              height={200}
              className="rounded-full border-2 border-gray-300 object-cover"
            />
            <label htmlFor="file-upload" className="absolute right-0 bottom-0 mb-1 mr-1 cursor-pointer">
              <input type="file" id="file-upload" onChange={handleFileChange} className="hidden" />
              <Button
                type="button"
                onClick={() => document.getElementById("file-upload")?.click()}
                className="bg-gray-500 w-[40px] h-[40px] text-white rounded-full p-1 shadow-md hover:bg-gray-600 transition duration-150"
              >
                <Camera size={20} />
              </Button>
            </label>
          </div>
          <Input
            type="text"
            label="닉네임"
            value={selectedProfile?.nickname || ""}
            onChange={(e) => setSelectedProfile((prev) => ({ ...prev!, nickname: e.target.value }))}
            required
            className="max-w-xs text-center outline-none"
            description={"최대 12 글자"}
          />
          <Input
            type="text"
            label="상태 메시지"
            value={selectedProfile?.state_msg || ""}
            onChange={(e) => setSelectedProfile((prev) => ({ ...prev!, state_msg: e.target.value }))}
            required
            className="max-w-xs text-center outline-none"
            description={"최대 12 글자"}
          />
        </div>
        <Button type="submit" disabled={loading} className="mt-auto w-full">
          {loading ? <Spinner size="sm" /> : "수정 완료"}
        </Button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </form>
    </div>
  );
};
export default EditProfile;
