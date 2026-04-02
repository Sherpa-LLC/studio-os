import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export const runtime = "nodejs"

const PUBLIC_ROUTES = ["/login", "/api/auth"]
const ADMIN_ONLY = ["/dashboard", "/studio-financials", "/insights"]
const ADMIN_OFFICE = ["/billing", "/households", "/communications", "/conversations", "/recitals", "/competition", "/crm", "/reviews"]
const STAFF_ROUTES = ["/classes", "/attendance", "/knowledge-base", "/staff", "/seasons", "/automations"]
const PARENT_ROUTES = ["/portal", "/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next()
  }

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const role = (session.user as { role?: string }).role ?? "parent"

  // Parent routes — parents and admins
  if (PARENT_ROUTES.some((r) => pathname.startsWith(r))) {
    if (role !== "parent" && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.next()
  }

  // Admin-only routes
  if (ADMIN_ONLY.some((r) => pathname.startsWith(r))) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  // Admin + Office routes
  if (ADMIN_OFFICE.some((r) => pathname.startsWith(r))) {
    if (role !== "admin" && role !== "office") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  // Staff routes (admin, office, attendance)
  if (STAFF_ROUTES.some((r) => pathname.startsWith(r))) {
    if (role !== "admin" && role !== "office" && role !== "attendance") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|logo|apple-touch|.*\\.png$|.*\\.ico$).*)"],
}
