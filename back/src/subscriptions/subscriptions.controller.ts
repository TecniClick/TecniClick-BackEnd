import { Controller, Post, Param, ParseUUIDPipe, Get } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Subscripciones')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // OBTENER TODAS LOS SUBSCRIPCIONES EXISTENTES
  @Get()
  // @ApiBearerAuth()
  // @Roles(UserRole.ADMIN)
  // @UseGuards(AuthGuard, RolesGuard)
  getAllSubscriptionsController() {
    return this.subscriptionsService.getAllSubscriptionsService();
  }

  // OBTENER TODAS LOS SUBSCRIPCIONES PREMIUM EXISTENTES
  @Get('premium')
  // @ApiBearerAuth()
  // @Roles(UserRole.ADMIN)
  // @UseGuards(AuthGuard, RolesGuard)
  getAllPremiumSubscriptionsController() {
    return this.subscriptionsService.getAllPremiumSubscriptionsService();
  }

  // OBTENER TODAS LOS SUBSCRIPCIONES FREE EXISTENTES
  @Get('free')
  // @ApiBearerAuth()
  // @Roles(UserRole.ADMIN)
  // @UseGuards(AuthGuard, RolesGuard)
  getAllFreeSubscriptionsController() {
    return this.subscriptionsService.getAllFreeSubscriptionsService();
  }

  // OBTENER SUBSCRIPCIÓN POR ID
  @Get(':id')
  getSubscriptionByIdController(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionsService.getSubscriptionByIdService(id);
  }

  // CREAR SUBSCRIPCIÓN POR ID DE PERFIL DE SERVICIO
  @Post('create/:serviceProfileId')
  async createFreeSubscriptionController(
    @Param('serviceProfileId', ParseUUIDPipe) serviceProfileId: string,
  ) {
    return await this.subscriptionsService.createFreeSubscriptionService(
      serviceProfileId,
    );
  }
}
