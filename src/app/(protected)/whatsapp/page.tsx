import { redirect } from "next/navigation";

export default function WhatsAppRoot() {
  redirect("/whatsapp/messages");
}
