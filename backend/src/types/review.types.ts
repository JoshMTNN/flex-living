export interface ReviewCategory {
  category: string;
  rating: number | null;
}

export interface HostawayReview {
  id: number;
  type: 'guest-to-host' | 'host-to-guest';
  status: 'published' | 'draft' | 'pending';
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

export interface HostawayApiResponse {
  status: string;
  result: HostawayReview[];
}

export interface NormalizedReview {
  id: number;
  type: 'guest-to-host' | 'host-to-guest';
  status: 'published' | 'draft' | 'pending';
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: Date;
  guestName: string;
  listingName: string;
  channel: 'hostaway';
  approvedForPublic?: boolean;
}

export interface PropertySummary {
  propertyName: string;
  averageRating: number;
  totalReviews: number;
  reviewCount: number;
}

export interface CategoryBreakdown {
  category: string;
  averageRating: number;
  reviewCount: number;
}

export interface ReviewsSummary {
  totalReviews: number;
  averageRating: number;
  publishedCount?: number;
  pendingCount?: number;
  draftCount?: number;
  byProperty: PropertySummary[];
  byCategory: CategoryBreakdown[];
}

export interface ReviewsResponse {
  reviews: NormalizedReview[];
  summary: ReviewsSummary;
}

export interface PublicReview {
  id: number;
  guestName: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: Date;
}

export interface PublicReviewsResponse {
  reviews: PublicReview[];
  averageRating: number;
  totalCount: number;
}

export interface PropertyDetails {
  title: string;
  address: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  images: string[];
  amenities: string[];
  location: { lat: number; lng: number };
  description: string;
}

export interface ApprovalStatus {
  reviewId: number;
  approved: boolean;
}

