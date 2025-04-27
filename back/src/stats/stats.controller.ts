import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Endpoints de Stats')
@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService){}

    @Get('summary')
    getSummary(){
        return this.statsService.getSummaryStats()
    }

    @Get('servicesdistribution')
    getServiceDistribution(){
        return this.statsService.getServicesByCategory()
    }
}

