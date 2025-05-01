import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/orders.entity';
import { SubscriptionsRepository } from 'src/subscriptions/subscriptions.repository';
import { Subscriptions } from 'src/entities/subcriptions.entity';
import { MailModule } from 'src/mail/mail.module';
import { User } from 'src/entities/user.entity';
import { UsersRepository } from 'src/users/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Subscriptions, User]), MailModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersRepository,
    SubscriptionsRepository,
    UsersRepository,
  ],
})
export class OrdersModule {}
