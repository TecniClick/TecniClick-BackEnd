import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriptions } from 'src/entities/subcriptions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionsRepository {
  constructor(
    @InjectRepository(Subscriptions)
    private subscriptionsRepository: Repository<Subscriptions>,
  ) {}

  createSubscriptionRepository(subscriptionData: Partial<Subscriptions>) {
    return this.subscriptionsRepository.create(subscriptionData);
  }

  async saveSubscriptionRepository(newSubscription: Subscriptions) {
    return await this.subscriptionsRepository.save(newSubscription);
  }

  async getSubscriptionByUserIdRepository(userId: string) {
    return await this.subscriptionsRepository.findOne({
      where: { serviceProfile: { user: { id: userId } } },
      relations: ['serviceProfile', 'serviceProfile.user'],
    });
  }
}
