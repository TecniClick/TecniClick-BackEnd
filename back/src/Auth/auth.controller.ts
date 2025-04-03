import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/DTO/LoginUser.dto';
import { CreateUserDto } from 'src/DTO/CreateUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Inicio de Sesión
  @Post('signIn')
  async signInController(@Body() credentials: LoginUserDto) {
    const { email, password }: LoginUserDto = credentials;
    return await this.authService.signInService(email, password);
  }

  // Creacion de usuario
  @Post('signUp')
  async signUpController(@Body() user: CreateUserDto) {
    return await this.authService.signUpService(user);
  }
}
