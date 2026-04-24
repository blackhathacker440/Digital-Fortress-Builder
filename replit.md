# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### `portfolio` — Digital Command Center (React + Vite, web, mounted at `/`)

A high-end "Digital Command Center" portfolio for a Full-Stack Developer & Cybersecurity
Enthusiast. Dark cyberpunk aesthetic with neon RGB accents (cyan, violet, magenta).

**Sections** (all rendered from `src/pages/Home.tsx`):
- `Hero` — "Architecting Code. Securing the Future." headline with gradient text, status
  badge, neon-bordered CTAs, stats row, and a 3D shield (icosahedron + orbital rings) on the
  right rendered with react-three-fiber.
- `Arsenal` — Technical DNA: 4 categories (frontend, backend, security, tools) with
  animated skill bars.
- `Services` — 4 service cards (Cross-Platform Apps, Full-Stack, Cyber Defense, Next-Gen
  UI/UX) with hover gradients.
- `Bio` — Operator copy + a live typewriter terminal (`Terminal.tsx`) that cycles through
  whoami / nmap / deploy / fortify scripts.
- `Activity` — Year-long contribution heatmap (52 × 7 grid) with deterministic seeded data
  and aggregate stats.
- `DriveMode` — A fully playable 3D car driving game on a Tron-style neon grid
  (`three/CarGame.tsx`). WASD/arrow keys + spacebar brake; mobile gets on-screen touch
  buttons. HUD speedometer, reset button, custom GLSL shader for the pulsing grid floor.
- `Contact` — Encrypted-channel form (toast on submit) + social cards.

**3D stack**: `three` 0.160 + `@react-three/fiber` 9 + `@react-three/drei` 10 (React 19
compatible). All Canvas mounts go through `WebGLGate` (`components/three/CanvasFallback.tsx`)
which feature-detects WebGL and renders an error-boundary'd fallback when unavailable.

**Theme**: full dark cyberpunk palette in `src/index.css` with custom utilities:
`.neon-border` (animated conic-gradient RGB ring), `.neon-glow`, `.text-gradient-neon`,
`.bg-grid` + `.bg-grid-fade`, `.scanlines`, `.glass`, `.terminal-cursor`. Fonts: Space
Grotesk (sans) + JetBrains Mono (mono), loaded from Google Fonts in `index.html`.

`framer-motion` powers entrance animations and the active-link pill in `Nav.tsx`.
