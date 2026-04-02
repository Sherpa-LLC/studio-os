"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { useSession } from "@/lib/auth-client"

export type Role = "admin" | "office" | "attendance" | "parent"

interface RoleContextType {
  role: Role
  setRole: (role: Role) => void
  userName: string
  userAvatar?: string
}

const ROLE_USERS: Record<Role, { name: string }> = {
  admin: { name: "Vicki Wallace" },
  office: { name: "Pam Richardson" },
  attendance: { name: "Coach Sarah" },
  parent: { name: "Jennifer Martinez" },
}

const RoleContext = createContext<RoleContextType | null>(null)

export function RoleProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [fallbackRole, setFallbackRole] = useState<Role>("admin")

  const sessionRole = (session?.user as { role?: string } | undefined)?.role as Role | undefined
  const role = sessionRole ?? fallbackRole

  const setRole = useCallback((newRole: Role) => {
    setFallbackRole(newRole)
  }, [])

  const userName = session?.user?.name ?? ROLE_USERS[role].name

  return (
    <RoleContext.Provider value={{ role, setRole, userName }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}
