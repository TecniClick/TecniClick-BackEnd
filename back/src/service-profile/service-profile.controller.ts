import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ServiceProfileService } from './service-profile.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/Auth/guards/auth.guard';
import { GetUser } from 'src/decorators/getUser.decorator';
import { IJwtPayload } from 'src/interfaces/jwtPlayload.interface';

@ApiTags('Endpoints de perfiles de Servicio')
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
  @UseGuards(AuthGuard)
  @Post('create')
  createServiceProfileController(
    @Body() serviceProfile,
    @GetUser() userOfToken: IJwtPayload,
  ) {
    return this.serviceProfileService.createServiceProfileService(
      serviceProfile,
      userOfToken,
    );
  }

  // OBTENER PERFIL POR ID
  @Get(':id')
  getServiceProfileByIdController(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceProfileService.getServiceProfileByIdService(id);
  }

  @Delete('softDelete/:id')
  softDeleteController(@Param('id') id: string) {
    return this.serviceProfileService.softDeleteService(id);
  }
}
