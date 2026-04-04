<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

### Services overview

| Service | How to start | Port | Notes |
|---------|-------------|------|-------|
| PostgreSQL 17 | `sudo docker compose up -d` | 5433 | Requires Docker; data in named volume `pgdata` |
| Next.js dev server | `npm run dev` | 3000 | Turbopack-powered; hot reloads on file changes |

### Environment variables

A `.env` file is needed at the repo root (gitignored). Required variables:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/studio_os
BETTER_AUTH_SECRET=<any-random-string>
BETTER_AUTH_URL=http://localhost:3000
```

### Database setup

After PostgreSQL is running and `.env` exists:
1. `npm run db:migrate` — applies Prisma migrations
2. `npm run db:seed` — creates test users via the better-auth signup API (**requires the dev server to be running first**)

### Test accounts (all use password `password123`)

| Email | Role |
|-------|------|
| vicki@studioos.com | admin |
| pam@studioos.com | office |
| sarah@studioos.com | attendance |
| jennifer@studioos.com | parent |

### Key commands

See `package.json` scripts. Quick reference:
- **Lint**: `npm run lint` (pre-existing warnings/errors in codebase)
- **Unit tests**: `npm run test` (Vitest, 245 tests)
- **E2E tests**: `npm run test:e2e` (Playwright, requires dev server running)
- **Build**: `npm run build`

### Gotchas

- The seed script calls the better-auth signup API at `BETTER_AUTH_URL`, so the dev server **must** be running before `npm run db:seed`.
- Docker requires `sudo` in this environment. Use `sudo docker compose up -d` and `sudo dockerd` if the daemon isn't running.
- The Docker daemon needs `fuse-overlayfs` storage driver and `iptables-legacy` in this VM. See `/etc/docker/daemon.json`.
- ESLint exits with code 1 due to pre-existing errors (mostly `no-explicit-any` and `no-unused-vars`). This is normal for the current prototype phase.
