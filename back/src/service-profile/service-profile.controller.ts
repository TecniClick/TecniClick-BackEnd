import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ServiceProfileService } from './service-profile.service';

@Controller('service-profile')
export class ServiceProfileController {
  constructor(private readonly serviceProfileService: ServiceProfileService) {}

  // OBTENER LISTA DE PERFILES POR CATEGORÍA
  @Get('by-category')
  async getAllServiceProfilesByCategoryController(
    @Query('category') category: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber: number =
      page && !isNaN(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const limitNumber: number =
      limit && !isNaN(Number(limit)) && Number(limit) > 0 ? Number(limit) : 5;

    return await this.serviceProfileService.getAllServiceProfilesByCategoryService(
      category,
      pageNumber,
      limitNumber,
    );
  }

  // CREAR UN PERFIL
  @Post('create')
  createServiceProfileController(@Body() serviceProfile) {
    return this.serviceProfileService.createServiceProfileService(
      serviceProfile,
    );
  }

  // OBTENER PERFIL POR ID
  @Get(':id')
  getServiceProfileByIdController(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceProfileService.getServiceProfileByIdService(id);
  }
}
