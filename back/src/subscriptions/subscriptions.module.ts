import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsRepository } from './subscriptions.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriptions } from 'src/entities/subcriptions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriptions])],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, SubscriptionsRepository],
})
export class SubscriptionsModule {}
