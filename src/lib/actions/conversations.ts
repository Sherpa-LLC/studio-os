"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function sendMessage(conversationId: string, body: string, channel: string) {
  await db.conversationMessage.create({
    data: {
      conversationId,
      direction: "outbound",
      channel: channel as any,
      body,
    },
  })
  await db.conversation.update({
    where: { id: conversationId },
    data: { lastMessage: body, lastMessageAt: new Date() },
  })
  revalidatePath("/conversations")
}

export async function markConversationRead(conversationId: string) {
  await db.conversationMessage.updateMany({
    where: { conversationId, read: false },
    data: { read: true },
  })
  await db.conversation.update({
    where: { id: conversationId },
    data: { unreadCount: 0 },
  })
  revalidatePath("/conversations")
}
