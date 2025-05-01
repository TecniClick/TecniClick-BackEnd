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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/Auth/guards/auth.guard';
import { GetUser } from 'src/decorators/getUser.decorator';
import { IJwtPayload } from 'src/interfaces/jwtPlayload.interface';
import { CreateServiceProfileDto } from 'src/DTO/serviceProfileDtos/createServiceProfile.dto';
import { ExcludeFieldsInterceptor } from 'src/interceptors/excludeFields.interceptor';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/UserRole.enum';
import { RolesGuard } from 'src/Auth/guards/roles.guard';
import { UpdateServiceProfileDto } from 'src/DTO/serviceProfileDtos/updateServiceProfile.dto';

@ApiTags('Endpoints de perfiles de Servicio')
@Controller('service-profile')
export class ServiceProfileController {
  constructor(private readonly serviceProfileService: ServiceProfileService) {}

  // OBTENER TODOS LOS PERFILES EXISTENTES
  @Get()
  @ApiOperation({ summary: 'Obtener todos los perfiles de servicio' })
  @ApiResponse({
    status: 200,
    description: 'Lista de perfiles retornada exitosamente.',
  })
  // @ApiBearerAuth()
  // @Roles(UserRole.ADMIN)
  // @UseGuards(AuthGuard, RolesGuard)
  getAllServiceProfileController() {
    return this.serviceProfileService.getAllServiceProfileService();
  }

  // OBTENER PERFILES ACTIVOS (solo admin)
  @Get('active')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener todos los perfiles activos (Solo Admin)' })
  @ApiResponse({ status: 200, description: 'Perfiles activos retornados.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getActivegServiceProfilesController(): Promise<ServiceProfile[]> {
    return this.serviceProfileService.getActiveServiceProfilesService();
  }

  // OBTENER PERFILES PENDIENTES (solo admin)
  @Get('pending')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener perfiles pendientes (Solo Admin)' })
  @ApiResponse({ status: 200, description: 'Perfiles pendientes retornados.' })
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  getPendingServiceProfilesController(): Promise<ServiceProfile[]> {
    return this.serviceProfileService.getPendingServiceProfilesService();
  }

  // OBTENER LISTA DE PERFILES POR CATEGORÍA
  @Get('by-category')
  @ApiOperation({ summary: 'Obtener perfiles por categoría con paginación' })
  @ApiQuery({ name: 'category', required: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Perfiles retornados.' })
  @ApiResponse({ status: 400, description: 'Categoría vacía o inválida.' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
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
  @ApiOperation({ summary: 'Crear un nuevo perfil de servicio' })
  @ApiBody({ type: CreateServiceProfileDto })
  @ApiResponse({ status: 201, description: 'Perfil creado exitosamente.' })
  @ApiResponse({
    status: 400,
    description: 'El usuario ya tiene perfil o la categoría no es válida.',
  })
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  @ApiBody({ type: CreateServiceProfileDto })
  createServiceProfileController(
    @Body() serviceProfile: CreateServiceProfileDto,
    @GetUser() userOfToken: IJwtPayload,
  ): Promise<ServiceProfile> {
    return this.serviceProfileService.createServiceProfileService(
      serviceProfile,
      userOfToken,
    );
  }

  // MODIFICAR EL ESTADO DE UN PERFIL POR ID A ACTIVO (PENDIENTE O RECHAZADO)
  @Patch('status-active/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Activar perfil de servicio (Admin)' })
  @ApiParam({ name: 'id', description: 'ID del perfil' })
  @ApiResponse({ status: 200, description: 'Perfil activado.' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado.' })
  @ApiResponse({ status: 400, description: 'El perfil ya está activo.' })
  async updateServiceProfileStatusActiveController(@Param('id') id: string) {
    return this.serviceProfileService.updateServiceProfileStatusActiveService(
      id,
    );
  }

  // MODIFICAR EL ESTADO DE UN PERFIL POR ID A RECHAZADO
  @Patch('status-rejected/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Rechazar perfil de servicio (Admin)' })
  @ApiParam({ name: 'id', description: 'ID del perfil' })
  @ApiResponse({ status: 200, description: 'Perfil rechazado.' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado.' })
  @ApiResponse({ status: 400, description: 'Perfil no está pendiente.' })
  async updateServiceProfileStatusRejectedController(@Param('id') id: string) {
    return this.serviceProfileService.updateServiceProfileStatusRejectedService(
      id,
    );
  }

  // BORRADO LÓGICO DE UN PERFIL POR ID
  @Patch('softDelete/:id')
  @ApiOperation({ summary: 'Borrado lógico de perfil por ID' })
  @ApiParam({ name: 'id', description: 'ID del perfil' })
  @ApiResponse({ status: 200, description: 'Perfil eliminado lógicamente.' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado.' })
  softDeleteController(@Param('id') id: string) {
    return this.serviceProfileService.softDeleteService(id);
  }

  //  MODIFICAR PERFIL POR ID (ID De Perfil)
  @Patch('update/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  @UseInterceptors(ExcludeFieldsInterceptor(['password', 'role']))
  @ApiOperation({ summary: 'Actualizar perfil de servicio (solo Provider)' })
  @ApiParam({ name: 'id', description: 'ID del perfil' })
  @ApiBody({ type: UpdateServiceProfileDto })
  @ApiResponse({ status: 200, description: 'Perfil actualizado.' })
  @ApiResponse({
    status: 404,
    description: 'Perfil no encontrado o categoría inválida.',
  })
  updateServiceProfileController(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedData: UpdateServiceProfileDto,
  ) {
    return this.serviceProfileService.updateServiceProfileService(
      id,
      updatedData,
    );
  }

  // OBTENER PERFIL POR ID
  @Get(':id')
  @ApiOperation({ summary: 'Obtener perfil por ID' })
  @ApiParam({ name: 'id', description: 'ID del perfil' })
  @ApiResponse({ status: 200, description: 'Perfil encontrado.' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado.' })
  getServiceProfileByIdController(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceProfileService.getServiceProfileByIdService(id);
  }

  // ELIMINAR DEFINITIVAMENTE UN PERFIL POR ID
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Eliminar perfil de servicio (Admin o Customer)' })
  @ApiParam({ name: 'id', description: 'ID del perfil' })
  @ApiResponse({ status: 200, description: 'Perfil eliminado.' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado.' })
  async deleteServiceProfileByIdController(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.serviceProfileService.deleteServiceProfileByIdService(id);
  }
}
