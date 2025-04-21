import { Injectable, BadRequestException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreatePaymentDto } from 'src/DTO/ordersDtos/createPayment.dto';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly configService: ConfigService,
  ) {}

  async createPaymentIntentService(suscriptionData: CreatePaymentDto) {
    return await this.ordersRepository.createPaymentIntentRepository(
      suscriptionData,
    );
  }

  async handleStripeWebhookService(payload: Buffer, signature: string) {
    const endpointSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    let event: Stripe.Event;

    try {
      event = this.ordersRepository.constructStripeEvent(
        payload,
        signature,
        endpointSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Procesar el evento
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.ordersRepository.handlePaymentSucceeded(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        await this.ordersRepository.handlePaymentFailed(failedIntent);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}
