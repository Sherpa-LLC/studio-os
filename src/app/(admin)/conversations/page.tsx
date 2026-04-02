import {
  getConversations,
  getUnreadCount,
  getTextTemplates,
  getCallRecords,
  formatDuration,
} from "@/lib/dal/conversations"
import ConversationsClientPage from "./client-page"

export default async function ConversationsPage() {
  const [conversations, unreadCount, textTemplates, callRecords] =
    await Promise.all([
      getConversations(),
      getUnreadCount(),
      getTextTemplates(),
      getCallRecords(),
    ])

  return (
    <ConversationsClientPage
      conversations={conversations}
      unreadCount={unreadCount}
      textTemplates={textTemplates}
      callRecords={callRecords}
      formatDuration={formatDuration}
    />
  )
}
