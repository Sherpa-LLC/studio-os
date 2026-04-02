import { getAllClasses, getClassById } from "@/lib/dal/classes"
import { getStudentsByClass } from "@/lib/dal/students"
import { getInstructorName } from "@/lib/dal/instructors"
import ClientPage from "./client-page"

export async function generateStaticParams() {
  const classes = await getAllClasses()
  return classes.map((cls) => ({ classId: cls.id }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = await params
  const [cls, students] = await Promise.all([
    getClassById(classId),
    getStudentsByClass(classId),
  ])

  const instructorName = cls ? await getInstructorName(cls.instructorId) : "Unknown"

  return (
    <ClientPage
      cls={cls}
      students={students}
      instructorName={instructorName}
    />
  )
}
