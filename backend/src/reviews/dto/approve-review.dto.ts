import { IsBoolean } from 'class-validator';

export class ApproveReviewDto {
  @IsBoolean()
  approved: boolean;
}
