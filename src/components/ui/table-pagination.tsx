"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

export const TABLE_PAGE_SIZE_OPTIONS = [10, 20, 50] as const

export type TablePaginationProps = {
  className?: string
  page: number
  pageCount: number
  pageSize: number
  totalItems: number
  startIndex: number
  endIndex: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  /** If false, hides the row-count / page-size row when everything fits on one page. Default true. */
  showWhenSinglePage?: boolean
}

export function TablePagination({
  className,
  page,
  pageCount,
  pageSize,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
  showWhenSinglePage = false,
}: TablePaginationProps) {
  if (totalItems === 0) {
    return null
  }

  if (!showWhenSinglePage && pageCount <= 1) {
    return null
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t px-2 py-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p className="text-sm text-muted-foreground tabular-nums">
        Showing{" "}
        <span className="font-medium text-foreground">{startIndex}</span>
        {"\u2013"}
        <span className="font-medium text-foreground">{endIndex}</span> of{" "}
        <span className="font-medium text-foreground">{totalItems}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Rows per page
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                const n = Number(v)
                if (!Number.isNaN(n)) onPageSizeChange(n)
              }}
            >
              <SelectTrigger size="sm" className="w-[4.5rem]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TABLE_PAGE_SIZE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-[4.5rem] text-center text-sm tabular-nums text-muted-foreground px-1">
            {page} / {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
