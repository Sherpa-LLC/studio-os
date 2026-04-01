"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

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
  const [role, setRoleState] = useState<Role>("admin")

  const setRole = useCallback((newRole: Role) => {
    setRoleState(newRole)
  }, [])

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        userName: ROLE_USERS[role].name,
      }}
    >
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
