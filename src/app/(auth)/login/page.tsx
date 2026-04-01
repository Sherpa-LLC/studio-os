"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useRole, type Role } from "@/providers/role-provider"
import {
  LayoutDashboard,
  ClipboardList,
  UserCheck,
  Users,
} from "lucide-react"

const ROLE_OPTIONS: {
  role: Role
  label: string
  description: string
  icon: React.ElementType
  redirect: string
}[] = [
  {
    role: "admin",
    label: "Studio Owner",
    description: "Full dashboard, financials, reports, and admin access",
    icon: LayoutDashboard,
    redirect: "/dashboard",
  },
  {
    role: "office",
    label: "Office Admin",
    description: "Manage registrations, billing, communications, and families",
    icon: ClipboardList,
    redirect: "/households",
  },
  {
    role: "attendance",
    label: "Coach / Instructor",
    description: "View class rosters and mark attendance",
    icon: UserCheck,
    redirect: "/attendance",
  },
  {
    role: "parent",
    label: "Parent / Guardian",
    description: "View schedule, billing, and manage your household",
    icon: Users,
    redirect: "/portal",
  },
]

export default function LoginPage() {
  const router = useRouter()
  const { setRole } = useRole()

  function handleSelect(option: (typeof ROLE_OPTIONS)[number]) {
    setRole(option.role)
    router.push(option.redirect)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <Image src="/logo-256.png" alt="Studio OS" width={40} height={40} className="h-10 w-10 rounded-lg" />
            <span className="text-2xl font-bold tracking-tight text-foreground">
              Studio OS
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            Select a role to explore the prototype
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ROLE_OPTIONS.map((option) => {
            const Icon = option.icon
            return (
              <button
                key={option.role}
                onClick={() => handleSelect(option)}
                className="group relative flex flex-col items-start gap-3 rounded-xl border bg-card p-6 text-left shadow-sm transition-all hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{option.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Clickable prototype &mdash; no real authentication
        </p>
      </div>
    </div>
  )
}
