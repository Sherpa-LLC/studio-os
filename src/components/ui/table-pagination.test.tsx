import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { TablePagination } from "./table-pagination"

describe("TablePagination", () => {
  it("shows row range and calls handlers", () => {
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()

    render(
      <TablePagination
        page={2}
        pageCount={3}
        pageSize={20}
        totalItems={55}
        startIndex={21}
        endIndex={40}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        showWhenSinglePage
      />
    )

    expect(screen.getByText(/Showing/)).toBeInTheDocument()
    expect(screen.getByText("21")).toBeInTheDocument()
    expect(screen.getByText("40")).toBeInTheDocument()
    expect(screen.getByText("55")).toBeInTheDocument()
    expect(screen.getByText("2 / 3")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /previous page/i }))
    expect(onPageChange).toHaveBeenCalledWith(1)

    fireEvent.click(screen.getByRole("button", { name: /next page/i }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it("renders nothing when totalItems is 0", () => {
    const { container } = render(
      <TablePagination
        page={1}
        pageCount={1}
        pageSize={20}
        totalItems={0}
        startIndex={0}
        endIndex={0}
        onPageChange={() => {}}
      />
    )
    expect(container.firstChild).toBeNull()
  })
})
