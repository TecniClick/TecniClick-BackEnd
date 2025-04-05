import { Controller, Delete, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/DTO/CreateUser.dto';

@ApiTags('Endpoints de usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get ALL Users
  @Get()
  getAllUsersController(){
    return this.usersService.getAllUsersService()
  }

  //CARGA DE ADMINISTRADORES
  @Get('seeder')
  addAdminsController() {
    return this.usersService.addAdminsService();
  }

  // OBTENER USUARIO POR ID
  @Get(':id')
  @ApiBody({type: CreateUserDto})
  getUserByIdController(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserByIdService(id);
  }

  @Delete('softDelete/:id')
  softDeleteController(@Param('id') id: string){
    return this.usersService.softDeleteService(id)
  }
}
