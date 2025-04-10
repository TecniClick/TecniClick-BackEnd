import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ServiceProfileService } from './service-profile.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/Auth/guards/auth.guard';
import { GetUser } from 'src/decorators/getUser.decorator';
import { IJwtPayload } from 'src/interfaces/jwtPlayload.interface';
import { CreateServiceProfileDto } from 'src/DTO/serviceProfileDtos/createServiceProfile.dto';
import { ExcludeFieldsInterceptor } from 'src/interceptors/excludeFields.interceptor';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/UserRole.enum';
import { RolesGuard } from 'src/Auth/guards/roles.guard';

@ApiTags('Endpoints de perfiles de Servicio')
@Controller('service-profile')
export class ServiceProfileController {
  constructor(private readonly serviceProfileService: ServiceProfileService) {}

  // OBTENER TODOS LOS PERFILES EXISTENTES
  @Get()
  // @ApiBearerAuth()
  // @Roles(UserRole.ADMIN)
  // @UseGuards(AuthGuard, RolesGuard)
  getAllServiceProfileController() {
    return this.serviceProfileService.getAllServiceProfileService();
  }

  // OBTENER PERFILES PENDIENTES (solo admin)
  @Get('pending')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getPendingServiceProfilesController(): Promise<ServiceProfile[]> {
    return this.serviceProfileService.getPendingServiceProfilesService();
  }

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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  createServiceProfileController(
    @Body() serviceProfile: CreateServiceProfileDto,
    @GetUser() userOfToken: IJwtPayload,
  ): Promise<ServiceProfile> {
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

  // BORRADO LÓGICO DE UN PERFIL POR ID
  @Delete('softDelete/:id')
  softDeleteController(@Param('id') id: string) {
    return this.serviceProfileService.softDeleteService(id);
  }

  // MODIFICAR EL ESTADO DE UN PERFIL POR ID
  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateServiceProfileStatusController(@Param('id') id: string) {
    return this.serviceProfileService.updateServiceProfileStatusService(id);
  }
}
