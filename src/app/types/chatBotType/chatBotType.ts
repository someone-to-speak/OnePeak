export type Message = {
  role: "user" | "system" | "assistant";
  content: string;
  timestamp: string;
};

export type CalendarDate = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
};

export type AudioRecorderState = {
  isRecording: boolean;
  mediaRecorder: MediaRecorder | null;
  chunks: Blob[];
};
