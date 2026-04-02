import { getArticlesByCategory } from "@/lib/dal/knowledge-base"
import CurriculumClientPage from "./client-page"

export default async function CurriculumPage() {
  const curriculumArticles = await getArticlesByCategory("curriculum-lesson-plans")

  return <CurriculumClientPage curriculumArticles={curriculumArticles} />
}
