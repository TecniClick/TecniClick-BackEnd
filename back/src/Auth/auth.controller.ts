import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/DTO/userDtos/LoginUser.dto';
import { CreateUserDto } from 'src/DTO/userDtos/CreateUser.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ExcludeFieldsInterceptor } from 'src/interceptors/excludeFields.interceptor';
import { SignUpResponseDto } from 'src/DTO/authDtos/signUp.dto';
import { SignInResponseDto } from 'src/DTO/authDtos/signIn.dto';

@ApiTags('Endpoints de Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Inicio de Sesión
  @Post('signIn')
  @ApiBody({ type: LoginUserDto })
  async signInController(
    @Body() credentials: LoginUserDto,
  ): Promise<SignInResponseDto> {
    const { email, password }: LoginUserDto = credentials;
    return await this.authService.signInService(email, password);
  }

  // Creacion de usuario
  @Post('signUp')
  @ApiBody({ type: CreateUserDto })
  @UseInterceptors(
    ExcludeFieldsInterceptor(['password', 'confirmPassword', 'role']),
  )
  async signUpController(
    @Body() user: CreateUserDto,
  ): Promise<SignUpResponseDto> {
    return await this.authService.signUpService(user);
  }
}
