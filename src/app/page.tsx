import CustomizedLearn from "@/components/chatBot/CustomizedLearn";
import Reviewing from "@/components/chatBot/Reviewing";
import TodayLearn from "@/components/chatBot/TodayLearn";

export default function Home() {
  return (
    <div className="w-full h-[1000px] bg-orange-400">
      ONE PEAK
      <div className="h-[200px]"></div>
      <TodayLearn />
      <CustomizedLearn />
      <Reviewing />
    </div>
  );
}
