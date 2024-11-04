type ChatInputProps = {
  userInput: string;
  setUserInput: (input: string) => void;
  isRecording: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
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
    <form className="sticky bottom-[55px] flex w-full bg-gray-200 p-4" onSubmit={onSubmit}>
      <input
        className="flex-grow p-2 rounded border border-gray-400"
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="메세지를 입력해주세요."
        aria-label="메시지 입력"
      />

      <button
        type="button"
        className={`ml-2 px-4 py-2 rounded ${isRecording ? "bg-red-500" : "bg-gray-500"} text-white`}
        onClick={isRecording ? onStopRecording : onStartRecording}
        aria-label={isRecording ? "음성 녹음 중지" : "음성 녹음 시작"}
      >
        {isRecording ? "🎤 전송" : "🎤 음성입력"}
      </button>

      <button
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        type="submit"
        aria-label="메시지 전송"
      >
        전송
      </button>
    </form>
  );
};

export default ChatInput;
