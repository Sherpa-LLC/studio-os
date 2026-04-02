import { db } from "@/lib/db"
import type { KnowledgeBaseArticle } from "@/lib/types"

function mapArticle(a: any): KnowledgeBaseArticle {
  return {
    id: a.id, title: a.title, category: a.category.replace(/_/g, "-"),
    body: a.body, author: a.author, updatedAt: a.updatedAt.toISOString(),
    relatedArticleIds: a.relatedArticleIds,
    linkedClassIds: undefined,
  }
}

export async function getArticles() {
  const rows = await db.knowledgeBaseArticle.findMany({ orderBy: { updatedAt: "desc" } })
  return rows.map(mapArticle)
}
export async function getArticleById(id: string) {
  const row = await db.knowledgeBaseArticle.findUnique({ where: { id } })
  return row ? mapArticle(row) : undefined
}
export async function getArticlesByCategory(category: string) {
  const dbCat = category.replace(/-/g, "_")
  const rows = await db.knowledgeBaseArticle.findMany({ where: { category: dbCat as any }, orderBy: { updatedAt: "desc" } })
  return rows.map(mapArticle)
}
export { categories } from "@/data/knowledge-base"

// Compatibility export
import { articles as _kbArticles } from "@/data/knowledge-base"
export async function getRecentlyUpdated() {
  return [..._kbArticles].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5)
}
