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
  return (
    <form className="sticky bottom-[55px] flex w-full bg-gray-900 p-4" onSubmit={onSubmit}>
      <div className="flex-grow relative">
        <input
          className="w-full h-10 py-2 pl-5 pr-[46px] rounded-[50px] border border-gray-900 text-xs"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="메세지를 입력해주세요."
          aria-label="메시지 입력"
        />
        <button
          className="absolute h-[26px] right-2 top-1/2 -translate-y-1/2 pl-2 "
          type="submit"
          aria-label="메시지 전송"
        >
          <img src="/assets/send.svg" alt="전송" />
        </button>
      </div>
      {/* 추후 녹음 진행 여부에 따라 아이콘 변경 예정 */}
      <button
        type="button"
        className={`ml-2 ${isRecording ? "" : ""} text-white`}
        onClick={isRecording ? onStopRecording : onStartRecording}
        aria-label={isRecording ? "음성 녹음 중지" : "음성 녹음 시작"}
      >
        {isRecording ? <img src="/assets/mike.svg" alt="녹음 시작" /> : <img src="/assets/mike.svg" alt="녹음 중지" />}
      </button>
    </form>
  );
};

export default ChatInput;
