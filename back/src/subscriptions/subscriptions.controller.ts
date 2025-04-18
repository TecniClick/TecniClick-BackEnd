import { Controller, Post, Body } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateSubscriptionDto } from 'src/DTO/subscriptionsDtos/createSuscription.dto';
import { CreatePaymentDto } from 'src/DTO/subscriptionsDtos/createPayment.dto';

@ApiTags('Pagos')
@Controller('payments')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('create')
  @ApiBody({ type: CreateSubscriptionDto })
  async createSubscriptionController(
    @Body() subscriptionData: CreateSubscriptionDto,
  ) {
    const newSubscription =
      await this.subscriptionsService.createSubscriptionService(
        subscriptionData,
      );
    return newSubscription;
  }

  @Post('create-intent')
  @ApiBody({ type: CreatePaymentDto })
  async createPaymentIntentController(
    @Body() suscriptionData: CreatePaymentDto,
  ) {
    const paymentIntent =
      await this.subscriptionsService.createPaymentIntentService(
        suscriptionData,
      );
    return {
      clientSecret: paymentIntent.client_secret,
    };
  }
}
