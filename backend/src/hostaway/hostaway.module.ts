import { Module } from '@nestjs/common';
import { HostawayService } from './hostaway.service';

@Module({
  providers: [HostawayService],
  exports: [HostawayService],
})
export class HostawayModule {}
