import { Module } from '@nestjs/common';
import { TrackingGateway } from './tracking.gateway';
import { LocationGateway } from './location.gateway';

@Module({
  providers: [TrackingGateway, LocationGateway],
  exports: [TrackingGateway, LocationGateway],
})
export class TrackingModule {}
