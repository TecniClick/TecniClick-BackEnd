import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository';
import { IJwtPayload } from 'src/interfaces/jwtPlayload.interface';
import { CreateReviewDto } from 'src/DTO/reviewDtos/createReview.dto';
import { AppointmentsRepository } from 'src/appointments/appointments.repository';
import { AppointmentStatus } from 'src/enums/AppointmentStatus.enum';
import { ReviewToCreateDto } from 'src/DTO/reviewDtos/reviewToCreate.dto';
import { ServiceProfileRepository } from 'src/service-profile/service-profile.repository';
import { Review } from 'src/entities/reviews.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly appointmentRepository: AppointmentsRepository,
    private readonly serviceProfileRepository: ServiceProfileRepository,
    private readonly mailService: MailService,
  ) {}

  async createAReviewService(
    appointmentId: string,
    userOfToken: IJwtPayload,
    createdReview: CreateReviewDto,
  ) {
    const appointment =
      await this.appointmentRepository.getAppointmentByIdRepository(
        appointmentId,
      );

    if (!appointment) {
      throw new NotFoundException(
        `La cita con el id ${appointmentId} no fue encontrada`,
      );
    }

    if (appointment.users.id !== userOfToken.id) {
      throw new ForbiddenException('No puedes calificar una cita ajena');
    }

    if (appointment.review) {
      throw new BadRequestException('Esta cita ya tiene un review');
    }

    if (appointment.appointmentStatus === AppointmentStatus.PENDING) {
      throw new BadRequestException(
        'No se puede calificar una cita que no ha sido aceptada',
      );
    }

    const reviewToCreate: ReviewToCreateDto = {
      rating: createdReview.rating,
      comment: createdReview.comment,
      appointment,
      user: appointment.users,
      serviceProfile: appointment.provider,
    };

    const savedReview =
      await this.reviewsRepository.createAReviewRepository(reviewToCreate);

    // Ajuste del rating en serviceProfile
    const serviceProfile =
      await this.serviceProfileRepository.getServiceProfileByIdRepository(
        appointment.provider.id,
      );

    if (serviceProfile.rating === null) {
      serviceProfile.rating = createdReview.rating;
    } else {
      const currentRating = serviceProfile.rating;
      const numberOfReviews = serviceProfile.reviews.length;
      const newRating =
        (currentRating * numberOfReviews + createdReview.rating) /
        (numberOfReviews + 1);

      serviceProfile.rating = newRating;
    }

    await this.serviceProfileRepository.saveServiceProfileRepository(
      serviceProfile,
    );

    try {
      await this.mailService.sendReviewSubmittedEmail(
        appointment.provider.user.email,
        appointment.provider.userName,
        appointment.users.name,
        appointment.provider.serviceTitle,
        createdReview.rating,
        createdReview.comment,
      );
    } catch (error) {
      console.error('Error al enviar correo de notificación:', error);
    }

    return savedReview;
  }

  async getReviewsByServiceProfileService(serviceProfileId: string) {
    const reviews =
      await this.reviewsRepository.getReviewsByServiceProfileRepository(
        serviceProfileId,
      );

    if (!reviews || reviews.length === 0) {
      throw new NotFoundException(
        'No hay reviews para este perfil de servicio',
      );
    }

    return reviews;
  }

  async getReviewsByUserService(userOfToken: IJwtPayload) {
    const reviews = await this.reviewsRepository.getReviewsByUserRepository(
      userOfToken.id,
    );

    if (!reviews || reviews.length === 0) {
      throw new NotFoundException('Este usuario no ha realizado reviews');
    }

    return reviews;
  }

  getAReviewByIdService(id: string) {
    return this.reviewsRepository.getAReviewByIdRepository(id);
  }

  // ELIMINAR LÓGICAMENTE A UN REVIEW POR ID
  async hardDeleteService(id: string) {
    // Verificar si el review existe
    const reviewExists =
      await this.reviewsRepository.getAReviewByIdRepository(id);
    if (!reviewExists) {
      throw new NotFoundException(`Review con id ${id} no encontrado`);
    }

    // Eliminar permanentemente
    await this.reviewsRepository.hardDeleteReviewRepository(id);

    // Enviar notificación por correo
    try {
      await this.mailService.sendReviewDeletedEmail(
        reviewExists.user.email,
        reviewExists.user.name,
        reviewExists.serviceProfile.serviceTitle,
        reviewExists.rating,
        reviewExists.comment,
        reviewExists.createdAt,
      );
    } catch (error) {
      console.error('Error al enviar correo de notificación:', error);
    }

    return {
      message: `Review con id ${id} eliminado permanentemente`,
    };
  }
}
