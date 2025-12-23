# Flex Living Reviews Dashboard

A comprehensive reviews management system for Flex Living properties, featuring a manager dashboard and public-facing review display.

## Tech Stack

### Frontend

- Next.js 15+
- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI
- TanStack Query
- Recharts
- date-fns

### Backend

- NestJS
- TypeScript
- Axios
- class-validator

### Shared

- TypeScript types

## Project Structure

```
flex-living/
├── frontend/          # Next.js frontend application
├── backend/           # NestJS backend API
├── shared/            # Shared TypeScript types
└── docs/              # Documentation
```

## Setup

1. Use Node 22.12.0 via nvm: `nvm use 22.12.0`
2. Install deps: `pnpm install`
3. Add envs (shared root + app overrides):
   - Root (loaded by both frontend and backend):

```
# .env.local at repo root (or .env)
NEXT_PUBLIC_API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
PORT=3001
HOSTAWAY_ACCOUNT_ID=****   # set real value locally
HOSTAWAY_API_KEY=****      # set real value locally
```

- Backend override (`backend/.env` or `backend/.env.local`):

```
HOSTAWAY_ACCOUNT_ID=****   # set real value locally
HOSTAWAY_API_KEY=****      # set real value locally
FRONTEND_URL=http://localhost:3000
PORT=3001
```

- Frontend override (`frontend/.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

- (Optional) scaffold:

```
cp frontend/.env.example frontend/.env.local
```

4. Start backend: `pnpm run dev:backend`
5. Start frontend: `pnpm run dev:frontend`

Frontend: http://localhost:3000
Backend API: http://localhost:3001
Dashboard: http://localhost:3000/dashboard

## Features

- Property performance overview
- Review filtering/sorting
- Approval workflow for public display
- Trends and category charts
- Public property reviews page (approved only)

See docs/API.md, docs/DESIGN_DECISIONS.md, docs/GOOGLE_REVIEWS.md for details.
