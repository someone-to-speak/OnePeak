import Image from "next/image";
import caretleft from "@/../public/images/caret-left.svg";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  title: string; // 버튼에 표시할 텍스트
}

const BackButton: React.FC<BackButtonProps> = ({ title }) => {
  const router = useRouter();

  return (
    <div className="w-full h-12 justify-start inline-flex">
      <button onClick={() => router.back()} className="text-[#0c0c0c] text-lg font-bold font-['SUIT'] leading-[27px]">
        <div className="flex flex-row items-center gap-1.5">
          <Image src={caretleft} alt={"caret-left"} className="w-6 h-6 left-0 top-0" />
          {title}
        </div>
      </button>
    </div>
  );
};

export default BackButton;
