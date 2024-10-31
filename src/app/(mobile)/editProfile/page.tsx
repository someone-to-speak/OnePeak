"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { uploadImage } from "@/utils/myPage/imageUpload";
import { UserProfileType } from "@/app/types/user/userProfileType";

const EditProfile = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("유저 오류", userError);
        return;
      }

      if (user) {
        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError) {
          console.error("프로필 오류", profileError);
        } else {
          setProfile(data);
          setPreviewUrl(data.profile_url); // 기존 프로필 URL을 미리보기로 설정
        }
      }
    };

    fetchUserProfile();
  }, [supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("파일을 선택해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const data = await uploadImage(file); // file을 그대로 전달
      const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Profile_url/${data.path}`;

      // 기존 프로필 URL을 유지하되, 업로드한 이미지 URL을 프로필에 업데이트
      setProfile((prev) => (prev ? { ...prev, profile_url: imageUrl } : null));

      alert("이미지가 성공적으로 업로드 되었습니다!");
    } catch {
      setError("이미지 업로드에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile?.profile_url) {
      alert("프로필 이미지를 업로드해야 합니다.");
      return; // 프로필 이미지가 없으면 제출하지 않음
    }

    if (profile) {
      const { error } = await supabase
        .from("profiles")
        .update({
          nickname: profile.nickname,
          profile_url: profile.profile_url,
          state_msg: profile.state_msg
        })
        .eq("user_id", profile.user_id);

      if (error) {
        alert("프로필 업데이트에 실패했습니다.");
      } else {
        alert("프로필이 성공적으로 업데이트되었습니다.");
        router.push("/myPage");
      }
    }
  };

  return (
    <div>
      <h1>프로필 수정하기</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            프로필 이미지:
            <input type="file" onChange={handleFileChange} />
            <button type="button" onClick={handleUpload} disabled={loading}>
              {loading ? "업로드 중..." : "업로드"}
            </button>
            {previewUrl && <Image src={previewUrl} alt="미리보기 이미지" width={200} height={200} />}
          </label>
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <div>
          <label>
            닉네임:
            <input
              type="text"
              name="nickname"
              value={profile?.nickname || ""}
              onChange={(e) => setProfile((prev) => (prev ? { ...prev, nickname: e.target.value } : null))}
            />
          </label>
        </div>
        <div>
          <label>
            상태 메시지:
            <input
              type="text"
              name="state_msg"
              value={profile?.state_msg || ""}
              onChange={(e) => setProfile((prev) => (prev ? { ...prev, state_msg: e.target.value } : null))}
            />
          </label>
        </div>
        <button type="submit">수정 완료</button>
      </form>
    </div>
  );
};

export default EditProfile;
