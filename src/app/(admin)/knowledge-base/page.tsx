import { categories } from "@/lib/dal/knowledge-base"
import { getRecentlyUpdated } from "@/lib/dal/knowledge-base"
import KnowledgeBaseClientPage from "./client-page"

export default async function KnowledgeBasePage() {
  const recentArticles = await getRecentlyUpdated()

  return (
    <KnowledgeBaseClientPage
      categories={categories}
      recentArticles={recentArticles}
    />
  )
}
