# Design Decisions

## Architecture
- Monorepo with pnpm workspaces for shared types
- NestJS backend, Next.js frontend, shared TypeScript types

## Data Normalization
- Normalize Hostaway reviews into consistent shape
- Compute aggregates by property and by category

## Approval Storage
- JSON file `backend/src/data/approvals.json` for MVP persistence
- Easy to migrate to DB later

## Frontend State
- TanStack Query for server state
- Local state for filters/sorting

## Styling
- Tailwind + Shadcn UI
- Flex Living colors: cream #F5F5F0, greens #2D5016 / #4A7C2A

## Filtering/Sorting
- Client-side for MVP (small data set)
- Filters: property, rating, category, status
- Sorting: date/rating/property asc/desc

## Charts
- Recharts for rating trends and category performance

## Error Handling
- Graceful loading/error/empty states

## Future
- DB storage for approvals
- Pagination and server-side filtering for large data
- Google My Business integration if verification available
