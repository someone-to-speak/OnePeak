import { Typography } from "../typography";
import Button from "@/components/ui/button/index";

interface ReviewContentProps {
  situation: string;
  level: number;
}

const ReviewContent = ({ situation, level }: ReviewContentProps) => {
  return (
    <div className="w-full p-3 bg-primary-600 mb-2">
      <Typography size={14} as="h1" className="font-bold text-black">
        <div className="flex flex-row justify-between">
          <p>{situation}</p>
          <p>{level}</p>
        </div>
      </Typography>

      <Typography size={14} className="font-normal">
        Can I get The One Coffee
      </Typography>
      <Button text="복습하기" variant="disabled" className="w-full rounded-[10px]" />
    </div>
  );
};

export default ReviewContent;
