import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../../database.types";

type NotificationType = Tables<"notifications">;

const supabase = createClient();

export async function addNotification(data: Omit<NotificationType, "created_at" | "id">) {
  const { data: notificationData, error } = await supabase.from("notifications").insert([data]).single();

  if (error) {
    console.error("Error adding notification:", error);
    return false;
  }

  return notificationData;
}
