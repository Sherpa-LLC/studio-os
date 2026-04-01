"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useRole, type Role } from "@/providers/role-provider"
import {
  LayoutDashboard,
  Home,
  BookOpen,
  CreditCard,
  MessageSquare,
  Megaphone,
  ClipboardCheck,
  TrendingUp,
  Zap,
  Star,
  ChevronDown,
  LogOut,
  Sparkles,
  Trophy,
  Users,
  CalendarDays,
  BookMarked,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
  roles: Role[]
  badge?: string
}

type NavGroup = {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["admin"],
      },
    ],
  },
  {
    label: "People",
    items: [
      {
        title: "Households",
        href: "/households",
        icon: Home,
        roles: ["admin", "office"],
      },
    ],
  },
  {
    label: "Programs",
    items: [
      {
        title: "Classes",
        href: "/classes",
        icon: BookOpen,
        roles: ["admin", "office", "attendance"],
      },
      {
        title: "Attendance",
        href: "/attendance",
        icon: ClipboardCheck,
        roles: ["admin", "office", "attendance"],
      },
      {
        title: "Recitals",
        href: "/recitals",
        icon: Sparkles,
        roles: ["admin", "office"],
      },
      {
        title: "Competition",
        href: "/competition",
        icon: Trophy,
        roles: ["admin", "office"],
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        title: "Billing",
        href: "/billing",
        icon: CreditCard,
        roles: ["admin"],
      },
      {
        title: "Studio Financials",
        href: "/studio-financials",
        icon: TrendingUp,
        roles: ["admin"],
      },
    ],
  },
  {
    label: "Communicate",
    items: [
      {
        title: "Conversations",
        href: "/conversations",
        icon: MessageSquare,
        roles: ["admin", "office"],
        badge: "5",
      },
      {
        title: "Broadcasts",
        href: "/communications",
        icon: Megaphone,
        roles: ["admin", "office"],
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "Staff",
        href: "/staff",
        icon: Users,
        roles: ["admin"],
      },
      {
        title: "Seasons",
        href: "/seasons",
        icon: CalendarDays,
        roles: ["admin"],
      },
      {
        title: "Knowledge Base",
        href: "/knowledge-base",
        icon: BookMarked,
        roles: ["admin", "office", "attendance"],
      },
    ],
  },
  {
    label: "Growth",
    items: [
      {
        title: "CRM",
        href: "/crm",
        icon: TrendingUp,
        roles: ["admin"],
      },
      {
        title: "Automations",
        href: "/automations",
        icon: Zap,
        roles: ["admin"],
      },
      {
        title: "Reviews",
        href: "/reviews",
        icon: Star,
        roles: ["admin"],
      },
    ],
  },
]

const ROLE_LABELS: Record<Role, string> = {
  admin: "Owner",
  office: "Office Admin",
  attendance: "Coach",
  parent: "Parent",
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { role, setRole, userName } = useRole()

  const filteredGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.roles.includes(role)),
  })).filter((group) => group.items.length > 0)

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-sm">S</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            Studio OS
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {filteredGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href))
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-xs h-5 min-w-5 justify-center"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent"
                  />
                }
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-medium">{userName}</span>
                  <span className="text-xs text-sidebar-foreground/60">
                    {ROLE_LABELS[role]}
                  </span>
                </div>
                <ChevronDown className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-56"
              >
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  Switch Role
                </div>
                {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                  <DropdownMenuItem
                    key={r}
                    onClick={() => {
                      setRole(r)
                      if (r === "parent") {
                        router.push("/portal")
                      } else {
                        router.push("/dashboard")
                      }
                    }}
                    className={role === r ? "bg-accent" : ""}
                  >
                    {ROLE_LABELS[r]}
                    {role === r && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        Active
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/login")}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Back to Login
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
