"use client";

const NotificationButton = ({ userId }: { userId: string }) => {
  const sendNotification = async () => {
    const title = "새 알림";
    const message = "알림 내용입니다.";

    const response = await fetch("/api/sendNoti", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId, title, message })
    });
  };

  return <button onClick={sendNotification}>알림</button>;
};

export default NotificationButton;
