import { renderHook, act } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { usePagination } from "./use-pagination"

describe("usePagination", () => {
  it("slices the first page and reports metadata for 25 items at page size 20", () => {
    const items = Array.from({ length: 25 }, (_, i) => i)
    const { result } = renderHook(() => usePagination(items))

    expect(result.current.totalItems).toBe(25)
    expect(result.current.pageSize).toBe(20)
    expect(result.current.pageCount).toBe(2)
    expect(result.current.paginatedItems).toEqual(items.slice(0, 20))
    expect(result.current.startIndex).toBe(1)
    expect(result.current.endIndex).toBe(20)
  })

  it("navigates to page 2", () => {
    const items = Array.from({ length: 25 }, (_, i) => i)
    const { result } = renderHook(() => usePagination(items))

    act(() => {
      result.current.setPage(2)
    })

    expect(result.current.page).toBe(2)
    expect(result.current.paginatedItems).toEqual(items.slice(20, 40))
    expect(result.current.startIndex).toBe(21)
    expect(result.current.endIndex).toBe(25)
  })

  it("resets to page 1 when the items array identity changes", () => {
    const first = [1, 2, 3, 4, 5]
    const { result, rerender } = renderHook(
      ({ rows }: { rows: number[] }) => usePagination(rows),
      { initialProps: { rows: first } }
    )

    act(() => {
      result.current.setPage(2)
    })
    expect(result.current.page).toBe(2)

    const filtered = [1, 2, 3]
    rerender({ rows: filtered })

    expect(result.current.page).toBe(1)
    expect(result.current.totalItems).toBe(3)
  })

  it("respects initialPageSize 10", () => {
    const items = Array.from({ length: 15 }, (_, i) => i)
    const { result } = renderHook(() =>
      usePagination(items, { initialPageSize: 10 })
    )

    expect(result.current.pageSize).toBe(10)
    expect(result.current.pageCount).toBe(2)
    expect(result.current.paginatedItems).toHaveLength(10)
  })
})
