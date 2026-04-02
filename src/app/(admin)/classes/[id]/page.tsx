import { getAllClasses, getClassById } from "@/lib/dal/classes"
import { getAllStudents } from "@/lib/dal/students"
import { getAllInstructors, getInstructorName } from "@/lib/dal/instructors"
import { getFinancialsByClassId } from "@/lib/dal/class-profitability"
import ClientPage from "./client-page"

export async function generateStaticParams() {
  const classes = await getAllClasses()
  return classes.map((cls) => ({ id: cls.id }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [cls, students, instructors, financials] = await Promise.all([
    getClassById(id),
    getAllStudents(),
    getAllInstructors(),
    getFinancialsByClassId(id),
  ])

  // Pre-resolve instructor name if class exists
  const instructorName = cls ? await getInstructorName(cls.instructorId) : "Unknown"

  return (
    <ClientPage
      cls={cls}
      students={students}
      instructors={instructors}
      financials={financials}
      instructorName={instructorName}
    />
  )
}
