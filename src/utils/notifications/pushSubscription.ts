import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array(Array.from(rawData, (char) => char.charCodeAt(0)));
}

export async function requestNotificationPermission(userId: string) {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Notification permission granted.");
    subscribeUserToPush(userId);
  } else {
    console.error("Unable to get permission to notify.");
  }
}

export async function subscribeUserToPush(userId: string) {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
    });

    console.log("User is subscribed:", subscription);

    const { error } = await supabase
      .from("subscriptions")
      .insert([{ user_id: userId, subscription: JSON.stringify(subscription) }]);

    if (error) {
      console.error("Error saving subscription to Supabase:", error);
    } else {
      console.log("Subscription saved to Supabase successfully!");
    }
  } catch (error) {
    console.error("Failed to subscribe user:", error);
  }
}
