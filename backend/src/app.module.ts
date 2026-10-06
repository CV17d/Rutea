import { Module } from '@nestjs/common';
import { RoutesModule } from './modules/routes/routes.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { TelemetryModule } from './modules/telemetry/telemetry.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    RoutesModule,
    TrackingModule,
    TelemetryModule,
    GamificationModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
