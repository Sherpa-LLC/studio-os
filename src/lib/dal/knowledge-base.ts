import { articles as _articles, categories as _categories, getArticleById as _getArticleById, getArticlesByCategory as _getArticlesByCategory } from "@/data/knowledge-base"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const articles = _articles

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const categories = _categories

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getArticleById = _getArticleById

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getArticlesByCategory = _getArticlesByCategory
