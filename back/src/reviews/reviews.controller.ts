import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
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
  @Patch('softDelete/:id')
  softDeleteController(@Param('id') id: string) {
    return this.reviewsService.softDeleteService(id);
  }
}
