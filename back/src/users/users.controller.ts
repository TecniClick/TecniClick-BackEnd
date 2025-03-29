import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //CARGA DE ADMINISTRADORES
  @Get('seeder')
  addAdminsController() {
    return this.usersService.addAdminsService();
  }

  // OBTENER LISTA DE USUARIOS POR CATEGORÍA
  @Get('by-category')
  async getUsersByCategoryController(
    @Query('category') category: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber: number =
      page && !isNaN(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const limitNumber: number =
      limit && !isNaN(Number(limit)) && Number(limit) > 0 ? Number(limit) : 5;
    return await this.usersService.getUsersByCategoryService(
      category,
      pageNumber,
      limitNumber,
    );
  }

  // OBTENER USUARIO POR ID
  @Get(':id')
  getUserByIdController(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserByIdService(id);
  }
}
