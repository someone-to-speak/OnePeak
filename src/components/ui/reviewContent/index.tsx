import { Typography } from "../typography";
import Button from "@/components/ui/button/index";

interface ReviewContentProps {
  situation: string;
  level: number;
}

const ReviewContent = ({ situation, level }: ReviewContentProps) => {
  return (
    <div className="w-full p-3">
      <Typography size={14} as="h1" className="font-bold text-black">
        {situation}
      </Typography>
      <Typography size={14} className="font-normal">
        {situation}
        {level}
      </Typography>
      <Button text="복습하기" variant="default" className="" />
    </div>
  );
};

export default ReviewContent;
