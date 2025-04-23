import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsRepository } from './reviews.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/entities/reviews.entity';
import { AppointmentsRepository } from 'src/appointments/appointments.repository';
import { Appointment } from 'src/entities/appointment.entity';
import { ServiceProfileRepository } from 'src/service-profile/service-profile.repository';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Appointment, ServiceProfile]), MailModule],
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    ReviewsRepository,
    AppointmentsRepository,
    ServiceProfileRepository,
  ],
})
export class ReviewsModule {}
