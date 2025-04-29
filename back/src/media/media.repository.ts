import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadApiResponse, v2 as Cloudinary } from 'cloudinary';
import { Media } from 'src/entities/media.entity';
import { Repository } from 'typeorm';
import toStream = require('buffer-to-stream');
import { MediaType } from 'src/enums/mediaType.enum';

@Injectable()
export class MediaRepository {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = Cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  // // OBTIENE TODOS LOS DOCUMENTOS EN MEDIA
  async getAllMediaRepository() {
    return this.mediaRepository.find({
      relations: ['serviceProfile'],
    });
  }

  // OBTIENE TODOS LOS DOCUMENTOS EN MEDIA POR TIPO DE UN PERFIL
  async getMediaByProfileAndTypeRepository(profileId: string, type: MediaType) {
    return this.mediaRepository.find({
      where: {
        serviceProfile: { id: profileId },
        type,
      },
      relations: ['serviceProfile'],
    });
  }

  async deleteImageRepository(
    publicId: string,
    resourceType: 'image' | 'video' | 'raw',
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      Cloudinary.uploader.destroy(
        publicId,
        { resource_type: resourceType },
        (error, result) => {
          if (error) return reject(error);
  
          if (result.result === 'ok') {
            console.log(`✅ Imagen eliminada correctamente de Cloudinary: ${publicId}`);
            return resolve();
          } else {
            console.error(`❌ Error al eliminar en Cloudinary: ${result.result}`);
            return reject(new Error(`Error al eliminar en Cloudinary: ${result.result}`));
          }
        },
      );
    });
  }
  
}
