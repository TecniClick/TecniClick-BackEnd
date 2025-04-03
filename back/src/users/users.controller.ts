import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
}
