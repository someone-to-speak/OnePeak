import CustomizedLearn from "@/components/chatBot/aiTutorHome/CustomizedLearn";
import Reviewing from "@/components/chatBot/aiTutorHome/Reviewing";
import TodayLearn from "@/components/chatBot/aiTutorHome/TodayLearn";

export default function Home() {
  return (
    <div className="w-full h-[1000px] bg-gray-100 p-5">
      <div className="h-10"></div>
      <TodayLearn />
      <CustomizedLearn />
      <Reviewing />
    </div>
  );
}
