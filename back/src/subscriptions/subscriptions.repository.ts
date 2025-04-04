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
}
