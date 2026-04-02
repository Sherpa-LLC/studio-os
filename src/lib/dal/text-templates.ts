import { textTemplates as _textTemplates, getTemplatesByCategory as _getTemplatesByCategory, searchTemplates as _searchTemplates } from "@/data/text-templates"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const textTemplates = _textTemplates

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getTemplatesByCategory = _getTemplatesByCategory

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const searchTemplates = _searchTemplates
