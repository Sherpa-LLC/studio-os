import { getMessages } from "@/lib/dal/messages"
import ClientPage from "./client-page"

export default async function Page() {
  const messages = await getMessages()
  return <ClientPage messages={messages} />
}
