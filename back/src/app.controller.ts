import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { get } from 'http';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signIn(){
    
  }
}
