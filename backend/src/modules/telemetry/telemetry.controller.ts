import { Controller, Post, Body } from '@nestjs/common';
import { TelemetryService, IngestTelemetryDto } from './telemetry.service';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Post('ingest')
  ingestCoordinates(@Body() dto: IngestTelemetryDto) {
    return this.telemetryService.processIncomingTelemetry(dto);
  }
}
