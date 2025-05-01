import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Review } from 'src/entities/reviews.entity';
import { AuthGuard } from 'src/Auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/UserRole.enum';
import { CreateReviewDto } from 'src/DTO/reviewDtos/createReview.dto';
import { GetUser } from 'src/decorators/getUser.decorator';
import { IJwtPayload } from 'src/interfaces/jwtPlayload.interface';

@ApiTags('Endpoints de Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // CREAR UN REVIEW CON EL ID DE APPOINTMENT
  @Post(':appointmentId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Crear un review para una cita realizada' })
  @ApiBody({ type: Review })
  @ApiResponse({
    status: 201,
    description: 'Review creado exitosamente',
    type: Review,
  })
  @ApiResponse({
    status: 400,
    description: 'La cita ya tiene un review o no fue aceptada',
  })
  @ApiResponse({
    status: 403,
    description: 'No puedes calificar una cita ajena',
  })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  createAReviewController(
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
    @GetUser() userOfToken: IJwtPayload,
    @Body() createdReview: CreateReviewDto,
  ) {
    return this.reviewsService.createAReviewService(
      appointmentId,
      userOfToken,
      createdReview,
    );
  }

  // Traer reviews por serviceProfileId
  @Get('/service-profile/:serviceProfileId')
  @ApiOperation({ summary: 'Obtener reviews por ID del perfil de servicio' })
  @ApiResponse({ status: 200, description: 'Lista de reviews', type: [Review] })
  getReviewsByServiceProfileController(
    @Param('serviceProfileId', ParseUUIDPipe) serviceProfileId: string,
  ) {
    return this.reviewsService.getReviewsByServiceProfileService(
      serviceProfileId,
    );
  }

  // Traer reviews por userId
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('/user')
  @ApiOperation({
    summary: 'Obtener reviews hechos por el usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reviews del usuario',
    type: [Review],
  })
  @ApiResponse({
    status: 404,
    description: 'Este usuario no ha realizado reviews',
  })
  getReviewsByUserController(@GetUser() userOfToken: IJwtPayload) {
    return this.reviewsService.getReviewsByUserService(userOfToken);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un review por su ID' })
  @ApiResponse({ status: 200, description: 'Review encontrado', type: Review })
  @ApiResponse({ status: 404, description: 'Review no encontrado' })
  getAReviewByIdController(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.getAReviewByIdService(id);
  }

  // ELIMINAR LÓGICAMENTE A UN REVIEW POR ID
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar permanentemente un review' })
  @ApiResponse({ status: 200, description: 'Review eliminado permanentemente' })
  @ApiResponse({ status: 404, description: 'Review no encontrado' })
  async hardDeleteController(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.hardDeleteService(id);
  }
}
