"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreVertical, Pencil, Trash2, PlusCircle } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import { getExpensesByCategory } from "@/data/studio-expenses"
import { classFinancials } from "@/data/class-profitability"
import type { FinancialCategory, FinancialLineItem } from "@/lib/types"

interface ExpensesTabProps {
  currentMonth: string
}

interface LocalCategory {
  category: FinancialCategory
  items: { item: FinancialLineItem; amount: number }[]
}

export function ExpensesTab({ currentMonth }: ExpensesTabProps) {
  // Initialize local state from data layer so edits are interactive
  const [categories, setCategories] = useState<LocalCategory[]>(() =>
    getExpensesByCategory(currentMonth)
  )
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [addItemCategoryId, setAddItemCategoryId] = useState<string | null>(null)
  const [newItemName, setNewItemName] = useState("")
  const [newItemAmount, setNewItemAmount] = useState("")
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState("")
  const editInputRef = useRef<HTMLInputElement>(null)

  const totalInstructorPay = classFinancials.reduce((sum, f) => sum + f.monthlyInstructorCost, 0)

  // Derived totals from local state
  const totalExpenses = categories.reduce(
    (sum, cat) => sum + cat.items.reduce((s, { amount }) => s + amount, 0),
    0,
  )
  const itemCount = categories.reduce((sum, cat) => sum + cat.items.length, 0)
  const categoryCount = categories.length

  // Focus the edit input when it appears
  useEffect(() => {
    if (editingItemId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingItemId])

  function handleAddCategory() {
    if (!newCategoryName.trim()) return
    const id = `exp-cat-${Date.now()}`
    setCategories((prev) => [
      ...prev,
      {
        category: {
          id,
          name: newCategoryName.trim(),
          type: "expense",
          sortOrder: prev.length + 1,
        },
        items: [],
      },
    ])
    setNewCategoryName("")
    setAddCategoryOpen(false)
  }

  function handleDeleteCategory(categoryId: string) {
    setCategories((prev) => prev.filter((c) => c.category.id !== categoryId))
  }

  function handleAddItem(categoryId: string) {
    if (!newItemName.trim()) return
    const amount = parseFloat(newItemAmount) || 0
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.category.id !== categoryId) return cat
        return {
          ...cat,
          items: [
            ...cat.items,
            {
              item: {
                id: `exp-${Date.now()}`,
                categoryId,
                name: newItemName.trim(),
                defaultMonthlyAmount: amount,
              },
              amount,
            },
          ],
        }
      }),
    )
    setNewItemName("")
    setNewItemAmount("")
    setAddItemCategoryId(null)
  }

  function handleDeleteItem(categoryId: string, itemId: string) {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.category.id !== categoryId) return cat
        return {
          ...cat,
          items: cat.items.filter(({ item }) => item.id !== itemId),
        }
      }),
    )
  }

  function startEditing(itemId: string, currentAmount: number) {
    setEditingItemId(itemId)
    setEditingValue(currentAmount.toString())
  }

  function commitEdit(categoryId: string, itemId: string) {
    const newAmount = parseFloat(editingValue) || 0
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.category.id !== categoryId) return cat
        return {
          ...cat,
          items: cat.items.map(({ item, amount }) =>
            item.id === itemId ? { item, amount: newAmount } : { item, amount },
          ),
        }
      }),
    )
    setEditingItemId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Monthly Expenses</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Enter your average monthly costs. These flow into overhead allocation for class profitability.
          </p>
        </div>
        <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
          <DialogTrigger render={<Button size="sm" />}>
            <Plus className="size-4 mr-1.5" />
            Add Category
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Expense Category</DialogTitle>
              <DialogDescription>
                Create a new category to group related expenses.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Name</label>
              <Input
                placeholder="e.g. Equipment, Payroll Taxes"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              />
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
                Add Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category groups */}
      {categories.map(({ category, items }) => (
        <div key={category.id}>
          <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {category.name}
            </span>
            <div className="flex items-center gap-1">
              <button
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-accent transition-colors"
                onClick={() => {
                  setAddItemCategoryId(category.id)
                  setNewItemName("")
                  setNewItemAmount("")
                }}
              >
                <PlusCircle className="size-3" />
                Add Item
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="text-muted-foreground hover:text-foreground p-0.5 rounded hover:bg-accent transition-colors"
                >
                  <MoreVertical className="size-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setAddItemCategoryId(category.id)
                      setNewItemName("")
                      setNewItemAmount("")
                    }}
                  >
                    <PlusCircle className="size-4 mr-2" />
                    Add Item
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="size-4 mr-2" />
                    Delete Category
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="space-y-2">
            {items.map(({ item, amount }) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-card border rounded-lg px-4 py-3"
              >
                <span className="text-sm">{item.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-14 text-right">Monthly</span>
                  {editingItemId === item.id ? (
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input
                        ref={editInputRef}
                        type="number"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => commitEdit(category.id, item.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEdit(category.id, item.id)
                          if (e.key === "Escape") setEditingItemId(null)
                        }}
                        className="w-28 text-right text-sm font-medium tabular-nums pl-6 pr-2.5"
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditing(item.id, amount)}
                      className="bg-muted border rounded-md px-3 py-1.5 w-28 text-right text-sm font-medium tabular-nums hover:border-primary/50 hover:bg-muted/80 transition-colors cursor-text"
                    >
                      {formatCurrency(amount)}
                    </button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="text-muted-foreground hover:text-foreground text-lg leading-none p-0.5 rounded hover:bg-accent transition-colors"
                    >
                      ⋮
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => startEditing(item.id, amount)}>
                        <Pencil className="size-4 mr-2" />
                        Edit Amount
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteItem(category.id, item.id)}
                      >
                        <Trash2 className="size-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {/* Inline add item form */}
            {addItemCategoryId === category.id && (
              <div className="flex items-center gap-2 bg-accent/50 border border-dashed rounded-lg px-4 py-3">
                <Input
                  placeholder="Item name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <div className="relative w-28">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newItemAmount}
                    onChange={(e) => setNewItemAmount(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddItem(category.id)}
                    className="w-28 text-right pl-6 pr-2.5"
                  />
                </div>
                <Button size="sm" onClick={() => handleAddItem(category.id)} disabled={!newItemName.trim()}>
                  Add
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setAddItemCategoryId(null)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Total footer */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Total Monthly Expenses (excl. instructor pay)
          </p>
          <p className="text-xs text-emerald-700 mt-0.5">
            {itemCount} items across {categoryCount} categories
          </p>
        </div>
        <p className="text-2xl font-bold text-emerald-800 tabular-nums">
          {formatCurrency(totalExpenses)}
        </p>
      </div>

      {/* Instructor pay note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
        <strong>Note:</strong> Instructor pay ({formatCurrency(totalInstructorPay)}/mo) is calculated
        automatically from class schedules and pay rates — it&apos;s not entered here. Total overhead
        including instructor pay: <strong>{formatCurrency(totalExpenses + totalInstructorPay)}/mo</strong>
      </div>
    </div>
  )
}
