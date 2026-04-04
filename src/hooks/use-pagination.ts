"use client"

import { useEffect, useMemo, useState } from "react"

export const DEFAULT_PAGE_SIZE = 20

export type UsePaginationOptions = {
  /** Initial rows per page. Default 20. */
  initialPageSize?: number
}

export function usePagination<T>(
  items: readonly T[],
  options: UsePaginationOptions = {}
) {
  const initialPageSize = options.initialPageSize ?? DEFAULT_PAGE_SIZE
  const [page, setPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(initialPageSize)

  const totalItems = items.length
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize) || 1)

  useEffect(() => {
    setPage(1)
  }, [items])

  useEffect(() => {
    setPage((p) => Math.min(p, pageCount))
  }, [pageCount])

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, page, pageSize])

  const start = totalItems === 0 ? 0 : (page - 1) * pageSize

  function setPageSize(size: number) {
    setPageSizeState(size)
    setPage(1)
  }

  return {
    page,
    pageSize,
    pageCount,
    totalItems,
    paginatedItems,
    setPage,
    setPageSize,
    /** 1-based inclusive start row for summary text (0 when empty). */
    startIndex: totalItems === 0 ? 0 : start + 1,
    /** 1-based inclusive end row for summary text. */
    endIndex: Math.min(start + pageSize, totalItems),
  }
}
