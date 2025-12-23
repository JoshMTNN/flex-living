import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsApprovalService } from './reviews-approval.service';
import { ApproveReviewDto } from './dto/approve-review.dto';
import { ApprovalStatus } from '../types/review.types';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly approvalService: ReviewsApprovalService,
  ) {}

  @Get('hostaway')
  async getHostawayReviews() {
    return this.reviewsService.getAllReviews();
  }

  @Get('property/:propertyId/public')
  async getPublicReviewsForProperty(@Param('propertyId') propertyId: string) {
    return this.reviewsService.getPublicReviewsForProperty(propertyId);
  }

  @Get('property/:propertyId/details')
  async getPropertyDetails(@Param('propertyId') propertyId: string) {
    return this.reviewsService.getPropertyDetails(propertyId);
  }

  @Get('approvals')
  getAllApprovals() {
    return this.approvalService.getAllApprovals();
  }

  @Patch(':id/approve')
  updateApprovalStatus(
    @Param('id') id: string,
    @Body() approveDto: ApproveReviewDto,
  ) {
    const reviewId = parseInt(id, 10);
    this.approvalService.updateApprovalStatus(reviewId, approveDto.approved);
    return { success: true, reviewId, approved: approveDto.approved };
  }

  @Patch('approvals/bulk')
  bulkUpdateApprovals(@Body() updates: ApprovalStatus[]) {
    this.approvalService.bulkUpdateApprovals(updates);
    return { success: true, updated: updates.length };
  }
}
