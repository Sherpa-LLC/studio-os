/**
 * Format a number as US currency.
 * @example formatCurrency(1234.5) -> "$1,234.50"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

/**
 * Format an ISO date string as a readable date.
 * @example formatDate("2026-03-15") -> "Mar 15, 2026"
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString.includes("T") ? isoString : isoString + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * Format a 10-digit phone number string.
 * @example formatPhone("5551234567") -> "(555) 123-4567"
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.length !== 10) return phone
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

/**
 * Format a decimal value as a percentage.
 * @example formatPercent(0.125) -> "12.5%"
 * @example formatPercent(12.5) -> "12.5%" (already a percent-scale number)
 */
export function formatPercent(value: number, decimals = 1): string {
  // Heuristic: values > 1 are already percentage-scale
  const pct = value <= 1 && value >= -1 ? value * 100 : value
  return `${pct.toFixed(decimals)}%`
}

/**
 * Calculate age in whole years from a date-of-birth string.
 * @example formatAge("2018-06-15") -> 7 (if today is 2026-03-27)
 */
export function formatAge(dob: string): number {
  const birth = new Date(dob + "T00:00:00")
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age--
  }
  return age
}

/**
 * Get initials from first and last name.
 * @example getInitials("John", "Doe") -> "JD"
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

/**
 * Determine a class's capacity status.
 */
export type CapacityStatus = "available" | "nearly-full" | "full"

export function getCapacityStatus(
  enrolled: number,
  capacity: number,
): CapacityStatus {
  if (enrolled >= capacity) return "full"
  if (enrolled / capacity >= 0.85) return "nearly-full"
  return "available"
}

/**
 * Map a capacity status to a Tailwind color class for badges / indicators.
 */
export function getCapacityColor(status: CapacityStatus): string {
  switch (status) {
    case "available":
      return "text-emerald-600 bg-emerald-50"
    case "nearly-full":
      return "text-amber-600 bg-amber-50"
    case "full":
      return "text-red-600 bg-red-50"
  }
}

/**
 * Format a 24-hour time string to 12-hour display.
 * @example formatTime("15:30") -> "3:30 PM"
 */
export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`
}
