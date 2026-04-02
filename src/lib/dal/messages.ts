import { messages as _messages, getMessageById as _getMessageById, getMessagesByStatus as _getMessagesByStatus, getMessagesByChannel as _getMessagesByChannel, searchMessages as _searchMessages } from "@/data/messages"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const messages = _messages

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getMessageById = _getMessageById

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getMessagesByStatus = _getMessagesByStatus

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getMessagesByChannel = _getMessagesByChannel

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const searchMessages = _searchMessages
