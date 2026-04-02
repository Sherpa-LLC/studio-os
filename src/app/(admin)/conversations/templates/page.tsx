import { getTextTemplates } from "@/lib/dal/text-templates"
import ClientPage from "./client-page"

export default async function Page() {
  const textTemplates = await getTextTemplates()
  return <ClientPage textTemplates={textTemplates} />
}
