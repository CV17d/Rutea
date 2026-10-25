import { Module } from '@nestjs/common';
import { TrackingGateway } from './tracking.gateway';
import { LocationGateway } from './location.gateway';
import { MatchingModule } from '../matching/matching.module';

@Module({
  imports: [MatchingModule],
  providers: [TrackingGateway, LocationGateway],
  exports: [TrackingGateway, LocationGateway],
})
export class TrackingModule {}
