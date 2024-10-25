"use client";

import { useState } from "react";

const ProfileImageUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/image", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    setLoading(false);

    if (data.error) {
      alert(data.error);
    } else {
      alert("프로필 이미지가 성공적으로 업로드되었습니다.");
      console.log("업로드url:", data.url);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "업로드 중..." : "프로필 이미지 업로드"}
      </button>
    </div>
  );
};

export default ProfileImageUpload;
