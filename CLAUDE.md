# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Full Stack on Cloudflare course starter repository from Matthew Sessions' course at learn.backpine.com/full-stack-on-cloudflare/. It's a monorepo using pnpm workspaces with two Cloudflare Workers applications and a shared data operations package.

## Architecture

### Monorepo Structure
- **pnpm workspace** monorepo with apps in `/apps` and packages in `/packages`
- **apps/user-application**: React SPA with Cloudflare Worker backend (main application)
- **apps/data-service**: Cloudflare Worker service using WorkerEntrypoint pattern
- **packages/data-ops**: Shared data layer with database schemas, auth, and helpers

### Technology Stack
- **Frontend**: React 19, TanStack Router, TanStack Query, Tailwind CSS v4, Radix UI
- **Backend**: Cloudflare Workers with Hono, tRPC for API layer
- **Database**: Drizzle ORM with D1 (Cloudflare's SQLite)
- **Auth**: Better Auth with Stripe integration
- **Build Tools**: Vite, Wrangler, TypeScript

## Development Commands

### Quick Start
```bash
# Install dependencies
pnpm install

# Development
pnpm dev-frontend        # Start user-application frontend (port 3000)
pnpm dev-data-service    # Start data-service worker

# Build shared package
pnpm build-package       # Build @repo/data-ops package
```

### Application-Specific Commands

**User Application** (in `apps/user-application/`):
```bash
pnpm dev              # Start development server on port 3000
pnpm build            # Build for production
pnpm test             # Run Vitest tests
pnpm cf-typegen       # Generate Cloudflare Worker types
pnpm deploy           # Build and deploy to Cloudflare
```

**Data Service** (in `apps/data-service/`):
```bash
pnpm dev              # Start with remote bindings support
pnpm start            # Start development server
pnpm test             # Run Vitest tests
pnpm cf-typegen       # Generate Worker types (BaseEnv interface)
pnpm deploy           # Deploy to Cloudflare
```

**Data Operations Package** (in `packages/data-ops/`):
```bash
pnpm build                    # Build TypeScript to dist/
pnpm pull                     # Pull DB schema from remote
pnpm generate                 # Generate Drizzle migrations
pnpm studio                   # Open Drizzle Studio
pnpm better-auth-generate     # Generate Better Auth types
```

## Key Architectural Patterns

### 1. tRPC API Layer
The user-application uses tRPC for type-safe API communication:
- Router definition: `apps/user-application/worker/trpc/router.ts`
- Individual routers in: `worker/trpc/routers/`
- Context creation: `worker/trpc/context.ts`
- Frontend consumption via TanStack Query integration

### 2. Cloudflare Worker Structure
**User Application Worker**:
- Handles `/trpc` routes via tRPC
- Serves static assets via `env.ASSETS` binding
- Entry point: `worker/index.ts`

**Data Service Worker**:
- Uses `WorkerEntrypoint` class pattern
- Service binding ready for inter-worker communication
- Entry point: `src/index.ts`

### 3. Shared Data Layer
The `@repo/data-ops` package provides:
- Database schema and migrations (Drizzle)
- Auth configuration (Better Auth)
- Zod schemas for validation
- Durable Object helpers

### 4. Frontend Architecture
- Component organization: `ui/` for design system, feature-specific in subdirectories
- TanStack Router for routing with file-based routes in `src/routes/`
- Zustand for state management
- Tailwind CSS v4 with Vite plugin

## Type Generation

Both Worker applications use automatic type generation:
```bash
# Generate types before development
cd apps/user-application && pnpm cf-typegen
cd apps/data-service && pnpm cf-typegen
```

Generated files (`worker-configuration.d.ts`, `service-bindings.d.ts`) should NOT be edited manually.

## Testing

- Vitest configured for both Worker applications
- Worker-specific test setup with `@cloudflare/vitest-pool-workers`
- Run tests with `pnpm test` in respective app directories

## Deployment

Each application can be deployed independently:
```bash
cd apps/user-application && pnpm deploy
cd apps/data-service && pnpm deploy
```

Both use `wrangler deploy` under the hood with configurations in `wrangler.jsonc`.

## Important Files

- `pnpm-workspace.yaml`: Workspace configuration
- `apps/*/wrangler.jsonc`: Cloudflare Worker configurations
- `apps/user-application/vite.config.ts`: Frontend build configuration
- `packages/data-ops/drizzle.config.ts`: Database configuration