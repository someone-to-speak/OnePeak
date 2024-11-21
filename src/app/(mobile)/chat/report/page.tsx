"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import reportIcon from "@/assets/report-icon.svg";
import cameraIcon from "@/assets/camera-icon.svg";
import { insertReportInfo, uploadReportImages } from "@/api/supabase/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserClient } from "@/api/supabase/getUserClient";

// 쿼리스트링 받아오는 방법, (+ queryString은 params가 아니고 searchParams로 온다)
export type Props = {
  searchParams: {
    targetId: string;
  };
};

const ReportPage = ({ searchParams }: Props) => {
  const queryClient = useQueryClient();
  const [previewImgs, setPreviewImgs] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [content, setContent] = useState<string>("");
  const targetId = searchParams.targetId;

  const { data } = useQuery({
    queryKey: ["targetUserInfo"],
    queryFn: () => getUserClient()
  });

  const userId = data?.id;

  const { mutate } = useMutation({
    mutationFn: ({
      content,
      userId,
      targetId,
      imageUrls
    }: {
      content: string;
      userId: string;
      targetId: string;
      imageUrls: string[];
    }) => insertReportInfo({ content, targetId, userId, imageUrls }),
    onSuccess: () => {
      alert("신고가 접수되었습니다");
      console.log("targetId", targetId);
      console.log("userId", userId);
      queryClient.invalidateQueries({ queryKey: ["blockDetail", targetId] });
    }
  });

  // useRef를 사용하여 div태그 클릭하면 input이 작동하게 함
  // input 요소를 참조할 useRef
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // div 클릭 시 파일 입력 트리거
  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 파일 선택 시 실행될 함수
  const handleImgFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // 선택된 파일 1개를 가진 배열
    const selectedImg = e.target.files?.[0];
    // 선택한 모든 파일을 담은 배열
    const imgUrlLists: string[] = [...previewImgs];

    if (selectedImg) {
      setFiles((prev) => [...prev, selectedImg]);
      const currentImgUrl = URL.createObjectURL(selectedImg!);
      imgUrlLists.push(currentImgUrl);
    }

    if (selectedImg && imgUrlLists.length > 3) {
      return alert("이미지는 3개까지만 업로드가 가능합니다");
    }

    setPreviewImgs(imgUrlLists);
  };

  // onChange를 통해서 함수가 돌아감 -> 같은 이미지 파일 연속으로 선택하면 변한게 없어서 onChange가 작동X -> onClick 할 때 마다 input에 있는 value값을 빈문자열로 초기화 해서 같은 파일 들어가더라도 변화를 만듬
  const resetInputValue = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.value = "";
  };

  // 제출 버튼
  const handleSubmit = async () => {
    if (!content) {
      return alert("사유를 적어주세요");
    }

    if (previewImgs.length === 0) {
      return alert("사진을 등록해주세요");
    }

    if (!userId) {
      return;
    }

    if (files.length !== 0) {
      //버켓에 이미지 추가하기
      const data = await uploadReportImages(files);

      //버켓에서 이미지 주소 받아오기
      const imageUrls = data.map((data) => {
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/report-image/${data.path}`;
      });

      mutate({ imageUrls, content, targetId, userId });
      setFiles([]);
      setPreviewImgs([]);
      setContent("");
    }
  };

  // 버튼 클릭시 파일 리스트에서 이미지 삭제
  const handleDeleteImg = (index: number) => {
    const updatedImgs = previewImgs.filter((_, imgIndex) => imgIndex !== index);
    setPreviewImgs(updatedImgs);
  };

  return (
    <div className="w-full px-[16px] bg-[#FFF] ">
      <div className=" flex gap-[6px] mb-[70px] md:mt-[70px] ">
        <Image src={reportIcon} alt="신고하기 아이콘" className="md:hidden" />
        <h1
          className="text-[#0c0c0c] text-lg font-bold font-['SUIT']
md:text-[#0c0c0c] md:text-4xl md:font-bold md:font-['SUIT'] "
        >
          신고하기
        </h1>
      </div>{" "}
      <div className="md:max-w-[454px] md:flex md:flex-col md:mx-auto">
        <h3 className="text-[#0c0c0c] mb-[6px] text-lg font-bold font-['SUIT']">사진첨부</h3>
        <div
          onClick={handleDivClick}
          className="w-[84px] mb-[6px] bg-[#E7F7D9] cursor-pointer p-[20.5px] flex flex-col items-center rounded-[10px] md:w-[84px] md:mr-auto "
        >
          <Image src={cameraIcon} alt="카메라 아이콘" />
          <p className="text-[#7bd232] text-[10px] font-medium font-['SUIT'] ">사진 등록</p>
        </div>
        <div className=" mb-[28px] flex flex-wrap gap-[17px] ">
          {previewImgs.map((imgUrl, index) => (
            <div key={index} className="w-[30%] flex flex-col justify-center items-center ">
              <Image
                className="rounded-[10px]"
                src={imgUrl}
                alt="미리보기이미지"
                width={0}
                height={0}
                style={{ width: "100%", height: "200px" }}
              />
              <button onClick={() => handleDeleteImg(index)}>[파일 삭제]</button>
            </div>
          ))}
        </div>
        <input
          type="file"
          onChange={handleImgFile}
          onClick={resetInputValue}
          multiple
          className="hidden"
          ref={fileInputRef}
        />{" "}
        <h3 className="text-[#0c0c0c] mt-[28px] mb-[6px] text-lg font-bold font-['SUIT']'] ">신고사유</h3>
        <textarea
          placeholder="사유를 작성해 주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-[20px] flex items-start border border-[#d9d9d9] rounded-[10px] bg-[#FDFDFD] "
        ></textarea>
        <div className=" mt-[238px] flex gap-[10px] mb-[56px] ">
          <button className="w-full p-[10px] rounded-[10px] bg-[#D9D9D9] text-center text-[#fcfcfc] text-base font-medium font-['SUIT'] ">
            취소
          </button>
          <button
            onClick={() => handleSubmit()}
            className=" w-full p-[10px] rounded-[10px] bg-[#F50000] text-center text-[#fcfcfc] text-base font-medium font-['SUIT'] "
          >
            신고
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
