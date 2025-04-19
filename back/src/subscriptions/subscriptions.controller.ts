import { Controller, Post, Param, ParseUUIDPipe } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Pagos')
@Controller('payments')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('create/:serviceProfileId')
  async createSubscriptionController(
    @Param('serviceProfileId', ParseUUIDPipe) serviceProfileId: string,
  ) {
    return await this.subscriptionsService.createSubscriptionService(
      serviceProfileId,
    );
  }
}
