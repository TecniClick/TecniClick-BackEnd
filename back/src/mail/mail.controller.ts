import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { UsersService } from 'src/users/users.service';

@Controller('mail')
export class MailController {}
