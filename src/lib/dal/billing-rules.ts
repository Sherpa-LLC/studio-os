import { billingConfig } from "@/data/billing-rules"
import type { BillingOverride } from "@/lib/types"

export async function getBillingConfig() {
  return billingConfig
}
