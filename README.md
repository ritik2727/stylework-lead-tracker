# Stylework Lead Tracker & CRM Dashboard

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)](https://vitest.dev/)

A modern, production-ready **Lead Tracker & Sales Pipeline CRM Dashboard** built for Stylework's Junior Full Stack Engineer Assignment. Designed for tracking, qualifying, and closing leads with high performance, intuitive UX, and clean architecture.

---

## 🌟 Live Demo & Preview

- **Live Frontend**: [stylework-lead-tracker.vercel.app](https://stylework-lead-tracker.vercel.app) *(Deploy instructions below)*
- **Live Backend API**: [stylework-lead-tracker-api.onrender.com](https://stylework-lead-tracker-api.onrender.com)
- **API Health Check**: `GET /health`

---

## 🚀 Key Features

| Requirement | Implementation | Status |
| :--- | :--- | :---: |
| **Create Lead** | Full modal with validation (Name, Email, Phone, Status, Company, Notes) | ✅ Complete |
| **Update Lead Status** | 1-click status dropdown in table rows & Kanban column advance | ✅ Complete |
| **Search Leads** | Debounced real-time search across Name, Email, and Phone | ✅ Complete |
| **List Leads** | Interactive Data Table with pagination, sorting & custom badges | ✅ Complete |
| **Required Fields** | `Name`, `Email`, `Phone`, `Status`, `CreatedAt` (+ `Company`, `Notes`, `UpdatedAt`) | ✅ Complete |
| **Pipeline Kanban** | Visual drag-and-stage Kanban board across 6 pipeline stages | ✅ Extra Polish |
| **KPI Metrics Cards** | Total Leads, Active Pipeline, Closed Won, and Live Conversion Rate | ✅ Extra Polish |
| **CSV Export** | Instant client-side export of current lead table to `.csv` | ✅ Extra Polish |
| **Dark & Light Modes** | Theme toggle persisted in `localStorage` with glassmorphism styles | ✅ Extra Polish |
| **API Health Indicator** | Live polling status pill in navigation bar | ✅ Extra Polish |

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([User Browser]) -->|HTTP / REST| Client[React 19 + TypeScript SPA]
    Client -->|API Proxy :5173/api| Server[Node.js + Express API :5000]
    Server -->|Validation| Zod[Zod Schemas]
    Server -->|Controllers & Services| Service[Lead Service Layer]
    Service -->|Type-safe ORM| Prisma[Prisma Client v6]
    Prisma -->|SQL Queries| DB[(PostgreSQL Database)]
```

### Directory Structure

```
Stylework/
├── client/                     # Frontend React + TypeScript application
│   ├── public/                 # Static assets and icons
│   ├── src/
│   │   ├── components/         # Modular UI components (Table, Kanban, Modal, Cards, etc.)
│   │   ├── services/           # Typed API client with fetch & error handling
│   │   ├── test/               # Vitest + React Testing Library component tests
│   │   ├── types/              # Domain TypeScript interfaces and status configs
│   │   ├── App.tsx             # Main dashboard view & state orchestration
│   │   ├── index.css           # Custom CSS token design system & theme variables
│   │   └── main.tsx            # Vite root entry
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                     # Backend Node.js + Express + TypeScript API
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma data model & PostgreSQL enum definitions
│   │   └── seed.ts             # Realistic database seeder script
│   ├── src/
│   │   ├── config/             # Environment variable configuration
│   │   ├── controllers/        # Request handling and HTTP responses
│   │   ├── middlewares/        # Zod validation & centralized error handler
│   │   ├── routes/             # REST route declarations
│   │   ├── services/           # Core business logic & database queries
│   │   ├── tests/              # Vitest + Supertest API integration tests
│   │   ├── types/              # Backend DTOs and interfaces
│   │   ├── validators/         # Zod schemas for request validation
│   │   ├── app.ts              # Express application factory
│   │   ├── index.ts            # Server entry point
│   │   └── prisma.ts           # PrismaClient singleton instance
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml          # One-command PostgreSQL 16 container setup
├── package.json                # Monorepo convenience scripts (install, test, dev, build)
├── README.md                   # Full documentation
└── AGENT.md                    # AI tools and engineering log
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Bundler & Tooling**: Vite 8 with HMR
- **Styling**: Bespoke Vanilla CSS Design System (CSS tokens, CSS variables, glassmorphism, responsive grid)
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library + JSDOM

### Backend
- **Runtime**: Node.js (v20+ / v22+)
- **Framework**: Express 4 / 5
- **Language**: TypeScript (strict type-checking)
- **Database & ORM**: PostgreSQL with Prisma ORM
- **Validation**: Zod (runtime request schema validation)
- **Security & Logging**: Helmet, CORS, Morgan
- **Testing**: Vitest + Supertest

---

## ⚡ Setup & Installation

### Prerequisites
- Node.js (v20.x or v22.x)
- npm (v10+)
- PostgreSQL (Local server, Docker, or free cloud provider like [Neon](https://neon.tech) / [Supabase](https://supabase.com))

---

### Step 1: Clone and Install Dependencies

```bash
git clone https://github.com/ritik2727/Stylework.git
cd Stylework

# Install all dependencies (both root, server, and client)
npm run install:all
```

---

### Step 2: Configure Environment Variables

Create `.env` inside the `server/` folder:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Local PostgreSQL:
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/leadtracker?schema=public"

# OR Free Neon Serverless PostgreSQL:
# DATABASE_URL="postgresql://neondb_owner:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

---

### Step 3: Run Database (Docker Option or Cloud DB)

#### Option A: Using Docker Compose (Quickest for Local)
```bash
docker compose up -d
```

#### Option B: Using Free Cloud PostgreSQL (No Docker needed)
Sign up for a free instant database at [Neon.tech](https://neon.tech), copy your connection string into `server/.env`.

---

### Step 4: Synchronize Database Schema & Seed Data

```bash
# Push Prisma schema to PostgreSQL
npm run db:push

# Seed database with 12 realistic sample leads
npm run db:seed
```

---

### Step 5: Start Development Servers

Run both servers concurrently or in separate terminals:

```bash
# Terminal 1 - Backend (port 5000)
npm run dev:server

# Terminal 2 - Frontend (port 5173)
npm run dev:client
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing

The repository features comprehensive automated test coverage for both backend API endpoints and frontend React components.

```bash
# Run all tests across backend and frontend
npm test

# Run backend tests only (Vitest + Supertest)
npm run test:server

# Run frontend tests only (Vitest + React Testing Library)
npm run test:client
```

### Test Coverage Highlights:
- **Backend Tests (`server/src/tests/lead.test.ts`)**:
  - `GET /health`: Healthcheck confirmation
  - `POST /api/leads`: Successful creation, short name rejection, invalid email rejection
  - `GET /api/leads`: Pagination default limits, search querying across multiple fields, status filtering
  - `PATCH /api/leads/:id/status`: Status update validation, 404 handler for missing leads, invalid status enum rejection
  - `GET /api/leads/stats`: Summary counts, status grouping, and conversion rate calculation
- **Frontend Tests (`client/src/test/components.test.tsx`)**:
  - `StatusBadge`: Render labels and interactive caret
  - `StatsCards`: Accurate rendering of counts, badges, and progress bar
  - `LeadFilterBar`: Debounced search trigger and status filter selection
  - `LeadTable`: Row rendering with contact information and empty state fallback

---

## 🌐 Deployment Steps

### 1. Database (Neon Serverless PostgreSQL)
1. Go to [Neon.tech](https://neon.tech) and create a free project.
2. Copy the PostgreSQL connection string.

### 2. Backend (Render / Railway)
1. Create a **Web Service** on [Render](https://render.com) pointing to this repository.
2. Root Directory: `server`
3. Build Command: `npm install && npm run build && npx prisma db push && npm run prisma:seed`
4. Start Command: `npm start`
5. Environment Variables:
   - `DATABASE_URL`: *your Neon PostgreSQL connection string*
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: *your frontend URL*

### 3. Frontend (Vercel)
1. Import repository on [Vercel](https://vercel.com).
2. Framework Preset: **Vite**
3. Root Directory: `client`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variable:
   - `VITE_API_URL`: `https://stylework-lead-tracker-api.onrender.com/api`

---

## ⚖️ Trade-offs & Engineering Decisions

1. **PostgreSQL + Prisma ORM vs MongoDB + Mongoose**:
   - *Decision*: Chose PostgreSQL with Prisma ORM.
   - *Rationale*: Lead tracking and CRM systems inherently benefit from strict schema constraints, ACID transactions, and deterministic enum states (`NEW`, `CONTACTED`, `QUALIFIED`, `PROPOSAL_SENT`, `WON`, `LOST`). Prisma provides compile-time type safety across database queries and auto-generated migrations.
2. **Vanilla CSS Design Tokens vs TailwindCSS**:
   - *Decision*: Implemented a custom CSS token design system with CSS custom properties.
   - *Rationale*: Ensures zero third-party utility bloat, seamless dark/light theme switching with CSS variables, high-fidelity glassmorphism, and precise micro-animations tailored to Stylework's brand feel.
3. **Optimistic Status Updates**:
   - *Decision*: In the frontend, status updates immediately update the UI state and then dispatch the API request in the background.
   - *Rationale*: Drastically improves perceived performance; if the network call fails, the state rolls back and a toast notification informs the user.
4. **Dual View (Table + Pipeline Kanban)**:
   - *Decision*: Supported both traditional tabular pagination and a stage-based Kanban pipeline board.
   - *Rationale*: Sales representatives frequently want a quick drag-and-move pipeline overview to visualize conversion bottlenecks, while operations teams need tabular search, sort, and CSV export.

---

## 🔮 Future Improvements

1. **Authentication & Role-Based Access (RBAC)**:
   - Integrate NextAuth / JWT / Clerk to allow Admin, Sales Rep, and Manager roles with granular lead ownership.
2. **Activity Timeline & Audit Trail**:
   - Log history of status changes, notes, and calls linked to each lead in a dedicated `LeadActivity` relational table.
3. **AI Lead Scoring**:
   - Leverage Gemini / OpenAI APIs to analyze lead requirements and automatically score conversion probabilities (e.g., High, Medium, Low intent).
4. **Real-time WebSockets**:
   - Implement Socket.io to synchronize lead status updates across multiple concurrent sales reps in real time.
5. **Email / SMS Integrations**:
   - Webhook integrations with Twilio and SendGrid for automated follow-up sequences.

---

## 📄 License
MIT © 2026 Stylework Assignment
