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
  @ApiBody({ type: Review })
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
  getReviewsByUserController(@GetUser() userOfToken: IJwtPayload) {
    return this.reviewsService.getReviewsByUserService(userOfToken);
  }

  @Get(':id')
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
