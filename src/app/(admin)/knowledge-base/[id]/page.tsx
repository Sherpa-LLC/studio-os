import { getAllArticles, getArticleById, getCategoryMeta } from "@/lib/dal/knowledge-base"
import ClientPage from "./client-page"

export async function generateStaticParams() {
  const articles = await getAllArticles()
  return articles.map((a) => ({ id: a.id }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [article, allArticles] = await Promise.all([
    getArticleById(id),
    getAllArticles(),
  ])

  const categoryMeta = article ? await getCategoryMeta(article.category) : undefined

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
      relatedArticles={relatedArticles as Awaited<ReturnType<typeof getAllArticles>>}
    />
  )
}
