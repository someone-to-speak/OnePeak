import React from "react";

interface NotificationToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
}

const NotificationToggle = ({ isEnabled, onToggle }: NotificationToggleProps) => {
  return (
    <div
      onClick={onToggle}
      className={`w-12 h-7 px-[3px] py-0.5 rounded-full flex justify-between items-center gap-2.5 cursor-pointer ${
        isEnabled ? "bg-[#96db5b]" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow transform duration-300 ease-in-out ${
          isEnabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </div>
  );
};

export default NotificationToggle;
