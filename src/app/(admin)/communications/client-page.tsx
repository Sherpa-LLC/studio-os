"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/format"
import {
  Plus,
  Mail,
  MessageSquare,
  Send,
  Clock,
  FileEdit,
  Eye,
  CheckCircle2,
} from "lucide-react"
import type { Message, MessageChannel } from "@/lib/types"

// ── Channel badge config ─────────────────────────────────────────────────────

const CHANNEL_CONFIG: Record<MessageChannel, { label: string; className: string }> = {
  email: { label: "Email", className: "bg-blue-50 text-blue-700 border-blue-200" },
  sms: { label: "SMS", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  both: { label: "Both", className: "bg-purple-50 text-purple-700 border-purple-200" },
}

const STATUS_CONFIG: Record<Message["status"], { label: string; className: string }> = {
  sent: { label: "Sent", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  scheduled: { label: "Scheduled", className: "bg-amber-50 text-amber-700 border-amber-200" },
  draft: { label: "Draft", className: "bg-gray-100 text-gray-600 border-gray-200" },
}

type ChannelFilter = "all" | MessageChannel

interface Props {
  messages: Message[]
}

export default function ClientPage({ messages }: Props) {
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("all")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const filtered = useMemo(() => {
    const sorted = [...messages].sort((a, b) => {
      // Drafts without dates sort last
      if (!a.sentAt) return 1
      if (!b.sentAt) return -1
      return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    })

    if (channelFilter === "all") return sorted
    return sorted.filter((m) => m.channel === channelFilter)
  }, [channelFilter, messages])

  const filterButtons: { value: ChannelFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "both", label: "Both" },
  ]

  function formatMessageDate(msg: Message): string {
    if (!msg.sentAt) return "--"
    return formatDate(msg.sentAt.split("T")[0])
  }

  return (
    <>
      <Header title="Messages" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title="Messages"
          description="Communication history and outreach"
        >
          <Link href="/communications/compose">
            <Button>
              <Plus data-icon="inline-start" />
              Compose
            </Button>
          </Link>
        </PageHeader>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 rounded-lg bg-muted p-[3px] w-fit">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setChannelFilter(btn.value)}
              className={`
                inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-all
                ${
                  channelFilter === btn.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          {filtered.length} message{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Message table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Delivered</TableHead>
                <TableHead className="text-right">Opened</TableHead>
                <TableHead>Sent By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground py-8"
                  >
                    No messages found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((msg) => (
                  <TableRow
                    key={msg.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedMessage(msg)}
                  >
                    <TableCell>
                      <span className="font-medium text-foreground">
                        {msg.subject}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">
                      {msg.audience}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={CHANNEL_CONFIG[msg.channel].className}
                      >
                        {CHANNEL_CONFIG[msg.channel].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatMessageDate(msg)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={STATUS_CONFIG[msg.status].className}
                      >
                        {STATUS_CONFIG[msg.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {msg.deliveredCount ?? "--"}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {msg.openedCount ?? "--"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {msg.sentBy}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Message detail sheet */}
      <Sheet
        open={selectedMessage !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedMessage(null)
        }}
      >
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selectedMessage && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedMessage.subject}</SheetTitle>
                <SheetDescription>
                  {selectedMessage.audience}
                </SheetDescription>
              </SheetHeader>

              <div className="px-4 space-y-5">
                {/* Meta info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Channel
                    </p>
                    <Badge
                      variant="outline"
                      className={CHANNEL_CONFIG[selectedMessage.channel].className}
                    >
                      {selectedMessage.channel === "email" && <Mail className="size-3 mr-1" />}
                      {selectedMessage.channel === "sms" && <MessageSquare className="size-3 mr-1" />}
                      {selectedMessage.channel === "both" && <Send className="size-3 mr-1" />}
                      {CHANNEL_CONFIG[selectedMessage.channel].label}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Status
                    </p>
                    <Badge
                      variant="outline"
                      className={STATUS_CONFIG[selectedMessage.status].className}
                    >
                      {selectedMessage.status === "sent" && <CheckCircle2 className="size-3 mr-1" />}
                      {selectedMessage.status === "scheduled" && <Clock className="size-3 mr-1" />}
                      {selectedMessage.status === "draft" && <FileEdit className="size-3 mr-1" />}
                      {STATUS_CONFIG[selectedMessage.status].label}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      {selectedMessage.status === "scheduled" ? "Scheduled For" : "Sent On"}
                    </p>
                    <p className="text-sm">{formatMessageDate(selectedMessage)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Sent By
                    </p>
                    <p className="text-sm">{selectedMessage.sentBy}</p>
                  </div>
                </div>

                {/* Delivery stats */}
                {selectedMessage.status === "sent" && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg border p-3 text-center">
                        <p className="text-lg font-semibold">
                          {selectedMessage.audienceCount}
                        </p>
                        <p className="text-xs text-muted-foreground">Recipients</p>
                      </div>
                      <div className="rounded-lg border p-3 text-center">
                        <p className="text-lg font-semibold">
                          {selectedMessage.deliveredCount ?? "--"}
                        </p>
                        <p className="text-xs text-muted-foreground">Delivered</p>
                      </div>
                      <div className="rounded-lg border p-3 text-center">
                        <p className="text-lg font-semibold">
                          {selectedMessage.openedCount ?? "--"}
                        </p>
                        <p className="text-xs text-muted-foreground">Opened</p>
                      </div>
                    </div>

                    {selectedMessage.deliveredCount && selectedMessage.openedCount && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Eye className="size-4" />
                        <span>
                          {Math.round(
                            (selectedMessage.openedCount /
                              selectedMessage.deliveredCount) *
                              100
                          )}
                          % open rate
                        </span>
                      </div>
                    )}
                  </>
                )}

                <Separator />

                {/* Message body */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Message
                  </p>
                  <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.body}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
