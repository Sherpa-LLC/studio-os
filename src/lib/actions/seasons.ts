"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createSeason(data: FormData) {
  const billingType = (data.get("billingType") as string) || "monthly"
  const season = await db.season.create({
    data: {
      name: data.get("name") as string,
      startDate: new Date(data.get("startDate") as string),
      endDate: new Date(data.get("endDate") as string),
      billingRate: parseFloat(data.get("billingRate") as string),
      billingType: billingType.replace("-", "_") as any,
      status: "upcoming",
    },
  })
  revalidatePath("/seasons")
  return season.id
}

export async function updateSeasonStatus(id: string, status: string) {
  await db.season.update({
    where: { id },
    data: { status: status.replace("-", "_") as any },
  })
  revalidatePath("/seasons")
}
