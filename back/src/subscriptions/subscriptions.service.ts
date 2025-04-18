import { Injectable } from '@nestjs/common';
import { SubscriptionsRepository } from './subscriptions.repository';
import { CreateSubscriptionDto } from 'src/DTO/subscriptionsDtos/createSuscription.dto';
import { CreatePaymentDto } from 'src/DTO/subscriptionsDtos/createPayment.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async createSubscriptionService(subscriptionData: CreateSubscriptionDto) {
    const paymentDate = new Date();

    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    const subscriptionToCreate = {
      ...subscriptionData,
      paymentDate,
      expirationDate: expirationDate,
      status: 'pending',
    };

    return await this.subscriptionsRepository.createSubscriptionRepository(
      subscriptionToCreate,
    );
  }

  async createPaymentIntentService(suscriptionData: CreatePaymentDto) {
    return await this.subscriptionsRepository.createPaymentIntentRepository(
      suscriptionData,
    );
  }
}
