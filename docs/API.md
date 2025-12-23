# API Documentation

Base URL: `http://localhost:3001/api`

## Endpoints

### GET /reviews/hostaway
Returns normalized reviews and summary metrics.

### GET /reviews/property/:propertyId/public
Returns approved public reviews for a property.

### GET /reviews/approvals
Returns approval map `{ [reviewId]: boolean }`.

### PATCH /reviews/:id/approve
Body: `{ "approved": boolean }`

### PATCH /reviews/approvals/bulk
Body: `[{ reviewId: number, approved: boolean }]`

## Data Models
- NormalizedReview, ReviewsResponse, PublicReview, PublicReviewsResponse, ApprovalStatus (see shared/types/review.types.ts)

## Errors
Standard NestJS error shape with HTTP codes 400/404/500.
