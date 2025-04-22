import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePaymentDto } from 'src/DTO/ordersDtos/createPayment.dto';
import { Order } from 'src/entities/orders.entity';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from 'src/enums/orderStatus.enum';

@Injectable()
export class OrdersRepository {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-03-31.basil',
    });
  }

  async createPaymentIntentRepository(
    subscriptionData: CreatePaymentDto,
    currency: string = 'usd',
    subscriptionId: string,
  ) {
    return await this.stripe.paymentIntents.create({
      amount: subscriptionData.amount,
      currency,
      payment_method_types: ['card'],
      payment_method: subscriptionData.id,
      metadata: {
        subscriptionId,
      },
      // confirm: true,
    });
  }

  constructStripeEvent(
    payload: Buffer,
    signature: string,
    endpointSecret: string,
  ): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      endpointSecret,
    );
  }

  async handlePaymentSucceeded(orderData: Partial<Order>) {
    await this.ordersRepository.save(orderData);
  }

  handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const paymentIntentId = paymentIntent.id;
    console.warn(`PaymentIntent ${paymentIntentId} failed.`);
  }
}
