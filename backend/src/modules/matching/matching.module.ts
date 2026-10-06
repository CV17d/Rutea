import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { GhostBusService } from './ghost-bus.service';

@Module({
  providers: [MatchingService, GhostBusService],
  exports: [MatchingService, GhostBusService],
})
export class MatchingModule {}
