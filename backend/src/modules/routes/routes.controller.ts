import { Controller, Get, Param } from '@nestjs/common';
import { RoutesService } from './routes.service';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  getAllRoutes() {
    return this.routesService.findAll();
  }

  @Get(':id')
  getRouteById(@Param('id') id: string) {
    return this.routesService.findById(id);
  }

  @Get(':id/stops')
  getStops(@Param('id') id: string) {
    return this.routesService.getStops(id);
  }
}
