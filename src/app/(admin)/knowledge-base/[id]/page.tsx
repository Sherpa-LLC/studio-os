import { getArticles, getArticleById, categories } from "@/lib/dal/knowledge-base"
import ClientPage from "./client-page"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [article, allArticles] = await Promise.all([
    getArticleById(id),
    getArticles(),
  ])

  const categoryMeta = article ? (await import("@/data/knowledge-base")).categories.find((c: any) => c.id === article.category) : undefined

  // Resolve related articles
  const relatedArticles = article
    ? article.relatedArticleIds
        .map((rid) => allArticles.find((a) => a.id === rid))
        .filter(Boolean)
    : []

  return (
    <ClientPage
      article={article}
      categoryMeta={categoryMeta}
      relatedArticles={relatedArticles as Awaited<ReturnType<typeof getArticles>>}
    />
  )
}
