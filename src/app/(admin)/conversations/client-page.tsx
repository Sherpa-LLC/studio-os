"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"



import { formatPhone } from "@/lib/format"
import {
  Search,
  Send,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Voicemail,
  Mail,
  MessageSquare,
  Globe,
  User,
  Building,
  Clock,
  FileText,
  X,
  Hash,
  AtSign,
  Play,
} from "lucide-react"
import type { Conversation, TextTemplate, CallRecord, ConversationChannel, ConversationMessage } from "@/lib/types"

// ── Channel config ──────────────────────────────────────────────────────────

const CHANNEL_CONFIG: Record<ConversationChannel, { label: string; icon: React.ElementType; color: string }> = {
  sms: { label: "SMS", icon: MessageSquare, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  email: { label: "Email", icon: Mail, color: "text-blue-600 bg-blue-50 border-blue-200" },
  facebook: { label: "Facebook", icon: Hash, color: "text-blue-700 bg-blue-50 border-blue-200" },
  instagram: { label: "Instagram", icon: AtSign, color: "text-pink-600 bg-pink-50 border-pink-200" },
  webchat: { label: "Web Chat", icon: Globe, color: "text-purple-600 bg-purple-50 border-purple-200" },
}

const CHANNEL_FILTERS: (ConversationChannel | "all")[] = ["all", "sms", "email", "facebook", "instagram", "webchat"]

// ── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "now"
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  if (isToday) return time
  if (isYesterday) return `Yesterday ${time}`
  return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${time}`
}

function groupMessages(messages: ConversationMessage[]) {
  const groups: ConversationMessage[][] = []
  for (const msg of messages) {
    const lastGroup = groups[groups.length - 1]
    const lastMsg = lastGroup?.[lastGroup.length - 1]
    const sameDirection = lastMsg?.direction === msg.direction
    const gap = lastMsg
      ? new Date(msg.timestamp).getTime() - new Date(lastMsg.timestamp).getTime()
      : Infinity
    if (lastGroup && sameDirection && gap < 5 * 60 * 1000) {
      lastGroup.push(msg)
    } else {
      groups.push([msg])
    }
  }
  return groups
}

function formatDateLabel(isoString: string): string {
  const date = new Date(isoString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === today.toDateString()) return "Today"
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
}

// ── Component ───────────────────────────────────────────────────────────────

interface ConversationsClientPageProps {
  conversations: Conversation[]
  unreadCount: number
  textTemplates: TextTemplate[]
  callRecords: CallRecord[]
  formatDuration: (seconds: number) => string
}

export default function ConversationsClientPage({
  conversations,
  unreadCount: totalUnreadProp,
  textTemplates,
  callRecords,
  formatDuration,
}: ConversationsClientPageProps) {
  const [selectedId, setSelectedId] = useState<string | null>(conversations[0]?.id ?? null)
  const [channelFilter, setChannelFilter] = useState<ConversationChannel | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [replyText, setReplyText] = useState("")
  const [templateOpen, setTemplateOpen] = useState(false)
  const selected = useMemo(
    () => conversations.find((c) => c.id === selectedId) ?? null,
    [selectedId]
  )

  const filtered = useMemo(() => {
    let list = conversations
    if (channelFilter !== "all") {
      list = list.filter((c) => c.channel === channelFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (c) =>
          c.contactName.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
      )
    }
    return list.sort(
      (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    )
  }, [channelFilter, searchQuery])

  const totalUnread = totalUnreadProp

  function insertTemplate(body: string) {
    setReplyText(body)
    setTemplateOpen(false)
  }

  const [activeTab, setActiveTab] = useState("messages")

  return (
    <>
      <Header title="Conversations" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="border-b px-4 pt-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="messages">
                Messages
                {totalUnread > 0 && (
                  <Badge className="ml-1.5 text-[10px] px-1.5 py-0 bg-blue-600">{totalUnread}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="calls">
                Calls
                <Badge variant="outline" className="ml-1.5 text-[10px] px-1.5 py-0">{callRecords.length}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

      {activeTab === "calls" ? (
        <CallsTab callRecords={callRecords} formatDuration={formatDuration} />
      ) : (
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Panel: Contact List ─────────────────────────── */}
        <div className="w-80 shrink-0 border-r flex flex-col bg-card">
          {/* Search & filter */}
          <div className="p-3 space-y-2 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {CHANNEL_FILTERS.map((ch) => (
                <button
                  key={ch}
                  onClick={() => setChannelFilter(ch)}
                  className={`px-2 py-0.5 text-xs rounded-full border transition-colors ${
                    channelFilter === ch
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                  }`}
                >
                  {ch === "all" ? `All (${totalUnread})` : CHANNEL_CONFIG[ch].label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation list */}
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No conversations found
                </p>
              ) : (
                filtered.map((conv) => {
                  const ChannelIcon = CHANNEL_CONFIG[conv.channel].icon
                  const isSelected = conv.id === selectedId
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedId(conv.id)}
                      className={`w-full text-left p-3 transition-colors hover:bg-muted/50 ${
                        isSelected ? "bg-muted" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <Avatar className="size-9 shrink-0">
                          <AvatarFallback className="text-xs bg-muted">
                            {getInitials(conv.contactName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-sm truncate ${conv.unreadCount > 0 ? "font-semibold" : "font-medium"}`}>
                              {conv.contactName}
                            </span>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {timeAgo(conv.lastMessageAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <ChannelIcon className="size-3 text-muted-foreground shrink-0" />
                            <p className={`text-xs truncate ${conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                              {conv.lastMessage}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {conv.contactType === "lead" ? "Lead" : "Family"}
                            </Badge>
                            {conv.unreadCount > 0 && (
                              <Badge className="text-[10px] px-1.5 py-0 bg-blue-600">
                                {conv.unreadCount}
                              </Badge>
                            )}
                            {conv.status === "snoozed" && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-amber-600 border-amber-200 bg-amber-50">
                                Snoozed
                              </Badge>
                            )}
                            {conv.status === "closed" && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-gray-500 border-gray-200">
                                Closed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* ── Center Panel: Thread ────────────────────────────── */}
        {selected ? (
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Thread header */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b bg-card">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">
                    {getInitials(selected.contactName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{selected.contactName}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${CHANNEL_CONFIG[selected.channel].color}`}>
                      {CHANNEL_CONFIG[selected.channel].label}
                    </Badge>
                    <span>{selected.contactType === "lead" ? "Lead" : "Family"}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="size-8">
                  <Phone className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8">
                  <Mail className="size-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="relative flex-1 min-h-0 overflow-hidden">
              <div className="absolute inset-0 overflow-y-auto">
                <div className="max-w-2xl mx-auto px-4 pt-4 pb-8">
                  {(() => {
                    const groups = groupMessages(selected.messages)
                    let lastDate = ""
                    return groups.map((group, gi) => {
                      const groupDate = new Date(group[0].timestamp).toDateString()
                      const showDate = groupDate !== lastDate
                      lastDate = groupDate
                      const isOutbound = group[0].direction === "outbound"

                      return (
                        <div key={gi}>
                          {showDate && (
                            <div className="flex items-center gap-4 my-6 first:mt-0">
                              <div className="flex-1 h-px bg-border/60" />
                              <span className="text-[11px] font-medium text-muted-foreground/70 tracking-wider uppercase select-none">
                                {formatDateLabel(group[0].timestamp)}
                              </span>
                              <div className="flex-1 h-px bg-border/60" />
                            </div>
                          )}
                          <div className={`flex ${isOutbound ? "justify-end" : "justify-start"} mb-4`}>
                            <div className={`flex flex-col ${isOutbound ? "items-end" : "items-start"} gap-[3px] max-w-[75%]`}>
                              {group.map((msg, mi) => (
                                <MessageBubble
                                  key={msg.id}
                                  message={msg}
                                  position={group.length === 1 ? "single" : mi === 0 ? "first" : mi === group.length - 1 ? "last" : "middle"}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
            </div>

            {/* Compose */}
            <div className="px-4 pb-4 pt-2">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-end gap-2 rounded-2xl border bg-card shadow-sm ring-1 ring-black/[0.03] p-1.5 pl-4 transition-shadow focus-within:shadow-md focus-within:ring-primary/20">
                  <Textarea
                    placeholder={`Reply via ${CHANNEL_CONFIG[selected.channel].label}...`}
                    className="flex-1 min-h-[36px] max-h-32 resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm py-2 px-0"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={1}
                  />
                  <div className="flex items-center gap-0.5 pb-0.5">
                    <Popover open={templateOpen} onOpenChange={setTemplateOpen}>
                      <PopoverTrigger className="inline-flex items-center justify-center size-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <FileText className="size-4" />
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-80 p-0">
                        <div className="p-2 border-b">
                          <p className="text-xs font-medium text-muted-foreground">Insert Template</p>
                        </div>
                        <ScrollArea className="max-h-60">
                          <div className="p-1">
                            {textTemplates.map((tpl) => (
                              <button
                                key={tpl.id}
                                onClick={() => insertTemplate(tpl.body)}
                                className="w-full text-left px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">{tpl.name}</p>
                                  {tpl.shortcut && (
                                    <code className="text-[10px] text-muted-foreground bg-muted px-1 rounded">{tpl.shortcut}</code>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                  {tpl.body}
                                </p>
                              </button>
                            ))}
                          </div>
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
                    <Button size="icon" className="size-8 rounded-xl shrink-0" disabled={!replyText.trim()}>
                      <Send className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">Select a conversation to get started</p>
          </div>
        )}

        {/* ── Right Panel: Contact Details ────────────────────── */}
        {selected && (
          <div className="w-72 shrink-0 border-l bg-card overflow-y-auto hidden xl:block">
            <div className="p-4 space-y-4">
              {/* Contact header */}
              <div className="text-center">
                <Avatar className="size-14 mx-auto">
                  <AvatarFallback className="text-lg">
                    {getInitials(selected.contactName)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-semibold mt-2">{selected.contactName}</p>
                <Badge variant="outline" className="mt-1">
                  {selected.contactType === "lead" ? (
                    <><User className="size-3 mr-1" /> Lead</>
                  ) : (
                    <><Building className="size-3 mr-1" /> Family</>
                  )}
                </Badge>
              </div>

              <Separator />

              {/* Contact info */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Contact Info
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-3.5" />
                    <span className="text-foreground">{formatPhone(selected.contactPhone)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="size-3.5" />
                    <span className="text-foreground text-xs">{selected.contactEmail}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Conversation stats */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Conversation
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Channel</p>
                    <Badge variant="outline" className={`text-[10px] mt-0.5 ${CHANNEL_CONFIG[selected.channel].color}`}>
                      {CHANNEL_CONFIG[selected.channel].label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="font-medium capitalize mt-0.5">{selected.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Messages</p>
                    <p className="font-medium mt-0.5">{selected.messages.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Unread</p>
                    <p className="font-medium mt-0.5">{selected.unreadCount}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Quick actions */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </p>
                <div className="space-y-1">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                    <Phone className="size-3.5 mr-2" /> Call Contact
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                    <Mail className="size-3.5 mr-2" /> Send Email
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                    <Clock className="size-3.5 mr-2" /> Snooze
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                    <X className="size-3.5 mr-2" /> Close Conversation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      )}
      </div>
    </>
  )
}

// ── Calls Tab ──���────────────────────────────────────────────────────────────

function CallsTab({ callRecords, formatDuration }: { callRecords: CallRecord[]; formatDuration: (seconds: number) => string }) {
  const STATUS_CONFIG = {
    completed: { label: "Completed", icon: Phone, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    missed: { label: "Missed", icon: PhoneMissed, color: "text-red-600 bg-red-50 border-red-200" },
    voicemail: { label: "Voicemail", icon: Voicemail, color: "text-amber-600 bg-amber-50 border-amber-200" },
  }

  function formatCallTime(isoString: string): string {
    const date = new Date(isoString)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    if (isToday) return `Today ${time}`
    return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${time}`
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Call Log</h2>
          <Button size="sm">
            <Phone className="size-3.5 mr-1.5" /> New Call
          </Button>
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callRecords.map((call) => {
                const statusCfg = STATUS_CONFIG[call.status]
                return (
                  <TableRow key={call.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                          <AvatarFallback className="text-[10px]">
                            {call.contactName.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{call.contactName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {call.direction === "inbound" ? (
                          <><PhoneIncoming className="size-3.5 text-blue-500" /> Inbound</>
                        ) : (
                          <><PhoneOutgoing className="size-3.5 text-emerald-500" /> Outbound</>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusCfg.color}>
                        {statusCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDuration(call.duration)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatCallTime(call.timestamp)}
                    </TableCell>
                    <TableCell>
                      {call.status === "voicemail" && (
                        <Button variant="ghost" size="icon" className="size-7">
                          <Play className="size-3.5" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}

// ── Message Bubble ──────────────────────────────────────────────────────────

function MessageBubble({
  message,
  position,
}: {
  message: ConversationMessage
  position: "single" | "first" | "middle" | "last"
}) {
  const isOutbound = message.direction === "outbound"
  const ChannelIcon = CHANNEL_CONFIG[message.channel].icon
  const showMeta = position === "single" || position === "last"

  const radius = isOutbound
    ? {
        single: "rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm",
        first:  "rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm",
        middle: "rounded-tl-2xl rounded-bl-2xl rounded-tr-sm rounded-br-sm",
        last:   "rounded-tl-2xl rounded-tr-sm rounded-bl-2xl rounded-br-2xl",
      }[position]
    : {
        single: "rounded-tl-2xl rounded-tr-2xl rounded-bl-sm rounded-br-2xl",
        first:  "rounded-tl-2xl rounded-tr-2xl rounded-bl-sm rounded-br-2xl",
        middle: "rounded-tl-sm rounded-bl-sm rounded-tr-2xl rounded-br-2xl",
        last:   "rounded-tl-sm rounded-tr-2xl rounded-bl-2xl rounded-br-2xl",
      }[position]

  return (
    <div
      className={`${radius} px-4 py-2.5 ${
        isOutbound
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-muted"
      }`}
    >
      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.body}</p>
      {showMeta && (
        <div className={`flex items-center gap-1.5 mt-1.5 ${isOutbound ? "justify-end" : "justify-start"}`}>
          <ChannelIcon className={`size-3 ${isOutbound ? "opacity-50" : "text-muted-foreground"}`} />
          <span className={`text-[10px] ${isOutbound ? "opacity-50" : "text-muted-foreground"}`}>
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
      )}
    </div>
  )
}
