import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePaymentDto } from 'src/DTO/ordersDtos/createPayment.dto';
import { Order } from 'src/entities/orders.entity';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

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
  ) {
    return await this.stripe.paymentIntents.create({
      amount: subscriptionData.amount,
      currency,
      payment_method_types: ['card'],
      // description:
      payment_method: subscriptionData.id,
      // confirm: true,
    });
  }
}
