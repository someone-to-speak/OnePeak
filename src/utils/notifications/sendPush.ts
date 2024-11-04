// import webPush from "web-push";

// const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
// const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";

// // VAPID 키 설정
// webPush.setVapidDetails("http://localhost:3000", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// interface PushSubscription {
//   endpoint: string;
//   expirationTime: number | null;
//   keys: {
//     p256dh: string;
//     auth: string;
//   };
// }

// interface NotificationData {
//   title: string;
//   message: string;
// }

// // 푸시 알림 전송 함수
// const sendPushNotification = async (subscription: PushSubscription, data: NotificationData) => {
//   try {
//     await webPush.sendNotification(subscription, JSON.stringify(data));
//     console.log("Push notification sent successfully!", subscription), JSON.stringify(data);
//   } catch (error) {
//     console.error("Failed to send push notification:", error);
//   }
// };

// export default sendPushNotification;
