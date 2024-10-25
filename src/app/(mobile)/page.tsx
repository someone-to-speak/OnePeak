import CustomizedLearn from "@/components/chatBot/aiTutorHome/CustomizedLearn";
import Reviewing from "@/components/chatBot/aiTutorHome/Reviewing";
import TodayLearn from "@/components/chatBot/aiTutorHome/TodayLearn";

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
