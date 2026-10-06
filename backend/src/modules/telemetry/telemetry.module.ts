import { Module } from '@nestjs/common';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';
import { RoutesModule } from '../routes/routes.module';
import { MatchingModule } from '../matching/matching.module';
import { GamificationModule } from '../gamification/gamification.module';
import { TrackingModule } from '../tracking/tracking.module';

@Module({
  imports: [
    RoutesModule,
    MatchingModule,
    GamificationModule,
    TrackingModule,
  ],
  controllers: [TelemetryController],
  providers: [TelemetryService],
  exports: [TelemetryService],
})
export class TelemetryModule {}
