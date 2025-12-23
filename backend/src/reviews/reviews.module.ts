import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { ReviewsApprovalService } from './reviews-approval.service';
import { HostawayModule } from '../hostaway/hostaway.module';

@Module({
  imports: [HostawayModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsApprovalService],
  exports: [ReviewsService, ReviewsApprovalService],
})
export class ReviewsModule {}
