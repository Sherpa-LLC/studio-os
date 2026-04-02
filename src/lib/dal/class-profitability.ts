import {
  classFinancials,
  getFinancialsByClassId as _getFinancialsByClassId,
} from "@/data/class-profitability"
import type { ClassFinancials } from "@/lib/types"

export async function getAllClassFinancials(): Promise<ClassFinancials[]> {
  return classFinancials
}

export async function getFinancialsByClassId(classId: string): Promise<ClassFinancials | undefined> {
  return _getFinancialsByClassId(classId)
}
