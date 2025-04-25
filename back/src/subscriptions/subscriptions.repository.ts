import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriptions } from 'src/entities/subcriptions.entity';
import { SubscriptionsType } from 'src/enums/Subscriptions.enum';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionsRepository {
  constructor(
    @InjectRepository(Subscriptions)
    private subscriptionsRepository: Repository<Subscriptions>,
  ) {}

  // OBTENER TODOS LOS PERFILES EXISTENTES
  async getAllSubscriptionsRepository(): Promise<Subscriptions[]> {
    return await this.subscriptionsRepository.find();
  }

  // OBTENER TODAS LOS SUBSCRIPCIONES PREMIUM EXISTENTES
  async getAllPremiumSubscriptionsRepository(): Promise<Subscriptions[]> {
    return await this.subscriptionsRepository.find({
      where: {
        subscriptionType: SubscriptionsType.PREMIUM,
      },
      relations: ['orders'],
    });
  }

  // OBTENER TODAS LOS SUBSCRIPCIONES FREE EXISTENTES
  async getAllFreeSubscriptionsRepository(): Promise<Subscriptions[]> {
    return await this.subscriptionsRepository.find({
      where: {
        subscriptionType: SubscriptionsType.FREE,
      },
    });
  }

  // OBTENER PERFIL POR ID
  async getSubscriptionByIdRepository(id: string): Promise<Subscriptions> {
    return await this.subscriptionsRepository.findOne({
      where: { id },
      relations: ['orders'],
    });
  }

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
