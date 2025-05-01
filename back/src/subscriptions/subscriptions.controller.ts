import { Controller, Post, Param, ParseUUIDPipe, Get } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Subscripciones')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // OBTENER TODAS LOS SUBSCRIPCIONES EXISTENTES
  @Get()
  @ApiOperation({ summary: 'Obtener todas las subscripciones' })
  @ApiResponse({
    status: 200,
    description: 'Subscripciones obtenidas exitosamente.',
  })
  // @ApiBearerAuth()
  // @Roles(UserRole.ADMIN)
  // @UseGuards(AuthGuard, RolesGuard)
  getAllSubscriptionsController() {
    return this.subscriptionsService.getAllSubscriptionsService();
  }

  // OBTENER TODAS LOS SUBSCRIPCIONES PREMIUM EXISTENTES
  @Get('premium')
  @ApiOperation({ summary: 'Obtener todas las subscripciones premium' })
  @ApiResponse({
    status: 200,
    description: 'Subscripciones premium obtenidas exitosamente.',
  })
  // @ApiBearerAuth()
  // @Roles(UserRole.ADMIN)
  // @UseGuards(AuthGuard, RolesGuard)
  getAllPremiumSubscriptionsController() {
    return this.subscriptionsService.getAllPremiumSubscriptionsService();
  }

  // OBTENER TODAS LOS SUBSCRIPCIONES FREE EXISTENTES
  @Get('free')
  @ApiOperation({ summary: 'Obtener todas las subscripciones gratuitas' })
  @ApiResponse({
    status: 200,
    description: 'Subscripciones gratuitas obtenidas exitosamente.',
  })
  // @ApiBearerAuth()
  // @Roles(UserRole.ADMIN)
  // @UseGuards(AuthGuard, RolesGuard)
  getAllFreeSubscriptionsController() {
    return this.subscriptionsService.getAllFreeSubscriptionsService();
  }

  // OBTENER SUBSCRIPCIÓN POR ID
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una subscripción por ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'ID de la subscripción',
  })
  @ApiResponse({ status: 200, description: 'Subscripción encontrada.' })
  @ApiResponse({ status: 404, description: 'Subscripción no encontrada.' })
  getSubscriptionByIdController(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionsService.getSubscriptionByIdService(id);
  }

  // CREAR SUBSCRIPCIÓN POR ID DE PERFIL DE SERVICIO
  @Post('create/:serviceProfileId')
  @ApiOperation({
    summary: 'Crear una subscripción gratuita a partir del perfil de servicio',
  })
  @ApiParam({
    name: 'serviceProfileId',
    type: 'string',
    format: 'uuid',
    description: 'ID del perfil de servicio',
  })
  @ApiResponse({
    status: 201,
    description: 'Subscripción creada exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil de servicio no encontrado.',
  })
  @ApiResponse({ status: 500, description: 'Error al crear la subscripción.' })
  async createFreeSubscriptionController(
    @Param('serviceProfileId', ParseUUIDPipe) serviceProfileId: string,
  ) {
    return await this.subscriptionsService.createFreeSubscriptionService(
      serviceProfileId,
    );
  }
}
