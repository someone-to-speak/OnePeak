import React from "react";
import { Typography } from "../typography";
import Link from "next/link";

const Footer = () => {
  const developers = [
    { name: "권다정", github: "https://github.com/kwondajung" },
    { name: "김병엽", github: "https://github.com/Byoung-yup" },
    { name: "김서연", github: "https://github.com/kimseoyun98" },
    { name: "안수영", github: "https://github.com/soo0297" },
    { name: "박민정", github: "https://github.com/mingjeongg" }
  ];

  return (
    <div className="mt-[70px] py-10 px-3 flex flex-col gap-6 border-t border-gray-800">
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
        <Typography weight={"medium"}>
          개발자:{" "}
          {developers.map((dev, index) => (
            <span key={dev.name}>
              <Link
                href={dev.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:font-bold"
              >
                {dev.name}
              </Link>
              {index < developers.length - 1 && " ㅣ "}
            </span>
          ))}
        </Typography>
        <Typography weight={"medium"}>주소 : 서울특별시 강남구 테헤란로44길 8 12층 ㅣ전화 : 1234-1234</Typography>
      </div>
    </div>
  );
};

export default Footer;
