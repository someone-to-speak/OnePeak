import Image from "next/image";
import caretleft from "@/../public/images/CaretLeft.svg";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  title: string; // 버튼에 표시할 텍스트
}

const BackButton: React.FC<BackButtonProps> = ({ title }) => {
  const router = useRouter();

  return (
    <div className="flex items-center mb-4">
      <button onClick={() => router.back()} className="flex flex-row items-center text-gray-200">
        <Image src={caretleft} alt={"CaretLeft"} /> {title}
      </button>
    </div>
  );
};

export default BackButton;
