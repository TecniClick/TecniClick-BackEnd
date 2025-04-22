import { Controller, Post, Param, ParseUUIDPipe } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Subscripciones')
@Controller('subscriptions')
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
