"use client";

import { addNotification } from "@/utils/notifications/notifications";
import { useState } from "react";
import { Tables } from "../../../database.types";

type NotificationType = Tables<"notifications">;

type UserProfileProps = {
  userId: string;
};

const AddNotifications = ({ userId }: UserProfileProps) => {
  const [message, setMessage] = useState("");

  const handleAddNotification = async () => {
    const notificationData: Omit<NotificationType, "id"> = {
      user_id: userId,
      title: "!!?",
      message: "이것은 알림 내용입니다??????????.",
      is_read: false,
      created_at: new Date().toISOString()
    };

    addNotification(notificationData);

    if (notificationData) {
      setMessage("추가되었스니다.!!!");
    } else {
      setMessage("실패했습니다.");
    }
  };

  return (
    <div>
      <h1>PWA 알림 테스트</h1>
      <button onClick={handleAddNotification}>알림 추가</button>
      <p>{message}</p>
    </div>
  );
};
export default AddNotifications;
