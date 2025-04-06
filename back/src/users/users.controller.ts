import { Controller, Delete, Get, Param, ParseUUIDPipe, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/DTO/authDtos/CreateUser.dto';
import { ExcludeFieldsInterceptor } from 'src/interceptors/excludeFields.interceptor';

@ApiTags('Endpoints de usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get ALL Users
  @Get()
  @UseInterceptors(
      ExcludeFieldsInterceptor(['password', 'role']),
    )
  getAllUsersController() {
    return this.usersService.getAllUsersService();
  }

  //CARGA DE ADMINISTRADORES
  @Get('seeder')
  addAdminsController() {
    return this.usersService.addAdminsService();
  }

  // OBTENER USUARIO POR ID
  @Get(':id')
  getUserByIdController(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserByIdService(id);
  }

  @Delete('softDelete/:id')
  softDeleteController(@Param('id') id: string) {
    return this.usersService.softDeleteService(id);
  }
}
