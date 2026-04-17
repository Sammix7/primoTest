# AGENTS.md — Trustable Workspace

## Core Rules

- **Never start dev server** — continuous deployment is automatic on edit
- **Never build/deploy manually** — CD pipeline handles this
- **Never create `__main__.py`** — use `action-new` tool for backend actions
- **Never edit `requirements.txt`** — use `action-requirements` tool

## Architecture

**Frontend:** React 18 + Vite + TypeScript + TailwindCSS + shadcn/ui + React Router (HashRouter)

**Backend:** Python serverless actions at `packages/<package>/<action>/`
- Public endpoints: `/api/my/<package>/<action>` (usually `v1` as package)
- Private actions: `#--web false`, invoke via `action-invoke`

## Commands

```bash
npm run dev      # Local dev only (not needed for CD)
npm run build    # Build to `web/` (auto-run by CD)
npm run lint     # ESLint
```

## Adding Features

**New route:** Create page in `src/pages/`, import and add in `App.tsx` above `*` catch-all

**New backend action:** Use `action-new` tool, never create directories manually

**New service:**
- PostgreSQL → `action-add-postgresql` (uses `psycopg`)
- Redis → `action-add-redis` (uses `redis`)
- S3 → `action-add-s3` (uses `boto3`)
- Milvus → `action-add-milvus` (uses `pymilvus`)

**Init actions:** Private actions in `init` package; make them incremental, idempotent, non-destructive

## Conventions

- Import alias: `@/` → `src/`
- TypeScript: relaxed (`noImplicitAny: false`, `strictNullChecks: false`)
- Build output: `web/` directory
- API proxy: `/api/my` → backend (configured in `vite.config.ts`)

## Existing Instruction Sources

- `/home/node/.config/opencode/opencode.md` — backend action patterns, init workflows
- `CLAUDE.md` — frontend architecture overview
- `.agents/skills/` — PostgreSQL, Redis, S3 usage patterns
