import { Module } from '@nestjs/common';
import { TrackingGateway } from './tracking.gateway';
import { LocationGateway } from './location.gateway';
import { MatchingModule } from '../matching/matching.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [MatchingModule, SupabaseModule, GamificationModule],
  providers: [TrackingGateway, LocationGateway],
  exports: [TrackingGateway, LocationGateway],
})
export class TrackingModule {}
