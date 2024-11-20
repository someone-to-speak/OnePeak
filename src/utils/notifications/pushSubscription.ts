import { createClient } from "@/utils/supabase/client";

// VAPID 키를 브라우저가 이해가되게 Uint8Array 형식으로 변환하는 함수
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4); // Base64 인코딩의 길이를 4의 배수로 맞춤
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/"); // Base64 URL-safe 포맷을 일반 포맷으로 변환
  const rawData = window.atob(base64); // Base64 문자열을 디코딩
  return new Uint8Array(Array.from(rawData, (char) => char.charCodeAt(0))); // 디코딩된 데이터를 Uint8Array로 변환
}

// 알림 권한 요청 및 사용자를 푸시 알림에 구독
export async function requestNotificationPermission(userId: string): Promise<boolean> {
  const supabase = createClient(); // Supabase 클라이언트 생성
  const permission = await Notification.requestPermission(); // 브라우저에서 알림 권한 요청

  if (permission === "granted") {
    console.log("Notification permission granted."); // 권한 부여 성공 시 로그 출력

    // 사용자가 이미 알림 구독되어 있는지 확인
    const { data: existingSubscription } = await supabase
      .from("subscriptions")
      .select("subscription")
      .eq("user_id", userId)
      .single();

    if (existingSubscription) {
      console.log("User is already subscribed to notifications."); // 이미 구독된 경우
      return false; // 구독 작업을 수행하지 않고 종료
    } else {
      await subscribeUserToPush(userId); // 구독이 없는 경우 새로 구독
    }

    // 알림 수신 구독
    await subscribeToNotifications();
    return true;
  } else {
    console.error("Unable to get permission to notify."); // 권한 부여 실패 시 오류 로그
    return false;
  }
}

// 사용자를 푸시 알림에 구독시키는 함수
export async function subscribeUserToPush(userId: string) {
  console.log("subscribeUserToPush"); // 함수 호출 로그
  const supabase = createClient(); // Supabase 클라이언트 생성
  try {
    // 서비스 워커 등록
    const registration = await navigator.serviceWorker.register("/service-worker.js");
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY; // VAPID 공개 키 로드
    console.log(registration); // 서비스 워커 등록 정보 출력

    if (!vapidPublicKey) {
      console.error("VAPID Public Key is missing."); // VAPID 키가 없는 경우 로그 출력
      return;
    }

    // 브라우저에서 푸시 구독 생성
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true, // 알림이 사용자에게 항상 보이도록 설정
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) // VAPID 키 설정
    });

    console.log("User is subscribed:", subscription); // 구독 정보 출력

    // 구독 정보를 Supabase에 저장
    const { error } = await supabase
      .from("subscriptions")
      .upsert([{ user_id: userId, subscription: JSON.stringify(subscription) }]);

    if (error) {
      console.error("Error saving subscription to Supabase:", error); // 저장 실패 시 로그 출력
    } else {
      console.log("Subscription saved to Supabase successfully!"); // 저장 성공 시 로그 출력
    }
  } catch (error) {
    console.error("Failed to subscribe user:", error); // 구독 실패 시 오류 출력
  }
}

// 알림을 수신하고 처리하는 함수
export async function subscribeToNotifications() {
  const supabase = createClient();

  // 알림 구독 설정: 데이터베이스의 `notifications` 테이블에서 새 레코드 삽입을 감지
  supabase
    .channel("notifications")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications" },
      async (payload: { new: { title: string; message: string } }) => {
        console.log("New notification:", payload); // 새 알림 데이터 로그 출력

        const { title, message } = payload.new; // 알림 제목과 메시지 추출
        const registration = await navigator.serviceWorker.ready; // 활성화된 서비스 워커 가져오기

        // 알림 표시
        registration.showNotification(title, {
          body: message, // 알림 본문
          icon: "/icon-192x192.png", // 알림 아이콘
          badge: "/icon-192x192.png" // 알림 배지 아이콘
        });
      }
    )
    .subscribe();

  console.log("Subscribed to notifications channel."); // 알림 구독 완료 로그 출력
}
