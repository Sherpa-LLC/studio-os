import { db } from "@/lib/db"
import type { Message } from "@/lib/types"

function mapMessage(m: any): Message {
  return {
    id: m.id,
    subject: m.subject,
    body: m.body,
    channel: m.channel,
    audience: m.audience,
    audienceCount: m.audienceCount,
    sentBy: m.sentBy,
    sentAt: m.sentAt.toISOString(),
    status: m.status,
    deliveredCount: m.deliveredCount ?? undefined,
    openedCount: m.openedCount ?? undefined,
  }
}

export async function getMessages() {
  const rows = await db.message.findMany({ orderBy: { sentAt: "desc" } })
  return rows.map(mapMessage)
}

export async function getMessageById(id: string) {
  const row = await db.message.findUnique({ where: { id } })
  return row ? mapMessage(row) : undefined
}

export async function getMessagesByStatus(status: string) {
  const rows = await db.message.findMany({ where: { status: status as any }, orderBy: { sentAt: "desc" } })
  return rows.map(mapMessage)
}

export async function getMessagesByChannel(channel: string) {
  const rows = await db.message.findMany({ where: { channel: channel as any }, orderBy: { sentAt: "desc" } })
  return rows.map(mapMessage)
}

export async function searchMessages(query: string) {
  const rows = await db.message.findMany({
    where: { OR: [{ subject: { contains: query, mode: "insensitive" } }, { body: { contains: query, mode: "insensitive" } }] },
    orderBy: { sentAt: "desc" },
  })
  return rows.map(mapMessage)
}
