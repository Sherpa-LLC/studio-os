import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockDb } = vi.hoisted(() => ({
  mockDb: {
    conversation: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      aggregate: vi.fn(),
    },
  },
}))

vi.mock("@/lib/db", () => ({ db: mockDb }))

// Mock the data imports used by re-export functions
vi.mock("@/data/text-templates", () => ({ textTemplates: [] }))
vi.mock("@/data/call-records", () => ({
  callRecords: [],
  formatDuration: (s: number) => `${s}s`,
}))

import {
  getConversations,
  getConversationById,
  getOpenConversations,
  getUnreadCount,
} from "@/lib/dal/conversations"

describe("conversations DAL", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const makeMessageRow = (overrides: Record<string, unknown> = {}) => ({
    id: "msg-1",
    conversationId: "conv-1",
    direction: "inbound",
    channel: "sms",
    body: "Hi there!",
    timestamp: new Date("2026-03-20T14:30:00Z"),
    read: false,
    ...overrides,
  })

  const makeConversationRow = (overrides: Record<string, unknown> = {}) => ({
    id: "conv-1",
    contactName: "Sarah Johnson",
    contactPhone: "+15551234567",
    contactEmail: "sarah@example.com",
    contactType: "household",
    contactId: "hh-1",
    lastMessage: "Hi there!",
    lastMessageAt: new Date("2026-03-20T14:30:00Z"),
    unreadCount: 2,
    channel: "sms",
    status: "open",
    messages: [makeMessageRow()],
    ...overrides,
  })

  // ── getConversations ──────────────────────────────────────────────────

  it("returns mapped conversations with nested messages", async () => {
    mockDb.conversation.findMany.mockResolvedValue([makeConversationRow()])

    const result = await getConversations()

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: "conv-1",
      contactName: "Sarah Johnson",
      contactPhone: "+15551234567",
      contactEmail: "sarah@example.com",
      contactType: "household",
      contactId: "hh-1",
      lastMessage: "Hi there!",
      lastMessageAt: "2026-03-20T14:30:00.000Z",
      unreadCount: 2,
      channel: "sms",
      status: "open",
      messages: [
        {
          id: "msg-1",
          conversationId: "conv-1",
          direction: "inbound",
          channel: "sms",
          body: "Hi there!",
          timestamp: "2026-03-20T14:30:00.000Z",
          read: false,
        },
      ],
    })
    expect(mockDb.conversation.findMany).toHaveBeenCalledWith({
      include: { messages: { orderBy: { timestamp: "asc" } } },
      orderBy: { lastMessageAt: "desc" },
    })
  })

  it("handles conversations with no messages", async () => {
    mockDb.conversation.findMany.mockResolvedValue([
      makeConversationRow({ messages: [] }),
    ])

    const result = await getConversations()

    expect(result[0].messages).toEqual([])
  })

  it("returns empty array when no conversations exist", async () => {
    mockDb.conversation.findMany.mockResolvedValue([])
    const result = await getConversations()
    expect(result).toEqual([])
  })

  // ── getConversationById ───────────────────────────────────────────────

  it("returns a mapped conversation by ID", async () => {
    mockDb.conversation.findUnique.mockResolvedValue(makeConversationRow())

    const result = await getConversationById("conv-1")

    expect(result).toBeDefined()
    expect(result!.id).toBe("conv-1")
    expect(result!.messages).toHaveLength(1)
    expect(mockDb.conversation.findUnique).toHaveBeenCalledWith({
      where: { id: "conv-1" },
      include: { messages: { orderBy: { timestamp: "asc" } } },
    })
  })

  it("returns undefined when conversation not found", async () => {
    mockDb.conversation.findUnique.mockResolvedValue(null)

    const result = await getConversationById("nonexistent")

    expect(result).toBeUndefined()
  })

  // ── getOpenConversations ──────────────────────────────────────────────

  it("filters conversations by open status", async () => {
    mockDb.conversation.findMany.mockResolvedValue([makeConversationRow()])

    const result = await getOpenConversations()

    expect(result).toHaveLength(1)
    expect(mockDb.conversation.findMany).toHaveBeenCalledWith({
      where: { status: "open" },
      include: { messages: { orderBy: { timestamp: "asc" } } },
      orderBy: { lastMessageAt: "desc" },
    })
  })

  // ── getUnreadCount ────────────────────────────────────────────────────

  it("aggregates total unread count across all conversations", async () => {
    mockDb.conversation.aggregate.mockResolvedValue({
      _sum: { unreadCount: 15 },
    })

    const result = await getUnreadCount()

    expect(result).toBe(15)
    expect(mockDb.conversation.aggregate).toHaveBeenCalledWith({
      _sum: { unreadCount: true },
    })
  })

  it("returns 0 when no unread messages", async () => {
    mockDb.conversation.aggregate.mockResolvedValue({
      _sum: { unreadCount: null },
    })

    const result = await getUnreadCount()

    expect(result).toBe(0)
  })
})
