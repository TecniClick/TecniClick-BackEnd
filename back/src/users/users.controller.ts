import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExcludeFieldsInterceptor } from 'src/interceptors/excludeFields.interceptor';
import { UsersResponseDto } from 'src/DTO/userDtos/userResponse.dto';
import { CreateAdminDto } from 'src/DTO/userDtos/createAdmin.dto';
import { UpdateUserDto } from 'src/DTO/userDtos/updateUser.dto';
import { UpdatePasswordDto } from 'src/DTO/userDtos/updatePassword.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/UserRole.enum';
import { RolesGuard } from 'src/Auth/guards/roles.guard';
import { AuthGuard } from 'src/Auth/guards/auth.guard';
import { ResponseOfUserDto } from 'src/DTO/userDtos/responseOfUser.dto';
import { MailService } from 'src/mail/mail.service';
import { UpgradeToAdminDto } from 'src/DTO/userDtos/upgradeToAdmin.dto';

@ApiTags('Endpoints de usuarios')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  // OBTENER TODOS LOS USUARIOS
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los usuarios (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Usuarios obtenidos exitosamente' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(ExcludeFieldsInterceptor(['password']))
  getAllUsersController(): Promise<UsersResponseDto[]> {
    return this.usersService.getAllUsersService();
  }

  // GET ALL ACTIVE USERS
  @Get('active')
  @ApiOperation({ summary: 'Obtener todos los usuarios activos' })
  @ApiResponse({ status: 200, description: 'Usuarios activos obtenidos' })
  @UseInterceptors(ExcludeFieldsInterceptor(['password']))
  getAllActiveUsersController(): Promise<UsersResponseDto[]> {
    return this.usersService.getAllActiveUsersService();
  }

  // GET ALL INACTIVE USERS
  @Get('inactive')
  @ApiOperation({ summary: 'Obtener todos los usuarios inactivos' })
  @ApiResponse({ status: 200, description: 'Usuarios inactivos obtenidos' })
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getAllInactiveUsersController(): Promise<UsersResponseDto[]> {
    return this.usersService.getAllInactiveUsersService();
  }

  // GET ALL ACTIVE CUSTOMERS
  @Get('active/custumers')
  @ApiOperation({ summary: 'Obtener todos los clientes activos' })
  @ApiResponse({ status: 200, description: 'Clientes activos obtenidos' })
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getAllActiveCustumersController(): Promise<UsersResponseDto[]> {
    return this.usersService.getAllActiveCustumersService();
  }

  // GET ALL INACTIVE CUSTOMERS
  @Get('inactive/custumers')
  @ApiOperation({ summary: 'Obtener todos los clientes inactivos' })
  @ApiResponse({ status: 200, description: 'Clientes inactivos obtenidos' })
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getAllInactiveCustumersController(): Promise<UsersResponseDto[]> {
    return this.usersService.getAllInactiveCustumersService();
  }

  // GET ALL ACTIVE PROVIDERS
  @Get('active/providers')
  @ApiOperation({ summary: 'Obtener todos los proveedores activos' })
  @ApiResponse({ status: 200, description: 'Proveedores activos obtenidos' })
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getAllActiveProvidersController(): Promise<UsersResponseDto[]> {
    return this.usersService.getAllActiveProvidersService();
  }

  // GET ALL INACTIVE PROVIDERS
  @Get('inactive/providers')
  @ApiOperation({ summary: 'Obtener todos los proveedores inactivos' })
  @ApiResponse({ status: 200, description: 'Proveedores inactivos obtenidos' })
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getAllInactiveProvidersController(): Promise<UsersResponseDto[]> {
    return this.usersService.getAllInactiveProvidersService();
  }

  // GET ALL ACTIVE ADMINS
  @Get('active/admins')
  @ApiOperation({ summary: 'Obtener todos los administradores activos' })
  @ApiResponse({ status: 200, description: 'Admins activos obtenidos' })
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getAllActiveAdminsController(): Promise<UsersResponseDto[]> {
    return this.usersService.getAllActiveAdminsService();
  }

  // Get ALL Inactive Admins
  @Get('inactive/admins')
  @ApiOperation({ summary: 'Obtener administradores inactivos' })
  @ApiResponse({ status: 200, description: 'Admins inactivos listados' })
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getAllInactiveAdminsController(): Promise<UsersResponseDto[]> {
    return this.usersService.getAllInactiveAdminsService();
  }

  //CARGA DE ADMINISTRADORES
  @Get('seeder')
  @ApiOperation({ summary: 'Cargar administradores de prueba' })
  @ApiResponse({ status: 200, description: 'Admins creados' })
  addUsersController(): Promise<string> {
    return this.usersService.addUsersService();
  }

  //CREAR UN ADMINISTRADOR
  @Post('create/admin')
  @ApiOperation({ summary: 'Crear nuevo administrador' })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({
    status: 201,
    description: 'Administrador creado exitosamente',
  })
  @UseInterceptors(ExcludeFieldsInterceptor(['password']))
  createAdminsController(@Body() admin: CreateAdminDto) {
    return this.usersService.createAdminsService(admin);
  }

  //CAMBIAR UN USUARIO A ADMINISTRADOR POR CORREO
  @Patch('upgrade-admin')
  @ApiOperation({ summary: 'Actualizar usuario a administrador por email' })
  @ApiBearerAuth()
  @ApiBody({ type: UpgradeToAdminDto })
  @Roles(UserRole.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(ExcludeFieldsInterceptor(['password']))
  upgradeToAdminsController(
    @Body('email') email: string,
  ): Promise<UsersResponseDto> {
    return this.usersService.upgradeToAdminsService(email);
  }

  // ELIMINAR LÓGICAMENTE A UN USUARIO POR EMAIL
  @Patch('softDelete/email')
  @ApiOperation({ summary: 'Eliminar lógicamente un usuario por email' })
  @ApiBearerAuth()
  @ApiBody({ type: UpgradeToAdminDto })
  @Roles(UserRole.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  async softDeleteByEmailController(
    @Body('email') email: string,
  ): Promise<ResponseOfUserDto> {
    return this.usersService.softDeleteByEmailService(email);
  }

  // OBTENER USUARIO POR ID
  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'UUID del usuario',
    example: '1e7d79d5-c6b2-4b8b-a8cb-e6f5f23b5e4d',
  })
  @ApiResponse({ status: 200, description: 'Usuario encontrado exitosamente' })
  @UseInterceptors(ExcludeFieldsInterceptor(['password']))
  getUserByIdController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UsersResponseDto> {
    return this.usersService.getUserByIdService(id);
  }

  //  MODIFICAR USUARIO POR ID
  @Patch('update/:id')
  @ApiOperation({ summary: 'Actualizar información del usuario' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'UUID del usuario',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  updateUserController(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedData: UpdateUserDto,
  ): Promise<UsersResponseDto> {
    return this.usersService.updateUserService(id, updatedData);
  }

  //  MODIFICAR CONTRASEÑA POR ID DE USUARIO
  @Patch('update/password/:id')
  @ApiOperation({ summary: 'Actualizar contraseña del usuario' })
  @ApiParam({ name: 'id', required: true, description: 'UUID del usuario' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Contraseña actualizada correctamente',
  })
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  updatePasswordController(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedData: UpdatePasswordDto,
  ): Promise<ResponseOfUserDto> {
    return this.usersService.updatePasswordService(id, updatedData);
  }

  // ELIMINAR LÓGICAMENTE A UN USUARIO POR ID
  @Patch('softDelete/:id')
  @ApiOperation({ summary: 'Eliminar lógicamente por ID' })
  @ApiParam({ name: 'id', required: true, description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado lógicamente' })
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  softDeleteController(@Param('id') id: string): Promise<ResponseOfUserDto> {
    return this.usersService.softDeleteService(id);
  }

  // ELIMINAR UN USUARIO DE LA BASE DE DATOS
  @Delete('delete/:id')
  @ApiOperation({ summary: 'Eliminar permanentemente un usuario' })
  @ApiBearerAuth()
  @Roles(UserRole.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiParam({ name: 'id', required: true, description: 'UUID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado de la base de datos',
  })
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  deleteUserController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseOfUserDto> {
    return this.usersService.deleteUserService(id);
  }

  //REACTIVAR USUARIO ELIMINADO LOGICAMENTE
  @Patch('reactivate/:id')
  @ApiOperation({ summary: 'Reactivar usuario previamente eliminado' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiParam({ name: 'id', required: true, description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario reactivado correctamente' })
  @Roles(UserRole.ADMIN)
  async reactivateUserController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.usersService.reactivateUserService(id);
    return { message: 'Usuario reactivado exitosamente' };
  }
}
