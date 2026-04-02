"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createBroadcast(data: FormData) {
  const msg = await db.message.create({
    data: {
      subject: data.get("subject") as string,
      body: data.get("body") as string,
      channel: (data.get("channel") as string) as any,
      audience: data.get("audience") as string,
      audienceCount: parseInt(data.get("audienceCount") as string) || 0,
      sentBy: data.get("sentBy") as string || "system",
      status: "draft",
    },
  })
  revalidatePath("/communications")
  return msg.id
}

export async function sendBroadcast(messageId: string) {
  await db.message.update({
    where: { id: messageId },
    data: { status: "sent", sentAt: new Date() },
  })
  revalidatePath("/communications")
}
