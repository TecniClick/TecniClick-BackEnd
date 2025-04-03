import { Module } from '@nestjs/common';
import { ServiceProfileService } from './service-profile.service';
import { ServiceProfileController } from './service-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { ServiceProfileRepository } from './service-profile.repository';
import { Categories } from 'src/entities/categories.entity';
import { CategoriesRepository } from 'src/categories/categories.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceProfile, Categories])],
  controllers: [ServiceProfileController],
  providers: [
    ServiceProfileService,
    ServiceProfileRepository,
    CategoriesRepository,
  ],
})
export class ServiceProfileModule {}
