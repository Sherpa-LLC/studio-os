"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createStudent(data: FormData) {
  const student = await db.student.create({
    data: {
      householdId: data.get("householdId") as string,
      firstName: data.get("firstName") as string,
      lastName: data.get("lastName") as string,
      dateOfBirth: new Date(data.get("dateOfBirth") as string),
      gender: (data.get("gender") as string) === "male" ? "male" : (data.get("gender") as string) === "other" ? "other" : "female",
      medicalNotes: (data.get("medicalNotes") as string) || undefined,
      enrollmentStatus: "active",
    },
  })
  revalidatePath("/households")
  return student.id
}

export async function updateStudent(id: string, data: FormData) {
  await db.student.update({
    where: { id },
    data: {
      firstName: data.get("firstName") as string || undefined,
      lastName: data.get("lastName") as string || undefined,
      medicalNotes: (data.get("medicalNotes") as string) || undefined,
    },
  })
  revalidatePath("/households")
}

export async function withdrawStudent(id: string) {
  await db.student.update({
    where: { id },
    data: { enrollmentStatus: "withdrawn" },
  })
  revalidatePath("/households")
}
