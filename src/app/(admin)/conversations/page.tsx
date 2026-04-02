import {
  getConversations,
  getUnreadCount,
  getTextTemplates,
  getCallRecords,
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
    />
  )
}
