import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
import webpush, { PushSubscription } from "web-push";

const supabase = createClient();

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!
};

// VAPID 설정
webpush.setVapidDetails("mailto:http://localhost:3000", vapidKeys.publicKey, vapidKeys.privateKey);

export async function POST(req: NextRequest) {
  const { userId, title, message } = await req.json();

  // 알림 데이터 저장
  const { data: notificationData, error: notificationError } = await supabase
    .from("notifications")
    .insert([{ user_id: userId, title, message }]);

  // 알림 저장 오류 처리
  if (notificationError) {
    console.error("Error saving notification:", notificationError.message);
    return NextResponse.json({ message: "Error saving notification" }, { status: 500 });
  }
  console.log("Notification saved:", notificationData);

  // 사용자의 구독 정보를 가져오기
  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("subscription")
    .eq("user_id", userId);

  // 구독 정보 오류 처리
  if (subscriptionError || !subscriptionData || subscriptionData.length === 0) {
    console.error("Error fetching subscription or no subscription found:", subscriptionError?.message);
    return NextResponse.json({ message: "No subscription found for this user" }, { status: 404 });
  }

  // 각 구독 정보를 처리하여 푸시 알림 전송
  for (const sub of subscriptionData) {
    let subscription: PushSubscription;
    try {
      // JSON 파싱
      subscription = JSON.parse(sub.subscription as string) as PushSubscription;

      // `PushSubscription` 필드 검증
      if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
        throw new Error("Invalid subscription structure");
      }

      // 푸시 알림 보내기
      await webpush.sendNotification(subscription, JSON.stringify({ title, message }));
      console.log("Notification sent successfully:", { title, message });
    } catch (err) {
      console.error("Error processing subscription:", err);
    }
  }

  return NextResponse.json({ message: "Notifications processed", notification: notificationData }, { status: 200 });
}
