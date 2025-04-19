import { Injectable } from '@nestjs/common';
import { SubscriptionsRepository } from './subscriptions.repository';
import { CreateSubscriptionDto } from 'src/DTO/subscriptionsDtos/createSuscription.dto';
import { SubscriptionsType } from 'src/enums/Subscriptions.enum';
import { SubscriptionStatus } from 'src/enums/subscriptionStatus.enum';
import { ServiceProfileRepository } from 'src/service-profile/service-profile.repository';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly serviceProfileRepository: ServiceProfileRepository,
  ) {}

  async createSubscriptionService(serviceProfileId: string) {
    const subscriptionType = SubscriptionsType.FREE;
    const status = SubscriptionStatus.PENDING;
    const paymentDate = null;
    const expirationDate = null;
    const createdPremiumAt = null;
    const serviceProfile =
      await this.serviceProfileRepository.getServiceProfileByIdRepository(
        serviceProfileId,
      );

    const subscriptionToCreate = {
      subscriptionType,
      status,
      paymentDate,
      expirationDate,
      createdPremiumAt,
      serviceProfile,
    };

    const newSubscription =
      this.subscriptionsRepository.createSubscriptionRepository(
        subscriptionToCreate,
      );
    return await this.subscriptionsRepository.saveSubscriptionRepository(
      newSubscription,
    );
  }

  // async createSubscriptionService(subscriptionData: CreateSubscriptionDto) {
  //   const paymentDate = new Date();

  //   const expirationDate = new Date();
  //   expirationDate.setMonth(expirationDate.getMonth() + 1);

  //   const subscriptionToCreate = {
  //     ...subscriptionData,
  //     paymentDate,
  //     expirationDate: expirationDate,
  //     status: 'pending',
  //   };

  //   return await this.subscriptionsRepository.createSubscriptionRepository(
  //     subscriptionToCreate,
  //   );
  // }
}
