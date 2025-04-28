import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Endpoints de Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
    @Get('summary')
    @ApiOperation({ summary: 'Obtiene estadísticas generales' })
    getSummary(){
        return this.statsService.getSummaryStats()
    }

    @Get('servicesdistribution')
    @ApiOperation({ summary: 'Distribución de servicios por categoría' })
    getServiceDistribution(){
        return this.statsService.getServicesByCategory()
    }

}
