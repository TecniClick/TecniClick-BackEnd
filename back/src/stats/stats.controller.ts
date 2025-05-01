import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/Auth/guards/auth.guard';

@ApiTags('Endpoints de Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
  @Get('summary')
  @ApiOperation({ summary: 'Obtiene estadísticas generales del sistema' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente.',
  })
  @ApiOperation({ summary: 'Obtiene estadísticas generales' })
  getSummary() {
    return this.statsService.getSummaryStats();
  }

  @Get('servicesdistribution')
  @ApiOperation({ summary: 'Distribución de servicios por categoría' })
  @ApiResponse({
    status: 200,
    description: 'Distribución de servicios obtenida exitosamente.',
  })
  @ApiOperation({ summary: 'Distribución de servicios por categoría' })
  getServiceDistribution() {
    return this.statsService.getServicesByCategory();
  }

  @Get('usersbyrole')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Obtener usuarios agrupados por rol (clientes y proveedores)',
  })
  @ApiResponse({
    status: 200,
    description: 'Distribución de usuarios por rol obtenida exitosamente.',
  })
  async getUsersByRole() {
    return this.statsService.getUsersByRole();
  }
}
