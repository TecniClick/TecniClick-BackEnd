import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/entities/reviews.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsRepository {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async createAReviewRepository(createdReview) {
    return await this.reviewRepository.save(createdReview);
  }

  async getAReviewByIdRepository(id: string): Promise<Review> {
    return await this.reviewRepository.findOneBy({ id });
  }
}
