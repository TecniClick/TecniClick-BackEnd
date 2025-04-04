import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/DTO/LoginUser.dto';
import { CreateUserDto } from 'src/DTO/CreateUser.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Endpoints de Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Inicio de Sesión
  @Post('signIn')
  @ApiBody({type: LoginUserDto})
  async signInController(@Body() credentials: LoginUserDto) {
    const { email, password }: LoginUserDto = credentials;
    return await this.authService.signInService(email, password);
  }

  // Creacion de usuario
  @Post('signUp')
  @ApiBody({type: CreateUserDto})
  async signUpController(@Body() user: CreateUserDto) {
    return await this.authService.signUpService(user);
  }
}
