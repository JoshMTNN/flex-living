import axios from 'axios';
import {
  ReviewsResponse,
  PublicReviewsResponse,
  ApprovalStatus,
  PropertyDetails,
} from '../../shared/types/review.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const reviewsApi = {
  getAllReviews: async (): Promise<ReviewsResponse> => {
    const response = await apiClient.get<ReviewsResponse>('/reviews/hostaway');
    return response.data;
  },

  getPublicReviewsForProperty: async (
    propertyId: string
  ): Promise<PublicReviewsResponse> => {
    const response = await apiClient.get<PublicReviewsResponse>(
      `/reviews/property/${encodeURIComponent(propertyId)}/public`
    );
    return response.data;
  },

  getPropertyDetails: async (propertyId: string): Promise<PropertyDetails | null> => {
    const response = await apiClient.get<PropertyDetails | null>(
      `/reviews/property/${encodeURIComponent(propertyId)}/details`
    );
    return response.data ?? null;
  },

  getAllApprovals: async (): Promise<Record<number, boolean>> => {
    const response = await apiClient.get<Record<number, boolean>>(
      '/reviews/approvals'
    );
    return response.data;
  },

  updateApprovalStatus: async (
    reviewId: number,
    approved: boolean
  ): Promise<void> => {
    await apiClient.patch(`/reviews/${reviewId}/approve`, { approved });
  },

  bulkUpdateApprovals: async (
    updates: ApprovalStatus[]
  ): Promise<void> => {
    await apiClient.patch('/reviews/approvals/bulk', updates);
  },
};
