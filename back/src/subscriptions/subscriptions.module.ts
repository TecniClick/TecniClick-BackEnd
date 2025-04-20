import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsRepository } from './subscriptions.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriptions } from 'src/entities/subcriptions.entity';
import { ConfigModule } from '@nestjs/config';
import { ServiceProfileRepository } from 'src/service-profile/service-profile.repository';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriptions, ServiceProfile]),
    ConfigModule,
  ],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    SubscriptionsRepository,
    ServiceProfileRepository,
  ],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
