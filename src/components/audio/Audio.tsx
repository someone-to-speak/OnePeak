import { useState, useEffect } from "react";
import { Typography } from "../ui/typography";
import Icon from "../ui/icon";

const CustomAudio = ({ url }: { url: string }) => {
  const audioFile = new Audio(url);
  const [playing, isPlaying] = useState(false);
  // const [duration, setDuration] = useState("00:00");
  const [currentTime, setCurrentTime] = useState("00:00");

  useEffect(() => {
    // audioFile.onloadeddata = () => {
    //   const audioDuration = audioFile.duration;
    //   if (typeof audioDuration === "number" && !isNaN(audioDuration)) {
    //     setDuration(formatTime(audioDuration));
    //   }
    // };

    if (audioFile) {
      audioFile.ontimeupdate = () => {
        const duration = audioFile.duration;
        const currentTime = audioFile.currentTime;
        if (duration === currentTime) {
          isPlaying(false);
          audioFile.currentTime = 0;
          audioFile.pause();
          setCurrentTime(formatTime(audioFile.currentTime));
        } else {
          setCurrentTime(formatTime(currentTime));
        }
      };
    }

    const cleanUp = () => {
      if (audioFile) {
        audioFile.onloadeddata = null;
        audioFile.ontimeupdate = null;
      }
    };

    return () => {
      cleanUp();
    };
  }, [audioFile]);

  const handlePlayPause = () => {
    if (audioFile) {
      if (playing) {
        audioFile.pause();
      } else {
        audioFile.play();
      }
      isPlaying((pre) => !pre);
    }
  };

  // const handleStop = () => {
  //   audioFile.pause();
  //   audioFile.currentTime = 0;
  //   isPlaying(false);
  // };

  // const handleSkipBack = () => {
  //   const newTime = audioFile.currentTime - 10;
  //   audioFile.currentTime = newTime < 0 ? 0 : newTime;
  // };

  // const handleSkipForward = () => {
  //   const newTime = audioFile.currentTime + 10;
  //   audioFile.currentTime = newTime > audioFile.duration ? audioFile.duration : newTime;
  // };

  return (
    <div className="flex gap-[10px] py-2 px-3 bg-secondary-900 rounded-2xl rounded-br-none">
      <Typography size={12} className="font-medium">
        {currentTime}
      </Typography>
      {playing ? (
        <Icon name={"pause"} size={12} color={"#FFB733"} onClick={handlePlayPause} />
      ) : (
        <Icon name={"play"} size={12} color={"#FFB733"} onClick={handlePlayPause} />
      )}
    </div>
  );
};

export default CustomAudio;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};
