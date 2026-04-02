import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

// Hash password using better-auth's internal method
async function hashPassword(password: string): Promise<string> {
  const { scrypt, randomBytes } = await import("node:crypto")
  const { promisify } = await import("node:util")
  const scryptAsync = promisify(scrypt)
  const salt = randomBytes(16).toString("hex")
  const buf = (await scryptAsync(password, salt, 64)) as Buffer
  return `${buf.toString("hex")}.${salt}`
}

async function main() {
  console.log("Seeding database...")

  // Clear existing data
  await db.account.deleteMany()
  await db.session.deleteMany()
  await db.user.deleteMany()

  const password = await hashPassword("password123")

  const users = [
    { name: "Vicki Wallace", email: "vicki@studioos.com", role: "admin" as const },
    { name: "Pam Richardson", email: "pam@studioos.com", role: "office" as const },
    { name: "Coach Sarah", email: "sarah@studioos.com", role: "attendance" as const },
    { name: "Jennifer Martinez", email: "jennifer@studioos.com", role: "parent" as const },
  ]

  for (const u of users) {
    const user = await db.user.create({
      data: {
        name: u.name,
        email: u.email,
        role: u.role,
        emailVerified: true,
      },
    })
    await db.account.create({
      data: {
        userId: user.id,
        accountId: user.id,
        providerId: "credential",
        password,
      },
    })
    console.log(`  Created user: ${u.name} (${u.role})`)
  }

  console.log("Seed complete!")
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
