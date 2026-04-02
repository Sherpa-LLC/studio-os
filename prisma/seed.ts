import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000"

async function createUser(name: string, email: string, password: string, role: string) {
  // Create via better-auth API for proper password hashing
  const res = await fetch(`${BETTER_AUTH_URL}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
  if (!res.ok) {
    // User may already exist, try direct DB update
    console.log(`  Signup failed for ${email}, updating role directly...`)
  }
  // Set the correct role via SQL (signup defaults to "parent")
  await db.$executeRawUnsafe(
    `UPDATE "user" SET role = '${role}' WHERE email = '${email}'`
  )
}

async function main() {
  console.log("Seeding users...")
  console.log("NOTE: Dev server must be running at", BETTER_AUTH_URL)

  const users = [
    { name: "Vicki Wallace", email: "vicki@studioos.com", role: "admin" },
    { name: "Pam Richardson", email: "pam@studioos.com", role: "office" },
    { name: "Coach Sarah", email: "sarah@studioos.com", role: "attendance" },
    { name: "Jennifer Martinez", email: "jennifer@studioos.com", role: "parent" },
  ]

  for (const u of users) {
    await createUser(u.name, u.email, "password123", u.role)
    console.log(`  ${u.name} (${u.role})`)
  }

  // Verify
  const count = await db.user.count()
  console.log(`\nSeed complete! ${count} users in database.`)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
