"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth-client"
import {
  LayoutDashboard,
  ClipboardList,
  UserCheck,
  Users,
  Loader2,
} from "lucide-react"

const DEMO_ACCOUNTS = [
  {
    label: "Studio Owner",
    description: "Full dashboard, financials, reports, and admin access",
    icon: LayoutDashboard,
    email: "vicki@studioos.com",
    password: "password123",
    redirect: "/dashboard",
  },
  {
    label: "Office Admin",
    description: "Manage registrations, billing, communications, and families",
    icon: ClipboardList,
    email: "pam@studioos.com",
    password: "password123",
    redirect: "/households",
  },
  {
    label: "Coach / Instructor",
    description: "View class rosters and mark attendance",
    icon: UserCheck,
    email: "sarah@studioos.com",
    password: "password123",
    redirect: "/attendance",
  },
  {
    label: "Parent / Guardian",
    description: "View schedule, billing, and manage your household",
    icon: Users,
    email: "jennifer@studioos.com",
    password: "password123",
    redirect: "/portal",
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDemoLogin(account: (typeof DEMO_ACCOUNTS)[number]) {
    setLoading(account.email)
    setError(null)
    try {
      const result = await signIn.email({
        email: account.email,
        password: account.password,
      })
      if (result.error) {
        setError(result.error.message ?? "Login failed")
        setLoading(null)
        return
      }
      router.push(account.redirect)
      router.refresh()
    } catch {
      setError("Login failed. Is the database running?")
      setLoading(null)
    }
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
            Select a role to sign in
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DEMO_ACCOUNTS.map((account) => {
            const Icon = account.icon
            const isLoading = loading === account.email
            return (
              <button
                key={account.email}
                onClick={() => handleDemoLogin(account)}
                disabled={loading !== null}
                className="group relative flex flex-col items-start gap-3 rounded-xl border bg-card p-6 text-left shadow-sm transition-all hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{account.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {account.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Demo accounts &mdash; click any role to sign in
        </p>
      </div>
    </div>
  )
}
