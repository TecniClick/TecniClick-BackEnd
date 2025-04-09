import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MediaRepository } from './media.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from 'src/entities/media.entity';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { User } from 'src/entities/user.entity';
import { cloudinaryConfig } from 'src/config/cloudinary';

@Module({
  imports: [TypeOrmModule.forFeature([Media, ServiceProfile, User])],
  controllers: [MediaController],
  providers: [MediaService, MediaRepository, cloudinaryConfig],
})
export class MediaModule {}
