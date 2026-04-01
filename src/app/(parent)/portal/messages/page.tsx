"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { MessageChannel } from "@/lib/types"
import {
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  Smartphone,
} from "lucide-react"

interface ParentMessage {
  id: string
  subject: string
  body: string
  date: string
  channel: MessageChannel
  from: string
  read: boolean
}

const MESSAGES: ParentMessage[] = [
  {
    id: "pm-01",
    subject: "Spring Recital Costume Measurements",
    body: "Dear Families,\n\nPlease bring your child in for costume measurements this week. We will be taking measurements during regular class times on Monday through Wednesday. If your child will miss class this week, please contact the front desk to schedule an alternative measurement time.\n\nCostume fees of $75 per costume will be billed to your account by March 31st. Students enrolled in multiple recital pieces will need one costume per piece.\n\nThank you for your prompt attention to this matter.\n\nBest regards,\nStudio OS Dance Academy",
    date: "2026-03-25",
    channel: "email",
    from: "Studio OS Admin",
    read: false,
  },
  {
    id: "pm-02",
    subject: "Schedule Change: Studio B Maintenance",
    body: "Due to scheduled maintenance, all Studio B classes on Friday March 28 will be moved to Studio A. Class times remain the same. We apologize for any inconvenience.",
    date: "2026-03-22",
    channel: "sms",
    from: "Studio OS",
    read: true,
  },
  {
    id: "pm-03",
    subject: "Summer Intensive Registration Opens April 1",
    body: "We are excited to announce our 2026 Summer Intensive program! This year's intensive runs June 15-26 and features guest instructors from the Alvin Ailey School and the Joffrey Ballet.\n\nPrograms available:\n- Junior Intensive (Ages 7-10): 9 AM - 12 PM daily\n- Teen Intensive (Ages 11-14): 9 AM - 3 PM daily\n- Senior Intensive (Ages 14+): 9 AM - 5 PM daily\n\nEarly bird pricing is available through April 15th. Current families receive a 10% discount.\n\nRegistration opens April 1st at 9:00 AM. Spots are limited!\n\nBest regards,\nStudio OS Dance Academy",
    date: "2026-03-20",
    channel: "email",
    from: "Studio OS Admin",
    read: true,
  },
  {
    id: "pm-04",
    subject: "March Invoice Ready",
    body: "Your March 2026 invoice is now available in your billing portal. Total due: $500.00. Payment is due by March 15th.\n\nYou can view the full invoice breakdown in My Billing.",
    date: "2026-03-01",
    channel: "email",
    from: "Studio OS Billing",
    read: true,
  },
  {
    id: "pm-05",
    subject: "Snow Day Closure - February 28",
    body: "Due to the winter storm warning, Studio OS will be closed tomorrow February 28. All classes are cancelled. Makeup classes will be scheduled for the week of March 9. Stay safe!",
    date: "2026-02-27",
    channel: "both",
    from: "Studio OS Admin",
    read: true,
  },
  {
    id: "pm-06",
    subject: "Competition Team Results - Starpower Hartford",
    body: "Congratulations to all our competition teams on an amazing weekend at Starpower Hartford!\n\nResults:\n- Junior Jazz Team: 1st Place High Gold\n- Teen Contemporary Team: 1st Place Platinum\n- Senior Ballet Team: 2nd Place Platinum\n- Teen Hip Hop Team: 1st Place High Gold\n\nWe are so proud of every dancer who performed. Thank you parents for all your support with travel and logistics!\n\nNext competition: Dance Showcase Providence, March 15-16.",
    date: "2026-02-24",
    channel: "email",
    from: "Studio OS Admin",
    read: true,
  },
  {
    id: "pm-07",
    subject: "February Invoice Ready",
    body: "Your February 2026 invoice is now available in your billing portal. Total due: $500.00. Payment is due by February 15th.",
    date: "2026-02-01",
    channel: "email",
    from: "Studio OS Billing",
    read: true,
  },
  {
    id: "pm-08",
    subject: "Valentine's Day Open House",
    body: "Join us for our Valentine's Day Open House on February 14th from 4-7 PM! Bring friends and family to try a free class. We'll have refreshments, face painting, and a photo booth. Refer a friend who enrolls and receive $25 off your next month's tuition.",
    date: "2026-01-28",
    channel: "email",
    from: "Studio OS Admin",
    read: true,
  },
  {
    id: "pm-09",
    subject: "Reminder: Class Resumes Monday",
    body: "Happy New Year! Classes resume Monday, January 5th with the regular schedule. We look forward to seeing everyone back in the studio!",
    date: "2026-01-03",
    channel: "sms",
    from: "Studio OS",
    read: true,
  },
  {
    id: "pm-10",
    subject: "January Invoice Ready",
    body: "Your January 2026 invoice is now available in your billing portal. Total due: $500.00. Payment is due by January 15th.",
    date: "2026-01-01",
    channel: "email",
    from: "Studio OS Billing",
    read: true,
  },
  {
    id: "pm-11",
    subject: "Holiday Closure Schedule",
    body: "Studio OS will be closed December 22 through January 4 for the holiday break. Classes resume January 5. Wishing all our families a wonderful holiday season and a happy new year!",
    date: "2025-12-18",
    channel: "email",
    from: "Studio OS Admin",
    read: true,
  },
  {
    id: "pm-12",
    subject: "Nutcracker Performance Photos Available",
    body: "The professional photos from our Nutcracker performance are now available for viewing and purchase at studioos-photos.example.com. Use code NUTCRACKER2025 for 15% off your order through December 31.\n\nThank you to everyone who made this year's production our best yet!",
    date: "2025-12-15",
    channel: "email",
    from: "Studio OS Admin",
    read: true,
  },
]

function ChannelBadge({ channel }: { channel: MessageChannel }) {
  switch (channel) {
    case "email":
      return (
        <Badge variant="secondary">
          <Mail className="h-3 w-3 mr-1" />
          Email
        </Badge>
      )
    case "sms":
      return (
        <Badge variant="secondary">
          <Smartphone className="h-3 w-3 mr-1" />
          SMS
        </Badge>
      )
    case "both":
      return (
        <Badge variant="secondary">
          <MessageSquare className="h-3 w-3 mr-1" />
          Email & SMS
        </Badge>
      )
  }
}

export default function ParentMessagesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Communication from the studio"
      />

      <div className="space-y-2">
        {MESSAGES.map((msg) => {
          const isExpanded = expandedId === msg.id

          return (
            <Card
              key={msg.id}
              size="sm"
              className={cn(
                "transition-all cursor-pointer hover:bg-accent/50",
                !msg.read && "bg-primary/[0.03] ring-primary/20"
              )}
            >
              <CardContent className="space-y-0">
                <button
                  onClick={() => toggleExpand(msg.id)}
                  className="flex w-full items-start gap-3 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {!msg.read && (
                        <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                      <p className={cn(
                        "text-sm truncate",
                        !msg.read ? "font-semibold" : "font-medium"
                      )}>
                        {msg.subject}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{msg.from}</span>
                      <span>&middot;</span>
                      <span>{new Date(msg.date + "T00:00:00").toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <ChannelBadge channel={msg.channel} />
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <>
                    <Separator className="my-3" />
                    <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                      {msg.body}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
