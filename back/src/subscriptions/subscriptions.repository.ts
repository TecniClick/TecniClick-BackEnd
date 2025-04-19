import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriptions } from 'src/entities/subcriptions.entity';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { CreatePaymentDto } from 'src/DTO/subscriptionsDtos/createPayment.dto';
import { CreateSubscriptionDto } from 'src/DTO/subscriptionsDtos/createSuscription.dto';

@Injectable()
export class SubscriptionsRepository {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Subscriptions)
    private subscriptionsRepository: Repository<Subscriptions>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-03-31.basil',
    });
  }

  async createSubscriptionRepository(subscriptionData: CreateSubscriptionDto) {
    const newSubscription =
      this.subscriptionsRepository.create(subscriptionData);

    return await this.subscriptionsRepository.save(newSubscription);
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
