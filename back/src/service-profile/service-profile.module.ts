import { Module } from '@nestjs/common';
import { ServiceProfileService } from './service-profile.service';
import { ServiceProfileController } from './service-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { ServiceProfileRepository } from './service-profile.repository';
import { Categories } from 'src/entities/categories.entity';
import { CategoriesRepository } from 'src/categories/categories.repository';
import { UsersRepository } from 'src/users/users.repository';
import { User } from 'src/entities/user.entity';
import { MailModule } from 'src/mail/mail.module';
import { Subscriptions } from 'src/entities/subcriptions.entity';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';

@Module({
  imports: [
    MailModule,
    SubscriptionsModule,
    TypeOrmModule.forFeature([ServiceProfile, Categories, User, Subscriptions]),
  ],
  controllers: [ServiceProfileController],
  providers: [
    ServiceProfileService,
    ServiceProfileRepository,
    CategoriesRepository,
    UsersRepository,
  ],
  exports: [ServiceProfileRepository, ServiceProfileService],
})
export class ServiceProfileModule {}
