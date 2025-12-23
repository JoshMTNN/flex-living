import { Module } from '@nestjs/common';
import { ReviewsModule } from './reviews/reviews.module';
import { HostawayModule } from './hostaway/hostaway.module';
import { GoogleReviewsModule } from './google-reviews/google-reviews.module';

@Module({
  imports: [ReviewsModule, HostawayModule, GoogleReviewsModule],
})
export class AppModule {}
