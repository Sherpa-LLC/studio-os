"use client"

import { useRole } from "@/providers/role-provider"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-indigo-100 text-indigo-700 border-indigo-200",
  office: "bg-emerald-100 text-emerald-700 border-emerald-200",
  attendance: "bg-amber-100 text-amber-700 border-amber-200",
  parent: "bg-sky-100 text-sky-700 border-sky-200",
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Owner",
  office: "Office Admin",
  attendance: "Coach",
  parent: "Parent",
}

export function Header({ title }: { title?: string }) {
  const { role } = useRole()

  return (
    <header className="flex h-14 items-center gap-3 border-b bg-card px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      {title && (
        <h1 className="text-sm font-medium text-foreground">{title}</h1>
      )}
      <div className="ml-auto flex items-center gap-2">
        <Badge
          variant="outline"
          className={`text-xs font-medium ${ROLE_COLORS[role]}`}
        >
          Viewing as: {ROLE_LABELS[role]}
        </Badge>
      </div>
    </header>
  )
}
