import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/DTO/authDtos/LoginUser.dto';
import { CreateUserDto } from 'src/DTO/authDtos/CreateUser.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ExcludeFieldsInterceptor } from 'src/interceptors/excludeFields.interceptor';
import { SignUpResponseDto } from 'src/DTO/authDtos/signUp.dto';
import { SignInResponseDto } from 'src/DTO/authDtos/signIn.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Endpoints de Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // INICIO DE SESIÓN
  @Post('signIn')
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({
    description: 'Usuario autenticado con éxito',
    type: SignInResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Credenciales inválidas o usuario eliminado',
  })
  @ApiBody({ type: LoginUserDto })
  async signInController(
    @Body() credentials: LoginUserDto,
  ): Promise<SignInResponseDto> {
    const { email, password }: LoginUserDto = credentials;
    return await this.authService.signInService(email, password);
  }

  // REGISTRO DE USUARIO
  @Post('signUp')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({
    description: 'Usuario registrado exitosamente',
    type: SignUpResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Contraseñas no coinciden o error de hasheo',
  })
  @ApiConflictResponse({
    description: 'El correo electrónico ya está registrado',
  })
  @UseInterceptors(
    ExcludeFieldsInterceptor(['password', 'confirmPassword', 'role']),
  )
  async signUpController(
    @Body() user: CreateUserDto,
  ): Promise<SignUpResponseDto> {
    return await this.authService.signUpService(user);
  }

  // CALLBACK DE GOOGLE
  @Get('google/callback')
  @ApiOperation({ summary: 'Callback de autenticación con Google' })
  @ApiOkResponse({
    description: 'Autenticación con Google exitosa',
  })
  @ApiBadRequestResponse({
    description: 'No se pudo autenticar con Google',
  })
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    if (!req.user) {
      throw new BadRequestException('No se pudo autenticar con Google');
    }

    const result = await this.authService.validateOAuthLogin(req.user);

    const encodedUser = encodeURIComponent(JSON.stringify(result.user));
    res.redirect(
      `http://localhost:3001/auth-success?token=${result.token}&user=${encodedUser}`,
    );

    return {
      message: 'Autenticación con Google exitosa',
      token: result.token,
      user: result.user,
    };
  }

  // REDIRECCIÓN A GOOGLE
  @Get('google')
  @ApiOperation({ summary: 'Redirige al usuario a Google para autenticación' })
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}
}
