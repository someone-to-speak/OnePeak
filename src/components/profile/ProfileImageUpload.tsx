"use client";

import { useState } from "react";
import { uploadImage } from "@/app/actions/imageUpload";

interface ProfileImageUploadProps {
  onUploadSuccess: (url: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const data = await uploadImage(file); // uploadImage에서 반환된 data를 사용
        const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Profile_url/${data.path}`; // URL 구성
        setUploadUrl(imageUrl);
        onUploadSuccess(imageUrl); // 부모 컴포넌트에 URL 전달
        alert("Image uploaded successfully!");
      } catch (error) {
        console.error(error);
        alert("Failed to upload image");
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>업로드</button>
      {uploadUrl && <img src={uploadUrl} alt="프로필 이미지" />}
    </div>
  );
};

export default ProfileImageUpload;
