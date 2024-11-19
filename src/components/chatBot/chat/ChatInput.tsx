import Image from "next/image";
import sendIcon from "@/assets/send.svg";
import mikeIcon from "@/assets/mike.svg";

type ChatInputProps = {
  userInput: string;
  setUserInput: (input: string) => void;
  isRecording: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onEndChat: () => void;
};

const ChatInput: React.FC<ChatInputProps> = ({
  userInput,
  setUserInput,
  isRecording,
  onSubmit,
  onStartRecording,
  onStopRecording
}) => {
  const handleRecordingClick = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <form className="sticky bottom-0 flex w-full bg-gray-900 p-4" onSubmit={onSubmit}>
      <div className="flex-grow relative">
        <input
          className="w-full h-10 py-2 pl-5 pr-[46px] rounded-[50px] border border-gray-900 text-[12px] md:text-[16px]"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={isRecording ? "🎤 음성을 녹음 중입니다..." : "메세지를 입력해주세요."}
          disabled={isRecording}
          aria-label="메시지 입력"
        />
        <button
          className="absolute h-[26px] right-2 top-1/2 -translate-y-1/2 pl-2 "
          type="submit"
          aria-label="메시지 전송"
        >
          {isRecording ? "" : <Image src={sendIcon} alt="녹음 중지" width={20} height={20} />}
        </button>
      </div>
      <button
        type="button"
        className={`ml-2 ${isRecording ? "" : ""} text-white`}
        onClick={handleRecordingClick}
        aria-label={isRecording ? "음성 녹음 중지" : "음성 녹음 시작"}
      >
        {isRecording ? (
          <Image src={sendIcon} alt="녹음 시작" width={20} height={20} />
        ) : (
          <Image src={mikeIcon} alt="녹음 중지" width={20} height={20} />
        )}
      </button>
    </form>
  );
};

export default ChatInput;
