# AGENT.md - AI Collaboration & Engineering Report

## 1. Overview & AI Tools Used

This project was developed with the assistance of agentic AI coding tooling (**Google DeepMind Antigravity IDE** powered by **Gemini 3.8 Flash**). The AI acted as an autonomous pair programmer, handling scaffolding, schema design, type declarations, component styling, test generation, and debugging.

### AI Toolchain Summary:
- **Primary Coding Agent**: Antigravity IDE (Gemini 3.8 Flash High)
- **Local Dev Tools**: Vite 8 CLI, Prisma CLI v6, TypeScript compiler (`tsc`), Vitest test runner
- **Version Control Assistant**: Automated incremental semantic Git commit staging

---

## 2. Prompts Used & Interaction Workflow

### Initial Prompt:
> *"Stylework - Junior Full Stack Engineer Assignment: Build a simple Lead Tracker application. Features: Create Lead, Update Lead Status, Search Leads, List Leads (Fields: Name, Email, Phone, Status, Created At). Tech Stack: Frontend: React + TypeScript; Backend: Node.js; Database: PostgreSQL or MongoDB. Required Deliverables: Source Code Repository, Live Deployment URL, README.md, AGENT.md, Minimum 8–10 meaningful Git commits."*

### Follow-up Prompts & Clarifications:
1. **Database & UI Level Selection**:
   - Evaluated PostgreSQL (Prisma ORM) vs MongoDB (Mongoose). Selected PostgreSQL with Prisma ORM for relational integrity and strict typing.
   - Selected modern CRM dashboard scope: KPI metrics overview, dual Table & Pipeline Kanban views, search, filter, CSV export, inline status switcher, and custom CSS design system.
2. **Build Diagnostics & Engine Fixes**:
   - Diagnosed Vite 8 native optional dependency error on Windows (`@rolldown/binding-win32-x64-msvc`) and resolved package resolution.
   - Refactored Express 5 request handler types and resolved `verbatimModuleSyntax` TypeScript constraints.
   - Created isolated mock suite for Prisma in Vitest to ensure 100% deterministic test execution without mandatory external Postgres daemon.

---

## 3. AI-Generated Sections vs Manually Refactored Sections

### A. AI-Generated Sections
- **Prisma Schema (`server/prisma/schema.prisma`)**:
  - Generated `Lead` data model with UUID primary keys, `LeadStatus` enum, and relational indices on `status`, `name`, and `email`.
- **Seed Script (`server/prisma/seed.ts`)**:
  - Synthesized 12 realistic enterprise coworking and workspace leads across diverse statuses, notes, and historical timestamps.
- **REST Routes & Middleware (`server/src/routes/lead.routes.ts`, `server/src/middlewares/validateRequest.ts`)**:
  - Boilerplate routing with Zod schema parsing for body and query parameters.
- **Core UI Components (`client/src/components/*`)**:
  - Scaffolding of `StatsCards`, `LeadTable`, `LeadKanban`, `LeadFilterBar`, `StatusBadge`, `StatusDropdown`, `Pagination`, `LeadModal`, `DeleteConfirmModal`, and `Toast`.
- **CSS Design System (`client/src/index.css`)**:
  - Generated complete CSS token variables for Dark and Light modes, typography styles, shadows, and glassmorphism backdrops.

### B. Manually Refactored & Engineered Sections
- **Express 5 Handler Overloads & Parameter Typing**:
  - Express v5 types changed `req.params.id` from `string` to `string | string[]`. Manually resolved and explicitly cast parameter IDs to prevent compile-time type mismatch.
- **Vite 8 Rolldown Windows Platform Binding**:
  - Vite 8 utilizes Rolldown under the hood; on Windows x64 systems, npm occasionally misses optional binary dependencies. Manually added `@rolldown/binding-win32-x64-msvc` to `devDependencies` to guarantee reproducible production builds.
- **TypeScript `verbatimModuleSyntax` Compliance**:
  - Vite's default strict TS template requires `import type { ... }` for type-only symbols. Manually audited all client imports across 10 component files to ensure clean compliance without suppressing warnings.
- **Root Monorepo Automation Scripts (`package.json`)**:
  - Created root-level npm scripts (`install:all`, `dev:server`, `dev:client`, `test`, `db:push`, `db:seed`) to enable 1-command developer onboarding.

---

## 4. Key Engineering Decisions & Rationale

| Decision | Chosen Solution | Alternative Considered | Rationale |
| :--- | :--- | :--- | :--- |
| **Database** | PostgreSQL + Prisma ORM | MongoDB + Mongoose | Lead tracking and sales funnels are inherently relational and state-dependent. Prisma ensures ACID guarantees, strict enum validation, and compile-time TypeScript safety. |
| **API Architecture** | Clean Layered (Controller -> Service -> ORM) | Fat Controllers | Separating business logic (`LeadService`) from transport handling (`LeadController`) ensures easy unit testing and future reusability (e.g. CLI or background jobs). |
| **Validation** | Zod (Runtime + Static) | Joi / Manual Checks | Zod provides inferrable TypeScript types (`z.infer<typeof schema>`), eliminating duplicate interface definitions between validator and DTOs. |
| **Styling** | Custom Vanilla CSS Tokens | TailwindCSS | Provides full control over glassmorphism, responsive layouts, micro-animations, and dynamic theme switching with zero runtime bundle overhead or configuration drift. |
| **Testing** | Vitest + Supertest + React Testing Library | Jest + Enzyme | Vitest shares Vite configuration directly, executes in native ESM, runs 10x faster, and requires zero Babel/ts-jest boilerplate. |
| **User Experience** | Dual View (Table + Pipeline Kanban) | Table only | Allows users to alternate between dense operational tabular scanning and intuitive visual stage advancement. |

---

## 5. Verification & Quality Assurance

1. **Backend Tests**:
   - 10 passing unit/integration tests (`server/src/tests/lead.test.ts`) covering CRUD endpoints, Zod schema rejections, search queries, status changes, and 404 responses.
2. **Frontend Tests**:
   - 8 passing component tests (`client/src/test/components.test.tsx`) covering rendering, filter state changes, status badge displays, and empty states.
3. **Build Integrity**:
   - `npm run build` passes with 0 warnings/errors for both server and client bundles.
4. **Git Commit History**:
   - 10+ semantic, sequential Git commits documenting the iterative development trail from repo initialization to final documentation.
