import Image from "next/image";
import caretleft from "@/../public/images/CaretLeft.svg";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  title: string; // 버튼에 표시할 텍스트
}

const BackButton: React.FC<BackButtonProps> = ({ title }) => {
  const router = useRouter();

  return (
    <div className="w-full h-12 justify-start items-center gap-1.5 inline-flex">
      <button onClick={() => router.back()} className="flex flex-row items-center">
        <Image
          src={caretleft}
          alt={"CaretLeft"}
          className="grow shrink basis-0 text-[#0c0c0c] text-lg font-bold font-['SUIT'] leading-[27px]"
        />
        {title}
      </button>
    </div>
  );
};

export default BackButton;
