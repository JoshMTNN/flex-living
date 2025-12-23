import { Injectable } from '@nestjs/common';
import { HostawayService } from '../hostaway/hostaway.service';
import { ReviewsApprovalService } from './reviews-approval.service';
import {
  NormalizedReview,
  ReviewsResponse,
  ReviewsSummary,
  PropertySummary,
  CategoryBreakdown,
  PublicReview,
  PublicReviewsResponse,
  PropertyDetails,
} from '../types/review.types';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly hostawayService: HostawayService,
    private readonly approvalService: ReviewsApprovalService,
  ) {}

  async getAllReviews(): Promise<ReviewsResponse> {
    const hostawayData = await this.hostawayService.fetchReviews();
    const approvals = this.approvalService.getAllApprovals();

    const normalizedReviews: NormalizedReview[] = hostawayData.result.map((review) => ({
      ...review,
      submittedAt: new Date(review.submittedAt),
      channel: 'hostaway' as const,
      approvedForPublic: approvals[review.id] || false,
    }));

    const summary = this.calculateSummary(normalizedReviews);

    return {
      reviews: normalizedReviews,
      summary,
    };
  }

  async getPublicReviewsForProperty(propertyId: string): Promise<PublicReviewsResponse> {
    const allReviews = await this.getAllReviews();

    const propertyReviews = allReviews.reviews.filter(
      (review) =>
        review.listingName === propertyId &&
        review.approvedForPublic === true &&
        review.status === 'published',
    );

    const publicReviews: PublicReview[] = propertyReviews.map((review) => ({
      id: review.id,
      guestName: review.guestName,
      rating: review.rating,
      publicReview: review.publicReview,
      reviewCategory: review.reviewCategory,
      submittedAt: review.submittedAt,
    }));

    const averageRating = this.calculateAverageRating(publicReviews);
    const totalCount = publicReviews.length;

    return {
      reviews: publicReviews,
      averageRating,
      totalCount,
    };
  }

  async getPropertyDetails(propertyId: string): Promise<PropertyDetails | null> {
    try {
      const mockPath = path.join(__dirname, '../mock/properties.mock.json');
      const raw = fs.readFileSync(mockPath, 'utf-8');
      const all = JSON.parse(raw);
      return all[propertyId] ?? null;
    } catch (error) {
      console.error('Error loading property details mock:', error);
      return null;
    }
  }

  private calculateSummary(reviews: NormalizedReview[]): ReviewsSummary {
    const totalReviews = reviews.length;
    const averageRating = this.calculateAverageRating(reviews);
    const publishedCount = reviews.filter((r) => r.status === 'published').length;
    const pendingCount = reviews.filter((r) => r.status === 'pending').length;
    const draftCount = reviews.filter((r) => r.status === 'draft').length;

    const propertyMap = new Map<string, NormalizedReview[]>();
    reviews.forEach((review) => {
      const propertyName = review.listingName;
      if (!propertyMap.has(propertyName)) {
        propertyMap.set(propertyName, []);
      }
      propertyMap.get(propertyName)!.push(review);
    });

    const byProperty: PropertySummary[] = Array.from(propertyMap.entries()).map(
      ([propertyName, propertyReviews]) => {
        const avgRating = this.calculateAverageRating(propertyReviews);
        return {
          propertyName,
          averageRating: avgRating,
          totalReviews: propertyReviews.length,
          reviewCount: propertyReviews.length,
        };
      },
    );

    const categoryMap = new Map<string, { ratings: number[]; count: number }>();
    reviews.forEach((review) => {
      review.reviewCategory.forEach((cat) => {
        if (cat.rating !== null) {
          if (!categoryMap.has(cat.category)) {
            categoryMap.set(cat.category, { ratings: [], count: 0 });
          }
          categoryMap.get(cat.category)!.ratings.push(cat.rating);
          categoryMap.get(cat.category)!.count++;
        }
      });
    });

    const byCategory: CategoryBreakdown[] = Array.from(categoryMap.entries()).map(
      ([category, data]) => {
        const avgRating =
          data.ratings.length > 0
            ? data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length
            : 0;
        return {
          category,
          averageRating: Math.round(avgRating * 10) / 10,
          reviewCount: data.count,
        };
      },
    );

    return {
      totalReviews,
      averageRating,
      publishedCount,
      pendingCount,
      draftCount,
      byProperty,
      byCategory,
    };
  }

  private calculateAverageRating(reviews: NormalizedReview[] | PublicReview[]): number {
    const ratings = reviews
      .map((r) => r.rating)
      .filter((r): r is number => r !== null && r !== undefined);

    if (ratings.length === 0) return 0;

    const sum = ratings.reduce((acc, r) => acc + r, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  }
}
