import { hashPassword, verifyPassword } from "better-auth/crypto"
import { describe, expect, it } from "vitest"

/**
 * Seed script uses the same `hashPassword` as Better Auth sign-up.
 * This proves demo passwords can be verified the same way login does.
 */
describe("better-auth password hashing (used by prisma/seed.ts)", () => {
  it("verifyPassword accepts hash from hashPassword for password123", async () => {
    const hash = await hashPassword("password123")
    expect(hash).toMatch(/^[0-9a-f]+:[0-9a-f]+$/i)

    await expect(
      verifyPassword({ hash, password: "password123" })
    ).resolves.toBe(true)

    await expect(
      verifyPassword({ hash, password: "wrong" })
    ).resolves.toBe(false)
  })
})
