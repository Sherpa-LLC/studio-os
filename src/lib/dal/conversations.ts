import { db } from "@/lib/db"
import type { Conversation, ConversationMessage } from "@/lib/types"

function mapMessage(m: any): ConversationMessage {
  return {
    id: m.id,
    conversationId: m.conversationId,
    direction: m.direction,
    channel: m.channel,
    body: m.body,
    timestamp: m.timestamp.toISOString(),
    read: m.read,
  }
}

function mapConversation(c: any): Conversation {
  return {
    id: c.id,
    contactName: c.contactName,
    contactPhone: c.contactPhone,
    contactEmail: c.contactEmail,
    contactType: c.contactType,
    contactId: c.contactId,
    lastMessage: c.lastMessage,
    lastMessageAt: c.lastMessageAt.toISOString(),
    unreadCount: c.unreadCount,
    channel: c.channel,
    status: c.status,
    messages: (c.messages || []).map(mapMessage),
  }
}

export async function getConversations() {
  const rows = await db.conversation.findMany({
    include: { messages: { orderBy: { timestamp: "asc" } } },
    orderBy: { lastMessageAt: "desc" },
  })
  return rows.map(mapConversation)
}

export async function getConversationById(id: string) {
  const row = await db.conversation.findUnique({
    where: { id },
    include: { messages: { orderBy: { timestamp: "asc" } } },
  })
  return row ? mapConversation(row) : undefined
}

export async function getOpenConversations() {
  const rows = await db.conversation.findMany({
    where: { status: "open" },
    include: { messages: { orderBy: { timestamp: "asc" } } },
    orderBy: { lastMessageAt: "desc" },
  })
  return rows.map(mapConversation)
}

export async function getUnreadCount() {
  const result = await db.conversation.aggregate({ _sum: { unreadCount: true } })
  return result._sum.unreadCount ?? 0
}

// Re-exports for conversations page
import { textTemplates } from "@/data/text-templates"
import { callRecords, formatDuration } from "@/data/call-records"

export async function getTextTemplates() { return textTemplates }
export async function getCallRecords() { return callRecords }
export { formatDuration }
