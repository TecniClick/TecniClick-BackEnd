import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { Appointment } from 'src/entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ServiceProfile, Appointment])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
