import { insertLanguageInfo, uploadLanguageImage } from "@/api/route";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";

const AddLanguageForm = () => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [language, setLanguage] = useState<string>("");

  const { mutate } = useMutation({
    mutationFn: ({ imageUrl, language }: { imageUrl: string; language: string }) =>
      insertLanguageInfo({ imageUrl, language }),
    onSuccess: () => {
      alert("해당 언어를 활성화하였습니다");
      queryClient.invalidateQueries({ queryKey: ["languagesInfo"] });
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("파일을 선택해주세요");
      return;
    }

    // 버켓에 이미지 추가하기
    const data = await uploadLanguageImage(file);
    // 버켓에서 이미지 주소 받아오기
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/language-image/${data.path}`;

    // 받아온 이미지 주소를 langauge 테이블에 넣기
    // try {
    //   await insertLanguageInfo(imageUrl, language);
    //   alert("언어와 이미지를 추가하였습니다");
    //   setPreviewUrl("");
    //   setLanguage("");
    // } catch (error) {
    //   console.error("Error inserting language image:", error);
    //   alert("이미지 삽입 중 오류가 발생했습니다.");
    // }
    mutate({ imageUrl, language });
    setPreviewUrl("");
    setLanguage("");
  };
  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full mb-4 border border-gray-300 rounded-md p-2"
      />
      {previewUrl && (
        <Image src={previewUrl} alt="미리보기 이미지" width={200} height={200} className="mb-4 rounded-md" />
      )}
      <input
        type="text"
        value={language}
        placeholder="추가할 언어"
        onChange={(e) => {
          setLanguage(e.target.value);
        }}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md"
      />
      <button onClick={handleUpload} className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        추가
      </button>
    </div>
  );
};

export default AddLanguageForm;
