import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/DTO/LoginUser.dto';
import { CreateUserDto } from 'src/DTO/CreateUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Inicio de Sesión
  @Post('signIn')
  async signIn(@Body() credentials: LoginUserDto){
    const {email, password} = credentials;
    return this.authService.signIn(email, password)
  }

  // Creacion de usuario
  @Post('signUp')
  async signUp(@Body() user: CreateUserDto){
    return this.authService.signUp(user)
  }
}
