// "use client";
// import { uploadImage } from "@/utils/myPage/imageUpload";
// import { createClient } from "@/utils/supabase/client";
// import React, { useState } from "react";

// const page = () => {
//   const browserClient = createClient();

//   const [file, setFile] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(false)
//   const [language, setLanguage] = useState("");
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState(false)

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selecedFile = e.target.files[0];
//    if(selectedFile){
//     setFile(selectedFile)
//     const objectUrl = URL.createObjectURL(selecedFile)
//     setPreviewUrl(objectUrl)
//    }};

// const handleUpload = async () => {
//     if (!file){
//         alert('파일을 선택해주세요')
// return
//     }
// setIsLoading(true)
// try{
//     const data = await uploadImage(file)
//     const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/language-image/${data.path}`;
//   // 기존 프로필 URL을 유지하되, 업로드한 이미지 URL을 프로필에 업데이트
//   set((prev) => (prev ? { ...prev, profile_url: imageUrl } : null));

//   alert("이미지가 성공적으로 업로드 되었습니다!");
// }
// }

//   return (
//     <div>
//       {/* <p>{languageImg}</p> */}
//       <input type="file" onChange={handleFileChange} />
//       <input
//         type="text"
//         value={language}
//         placeholder="추가할 언어"
//         onChange={(e) => {
//           setLanguage(e.target.value);
//         }}
//       />
//       <button onClick={handleUpload}>추가</button>
//     </div>
//   );
// };

// export default page;
