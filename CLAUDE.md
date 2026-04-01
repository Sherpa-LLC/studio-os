@AGENTS.md

# Studio OS

Dance studio management SaaS (extensible to martial arts, gymnastics). Replacing 6+ disconnected tools for studio owners. Currently in **clickable prototype phase** — optimize for demo-ability, not production hardening.

## Browser Interaction

**Use PinchTab, not Playwright.** For all browser testing, screenshots, navigation, and interaction, use the `pinchtab` CLI — never Playwright MCP tools.

```bash
pinchtab nav http://localhost:3000    # navigate
pinchtab screenshot                   # capture current page
pinchtab snap                         # accessibility tree snapshot
pinchtab click "selector"             # click elements
pinchtab fill "selector" "value"      # fill inputs
```

## Tech Stack

- **Next.js 16** (App Router) — APIs have breaking changes from older versions. Always check `node_modules/next/dist/docs/` before writing new routing, layout, or server component code.
- **React 19** with TypeScript (strict mode)
- **Tailwind CSS v4** via PostCSS — no `tailwind.config.js`. Config is in `globals.css`.
- **Base UI React** + **shadcn/ui** (base-nova style) — not Radix directly
- **oklch** color system via CSS variables — don't hard-code color values
- **Geist** font family (loaded in root layout)

## File Conventions

- Files: `kebab-case.tsx` — Components: `PascalCase`
- Import alias: `@/*` maps to `./src/*`
- All domain types: `src/lib/types.ts` — don't create separate type files
- Formatting helpers: `src/lib/format.ts`
- Constants (disciplines, age groups, rooms): `src/lib/constants.ts`
- Utility: `cn()` from `@/lib/utils` (clsx + tailwind-merge)

## Component Pattern

UI components wrap Base UI primitives with CVA variants:

```tsx
import { SomePrimitive } from "@base-ui/react/some-primitive"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const variants = cva("base-classes", {
  variants: { variant: { default: "..." }, size: { default: "..." } },
  defaultVariants: { variant: "default", size: "default" }
})

function MyComponent({ className, variant, size, ...props }) {
  return <SomePrimitive className={cn(variants({ variant, size, className }))} {...props} />
}
```

## Architecture

- **Route groups**: `(admin)`, `(auth)`, `(parent)` — each with its own layout
- **No database** — mock data lives in `src/data/`. All client-side static imports.
- **No API routes** yet
- **No real auth** — `RoleProvider` context switches between roles (admin, office, attendance, parent)
- **Styling**: Tailwind utilities only, colors via CSS variables (`--primary`, `--secondary`, etc.)

## Domain Rules

- **Billing engine** is highest-risk: every override must have an immutable audit trail
- **Never partition data by season** — unified data model, filtering is a UI concern
- **Classes can span multiple days** (M/W/F schedules) — don't assume single-day
- Key entities: Household, Guardian, Student, Class, Season, Invoice, Instructor
- 9 dance disciplines, 6 age groups, 4 roles — all defined in `src/lib/constants.ts`

## Project Phase

This is a prototype. Don't over-engineer:
- Mock data is fine — no need for real DB or auth yet
- Prefer things that look and feel complete in the UI
- Build thin end-to-end slices (tracer bullets) before fleshing out layers
