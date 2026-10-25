import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { GhostBusService } from './ghost-bus.service';
import { MapMatchingService } from './MapMatchingService';

@Module({
  providers: [MatchingService, GhostBusService, MapMatchingService],
  exports: [MatchingService, GhostBusService, MapMatchingService],
})
export class MatchingModule {}
