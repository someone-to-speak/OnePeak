import { useState, useEffect, useMemo } from "react";
import { Typography } from "../ui/typography";
import Icon from "../ui/icon";

const CustomAudio = ({ url, isOwned }: { url: string; isOwned: boolean }) => {
  const audioFile = useMemo(() => new Audio(url), [url]);
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
    <div
      className={`flex justify-end items-center gap-[10px] py-2 px-3 bg-gray-900 rounded-2xl ${
        isOwned ? "rounded-br-none" : "rounded-tl-none"
      } w-max`}
    >
      <Typography size={12} className="font-medium cursor-default md:text-[16px]">
        {currentTime}
      </Typography>
      {playing ? (
        <Icon
          name={"pause"}
          size={12}
          color={"#FFB733"}
          className="fill-current text-[#FFB733] cursor-pointer md:w-[16px] md:h-[16px]"
          onClick={handlePlayPause}
        />
      ) : (
        <Icon
          name={"play"}
          size={12}
          color={"#FFB733"}
          className="fill-current text-[#FFB733] cursor-pointer md:w-[16px] md:h-[16px]"
          onClick={handlePlayPause}
        />
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
