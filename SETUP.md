# Quick Setup Guide

## Prerequisites

- Node.js 22.12.0 (nvm)
- pnpm >= 8

## Install

```bash
pnpm install
```

## Env

- Root env (shared, loaded by frontend and backend):

```
# .env.local at repo root (or .env)
NEXT_PUBLIC_API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
PORT=3001
HOSTAWAY_ACCOUNT_ID=****   # set real value locally
HOSTAWAY_API_KEY=****      # set real value locally
```

- Backend override (optional, takes precedence over root):

```
# backend/.env (or backend/.env.local)
HOSTAWAY_ACCOUNT_ID=****   # set real value locally
HOSTAWAY_API_KEY=****      # set real value locally
FRONTEND_URL=http://localhost:3000
PORT=3001
```

- Frontend override (optional, takes precedence over root):

```
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

- (Optional) scaffold:

```bash
cp frontend/.env.example frontend/.env.local
```

## Run

```bash
pnpm run dev:backend
pnpm run dev:frontend
```

Frontend: http://localhost:3000
Backend: http://localhost:3001

## Troubleshooting

- If ports busy, change PORT in backend/.env and Next dev port.
- If module errors, reinstall: `rm -rf node_modules && pnpm install`.
- Approvals stored in `backend/src/data/approvals.json`.
