import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/orders.entity';
import { SubscriptionsRepository } from 'src/subscriptions/subscriptions.repository';
import { Subscriptions } from 'src/entities/subcriptions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Subscriptions])],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, SubscriptionsRepository],
})
export class OrdersModule {}
