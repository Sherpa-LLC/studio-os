import "dotenv/config"
import { hashPassword } from "better-auth/crypto"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Role } from "../src/generated/prisma/enums"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

type SeedUser = {
  name: string
  email: string
  password: string
  role: Role
}

const SEED_USERS: SeedUser[] = [
  { name: "Vicki Wallace", email: "vicki@studioos.com", password: "password123", role: Role.admin },
  { name: "Pam Richardson", email: "pam@studioos.com", password: "password123", role: Role.office },
  { name: "Coach Sarah", email: "sarah@studioos.com", password: "password123", role: Role.attendance },
  { name: "Jennifer Martinez", email: "jennifer@studioos.com", password: "password123", role: Role.parent },
]

async function seedAuthUser({ name, email, password, role }: SeedUser) {
  const normalizedEmail = email.toLowerCase()
  const passwordHash = await hashPassword(password)

  const user = await db.user.upsert({
    where: { email: normalizedEmail },
    update: { name, role },
    create: {
      name,
      email: normalizedEmail,
      role,
      emailVerified: true,
    },
  })

  const credential = await db.account.findFirst({
    where: { userId: user.id, providerId: "credential" },
  })
  if (credential) {
    await db.account.update({
      where: { id: credential.id },
      data: { password: passwordHash },
    })
  } else {
    await db.account.create({
      data: {
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: passwordHash,
      },
    })
  }
}

async function main() {
  console.log("Seeding auth users (no running dev server required)...")

  for (const u of SEED_USERS) {
    await seedAuthUser(u)
    console.log(`  ${u.name} (${u.email}) — role: ${u.role}`)
  }

  const count = await db.user.count()
  console.log(`\nSeed complete! ${count} users in database.`)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
