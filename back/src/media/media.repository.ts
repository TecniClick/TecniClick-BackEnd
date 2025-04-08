import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from 'src/entities/media.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MediaRepository {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}
}
