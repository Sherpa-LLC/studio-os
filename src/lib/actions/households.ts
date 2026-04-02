"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createHousehold(data: FormData) {
  const household = await db.household.create({
    data: {
      street: data.get("street") as string,
      city: data.get("city") as string,
      state: data.get("state") as string,
      zip: data.get("zip") as string,
      status: "active",
    },
  })
  revalidatePath("/households")
  return household.id
}

export async function updateHousehold(id: string, data: FormData) {
  await db.household.update({
    where: { id },
    data: {
      street: data.get("street") as string || undefined,
      city: data.get("city") as string || undefined,
      state: data.get("state") as string || undefined,
      zip: data.get("zip") as string || undefined,
    },
  })
  revalidatePath("/households")
  revalidatePath(`/households/${id}`)
}

export async function archiveHousehold(id: string) {
  await db.household.update({
    where: { id },
    data: { status: "archived" },
  })
  revalidatePath("/households")
}
