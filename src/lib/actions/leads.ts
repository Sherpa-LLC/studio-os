"use server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createLead(data: FormData) {
  const lead = await db.lead.create({
    data: {
      firstName: data.get("firstName") as string,
      lastName: data.get("lastName") as string,
      email: data.get("email") as string,
      phone: data.get("phone") as string,
      childName: data.get("childName") as string,
      childAge: parseInt(data.get("childAge") as string),
      interestDiscipline: (data.get("discipline") as string).replace(/-/g, "_") as any,
      source: (data.get("source") as string).replace(/-/g, "_") as any,
      stage: "new_lead",
    },
  })
  revalidatePath("/crm")
  return lead.id
}

export async function updateLeadStage(id: string, stage: string) {
  const dbStage = stage === "new" ? "new_lead" : stage.replace(/-/g, "_")
  await db.lead.update({ where: { id }, data: { stage: dbStage as any, lastContactedAt: new Date() } })
  revalidatePath("/crm")
}
