import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/entities/reviews.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class ReviewsRepository {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async createAReviewRepository(createdReview) {
    return await this.reviewRepository.save(createdReview);
  }

  async getReviewsByServiceProfileRepository(
    serviceProfileId: string,
  ): Promise<Review[]> {
    return this.reviewRepository.find({
      where: {
        serviceProfile: { id: serviceProfileId },
        deletedAt: IsNull(),
      },
      relations: ['appointment', 'user', 'serviceProfile'],
      order: { createdAt: 'DESC' },
    });
  }

  async getReviewsByUserRepository(userId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: {
        user: { id: userId },
        deletedAt: IsNull(),
      },
      relations: ['appointment', 'user', 'serviceProfile'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAReviewByIdRepository(id: string): Promise<Review> {
    return await this.reviewRepository.findOneBy({ id });
  }
}
