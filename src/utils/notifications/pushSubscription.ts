import { createClient } from "@/utils/supabase/client";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array(Array.from(rawData, (char) => char.charCodeAt(0)));
}

export async function requestNotificationPermission(userId: string): Promise<boolean> {
  const supabase = createClient();
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    console.log("Notification permission granted.");

    const { data: existingSubscription } = await supabase
      .from("subscriptions")
      .select("subscription")
      .eq("user_id", userId)
      .single();

    if (!existingSubscription) {
      await subscribeUserToPush(userId);
    } else {
      alert("이미 알림을 허용하였습니다.");
      return false; // 이미 구독된 경우
    }

    // 알림 구독을 위한 설정
    await subscribeToNotifications();
    return true;
  } else {
    console.error("Unable to get permission to notify.");
    return false;
  }
}

export async function subscribeUserToPush(userId: string) {
  const supabase = createClient();
  try {
    const registration = await navigator.serviceWorker.ready;
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!vapidPublicKey) {
      console.error("VAPID Public Key is missing.");
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });

    console.log("User is subscribed:", subscription);

    const { error } = await supabase
      .from("subscriptions")
      .upsert([{ user_id: userId, subscription: JSON.stringify(subscription) }]);

    if (error) {
      console.error("Error saving subscription to Supabase:", error);
    } else {
      console.log("Subscription saved to Supabase successfully!");
    }
  } catch (error) {
    console.error("Failed to subscribe user:", error);
  }
}

export async function subscribeToNotifications() {
  const supabase = createClient();
  supabase
    .channel("notifications")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications" },
      async (payload: { new: { title: string; message: string } }) => {
        console.log("New notification:", payload);

        const { title, message } = payload.new;
        const registration = await navigator.serviceWorker.ready;

        registration.showNotification(title, {
          body: message,
          icon: "/icon-192x192.png",
          badge: "/icon-192x192.png"
        });
      }
    )
    .subscribe();

  console.log("Subscribed to notifications channel.");
}
