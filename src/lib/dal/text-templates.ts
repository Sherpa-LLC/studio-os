import { db } from "@/lib/db"
import type { TextTemplate } from "@/lib/types"
import { mapTemplateCategory } from "./enum-mappers"

function mapTemplate(t: any): TextTemplate {
  return {
    id: t.id,
    name: t.name,
    body: t.body,
    category: mapTemplateCategory(t.category) as any,
    shortcut: t.shortcut ?? undefined,
  }
}

export async function getTextTemplates() {
  const rows = await db.textTemplate.findMany()
  return rows.map(mapTemplate)
}

export async function getTemplatesByCategory(category: string) {
  const dbCat = category.replace(/-/g, "_")
  const rows = await db.textTemplate.findMany({ where: { category: dbCat as any } })
  return rows.map(mapTemplate)
}

export async function searchTemplates(query: string) {
  const rows = await db.textTemplate.findMany({
    where: { OR: [{ name: { contains: query, mode: "insensitive" } }, { body: { contains: query, mode: "insensitive" } }] },
  })
  return rows.map(mapTemplate)
}
