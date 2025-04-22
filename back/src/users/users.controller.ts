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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

@ApiTags('Endpoints de usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // OBTENER TODOS LOS USUARIOS
  @Get()
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getAllUsersController(): Promise<UsersResponseDto[]> {
    return this.usersService.getAllUsersService();
  }

  // Get ALL Active Users
  @Get('active')
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getAllActiveUsersController(): Promise<UsersResponseDto[]> {
    return this.usersService.getAllActiveUsersService();
  }

  // Get ALL Inactive Users
  @Get('inactive')
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getAllInactiveUsersController(): Promise<UsersResponseDto[]> {
    return this.usersService.getAllInactiveUsersService();
  }

  // Get ALL Active CUSTUMERS
  @Get('active/custumers')
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getAllActiveCustumersController(): Promise<UsersResponseDto[]> {
    return this.usersService.getAllActiveCustumersService();
  }

  // Get ALL Inactive CUSTUMERS
  @Get('inactive/custumers')
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getAllInactiveCustumersController(): Promise<UsersResponseDto[]> {
    return this.usersService.getAllInactiveCustumersService();
  }

  // Get ALL Active PROVIDERS
  @Get('active/providers')
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getAllActiveProvidersController(): Promise<UsersResponseDto[]> {
    return this.usersService.getAllActiveProvidersService();
  }

  // Get ALL Inactive PROVIDERS
  @Get('inactive/providers')
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getAllInactiveProvidersController(): Promise<UsersResponseDto[]> {
    return this.usersService.getAllInactiveProvidersService();
  }

  // Get ALL Active Admins
  @Get('active/admins')
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getAllActiveAdminsController(): Promise<UsersResponseDto[]> {
    return this.usersService.getAllActiveAdminsService();
  }

  // Get ALL Inactive Admins
  @Get('inactive/admins')
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getAllInactiveAdminsController(): Promise<UsersResponseDto[]> {
    return this.usersService.getAllInactiveAdminsService();
  }

  //CARGA DE ADMINISTRADORES
  @Get('seeder')
  addAdminsController(): Promise<string> {
    return this.usersService.addAdminsService();
  }

  //CREAR UN ADMINISTRADOR
  @Post('create/admin')
  @UseInterceptors(ExcludeFieldsInterceptor(['password']))
  createAdminsController(@Body() admin: CreateAdminDto) {
    return this.usersService.createAdminsService(admin);
  }

  // OBTENER USUARIO POR ID
  @Get(':id')
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getUserByIdController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UsersResponseDto> {
    return this.usersService.getUserByIdService(id);
  }

  //  MODIFICAR USUARIO POR ID
  @Patch(':id')
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  updateUserController(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedData: UpdateUserDto,
  ): Promise<UsersResponseDto> {
    return this.usersService.updateUserService(id, updatedData);
  }

  //  MODIFICAR CONTRASEÑA POR ID DE USUARIO
  @Patch('update/password/:id')
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  updatePasswordController(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedData: UpdatePasswordDto,
  ): Promise<ResponseOfUserDto> {
    return this.usersService.updatePasswordService(id, updatedData);
  }

  // ELIMINAR LÓGICAMENTE A UN USUARIO POR ID
  @Patch('softDelete/:id')
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  softDeleteController(@Param('id') id: string): Promise<ResponseOfUserDto> {
    return this.usersService.softDeleteService(id);
  }

  // ELIMINAR UN USUARIO DE LA BASE DE DATOS
  @Delete(':id')
  @ApiBearerAuth()
  @Roles(UserRole.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  deleteUserController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseOfUserDto> {
    return this.usersService.deleteUserService(id);
  }
}
