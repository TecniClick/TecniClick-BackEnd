import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UsersRepository } from './users.repository';
import { MailModule } from 'src/mail/mail.module';
import { ServiceProfileModule } from 'src/service-profile/service-profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailModule,
    forwardRef(() => ServiceProfileModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
