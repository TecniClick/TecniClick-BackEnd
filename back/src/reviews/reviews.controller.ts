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

  // @Get()
  // findAll() {
  //   return this.reviewsService.findAll();
  // }

  // @Get()
  // findAll() {
  //   return this.reviewsService.findAll();
  // }

  @Get(':id')
  getAReviewByIdController(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.getAReviewByIdService(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateReview) {
  //   return this.reviewsService.update(+id, updateReview);
  // }
}
