import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/DTO/authDtos/LoginUser.dto';
import { CreateUserDto } from 'src/DTO/authDtos/CreateUser.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ExcludeFieldsInterceptor } from 'src/interceptors/excludeFields.interceptor';
import { SignUpResponseDto } from 'src/DTO/authDtos/signUp.dto';
import { SignInResponseDto } from 'src/DTO/authDtos/signIn.dto';
import { AuthGuard } from '@nestjs/passport';

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

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    if (!req.user) {
      throw new BadRequestException('No se pudo autenticar con Google');
    }

    const result = await this.authService.validateOAuthLogin(req.user);

    return {
      message: 'Autenticación con Google exitosa',
      token: result.token,
      user: result.user,
    };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}
}
