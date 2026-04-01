"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useRole } from "@/providers/role-provider"
import {
  CalendarDays,
  CreditCard,
  Home,
  MessageSquare,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const NAV_ITEMS = [
  { label: "Home", href: "/portal", icon: Home },
  { label: "Schedule", href: "/portal/schedule", icon: CalendarDays },
  { label: "Billing", href: "/portal/billing", icon: CreditCard },
  { label: "Household", href: "/portal/household", icon: Home },
  { label: "Messages", href: "/portal/messages", icon: MessageSquare },
]

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { userName } = useRole()
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto max-w-5xl flex h-16 items-center justify-between px-4 sm:px-6">
          <Link
            href="/portal"
            className="flex items-center gap-2"
          >
            <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo-256.png`} alt="Studio OS" width={32} height={32} className="h-8 w-8 rounded-lg" />
            <span className="text-lg font-bold tracking-tight hidden sm:inline">
              Studio OS
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/portal" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-accent transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">Parent Portal</p>
              </div>
              <DropdownMenuItem onClick={() => router.push("/login")}>
                <LogOut className="mr-2 h-4 w-4" />
                Switch Role
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">{children}</main>
    </div>
  )
}
