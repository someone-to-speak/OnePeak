"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../../../../database.types";
import { uploadImage } from "@/utils/myPage/imageUpload";
import { Input, Button, Spinner } from "@nextui-org/react";
import { Camera } from "lucide-react";
import Image from "next/image";

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
    <div className="flex flex-col justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center mt-[100px]">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="w-[200px] h-[200px] overflow-hidden rounded-full shadow-md relative">
              <Image
                fill
                src={previewUrl || "/images/profile.png"}
                alt="프로필 이미지"
                className="rounded-full object-cover h-[100px] w-[100px]"
                priority
                sizes="(max-width: 768px) 100px, (max-width: 1200px) 200px, 200px"
              />
            </div>
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
          <div className="flex flex-col">
            <Input
              type="text"
              value={selectedProfile?.nickname}
              onChange={(e) => setSelectedProfile((prev) => ({ ...prev!, nickname: e.target.value }))}
              required
              className="max-w-xs text-center"
            />
            <Input
              type="text"
              value={selectedProfile?.state_msg}
              onChange={(e) => setSelectedProfile((prev) => ({ ...prev!, state_msg: e.target.value }))}
              required
              className="max-w-xs text-center"
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="absolute inset-x-0 bottom-[58px] h-16 bg-gray-200 w-full text-center p-2"
        >
          {loading ? <Spinner size="sm" /> : "수정 완료"}
        </Button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </form>
    </div>
  );
};
export default EditProfilePage;
