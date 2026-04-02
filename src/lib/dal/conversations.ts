import { conversations as _conversations, getConversationById as _getConversationById, getOpenConversations as _getOpenConversations, getUnreadCount as _getUnreadCount } from "@/data/conversations"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const conversations = _conversations

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getConversationById = _getConversationById

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getOpenConversations = _getOpenConversations

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getUnreadCount = _getUnreadCount
