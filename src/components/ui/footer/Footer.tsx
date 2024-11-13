import React from "react";
import { Typography } from "../typography";

const Footer = () => {
  return (
    <div className="mt-[70px] py-10 px-3 flex flex-col gap-6">
      <Typography size={16} weight={"medium"} className="text-#000">
        서비스 소개
      </Typography>
      <div className="flex gap-10 text-gray-400">
        <Typography weight={"medium"}>이용약관</Typography>
        <Typography weight={"medium"}>개인정보처리방침</Typography>
        <Typography weight={"medium"}>운영정책</Typography>
        <Typography weight={"medium"}>이용자보호 비전과 계획</Typography>
        <Typography weight={"medium"}>청소년보호정책</Typography>
      </div>
      <div className="flex flex-col text-gray-400">
        <Typography weight={"medium"}>ONE PEAK 사업자 정보</Typography>
        <Typography weight={"medium"}>개발자 : 권다정 ㅣ 김병엽 ㅣ 김서연 ㅣ안수영 ㅣ 박민정</Typography>
        <Typography weight={"medium"}>주소 : 서울특별시 강난구 테헤란로44길 8 12층 ㅣ전화 : 1234-1234</Typography>
      </div>
    </div>
  );
};

export default Footer;
