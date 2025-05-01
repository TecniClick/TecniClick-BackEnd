import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediaRepository } from './media.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { Media } from 'src/entities/media.entity';
import { MediaType } from 'src/enums/mediaType.enum';

@Injectable()
export class MediaService {
  constructor(
    private readonly mediaRepository: MediaRepository,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ServiceProfile)
    private readonly serviceProfile: Repository<ServiceProfile>,
    @InjectRepository(Media)
    private readonly mediaEntity: Repository<Media>,
  ) {}

  // // OBTIENE TODOS LOS DOCUMENTOS EN MEDIA
  async getAllMediaService() {
    return this.mediaRepository.getAllMediaRepository();
  }

  // OBTIENE TODOS LOS DOCUMENTOS EN MEDIA POR TIPO DE UN PERFIL
  async getMediaByProfileAndTypeService(profileId: string, type: MediaType) {
    return this.mediaRepository.getMediaByProfileAndTypeRepository(
      profileId,
      type,
    );
  }

  // CARGA DE FOTO DE PERFIL
  async uploadProfilePicture(id: string, file: Express.Multer.File) {
    const profile = await this.serviceProfile.findOneBy({ id });
    if (!profile) throw new NotFoundException('Perfil no encontrado');

    const uploaded = await this.mediaRepository.uploadImage(file); // Cloudinary, etc.
    profile.profilePicture = uploaded.secure_url;

    await this.serviceProfile.save(profile);
    return {
      message: 'Foto de perfil actualizada',
      profilePicture: profile.profilePicture,
    };
  }

  // CARGA DE FOTOS O DOCUMENTOS
  async uploadMediaService(
    id: string,
    files: Express.Multer.File[],
    type: MediaType,
  ) {
    const profile = await this.serviceProfile.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException(`Proveedor con Id ${id} no encontrado`);
    }

    const invalidFiles = files
      .map((file) => {
        if (file.size > 5000000) {
          return {
            originalname: file.originalname,
            reason: 'Archivo demasiado pesado',
          };
        }

        if (
          !/^(image\/(jpeg|png|webp)|application\/pdf|video\/(mp4|mov|avi))$/.test(
            file.mimetype,
          )
        ) {
          return {
            originalname: file.originalname,
            reason: 'Formato de archivo no permitido',
          };
        }

        return null;
      })
      .filter((item) => item !== null);

    // ❌ Si hay archivos inválidos, abortar la carga
    if (invalidFiles.length > 0) {
      throw new BadRequestException({
        message: 'Uno o más archivos son inválidos. No se cargó ninguno.',
        invalidFiles,
      });
    }

    // ✅ Si todos los archivos son válidos, ahora sí procesarlos
    const mediaEntities = [];

    for (const file of files) {
      const uploadedFile = await this.mediaRepository.uploadImage(file);

      let resourceType: 'image' | 'video' | 'raw' = 'image';
      if (file.mimetype.startsWith('video/')) {
        resourceType = 'video';
      } else if (file.mimetype === 'application/pdf') {
        resourceType = 'raw';
      }

      const media = this.mediaEntity.create({
        imgUrl: uploadedFile.secure_url,
        publicId: uploadedFile.public_id,
        serviceProfile: profile,
        type,
        resourceType,
      });

      const savedMedia = await this.mediaEntity.save(media);
      if (savedMedia) {
        mediaEntities.push(savedMedia.id);
      }
    }

    return {
      message:
        'La media fue cargada con éxito. Estos son los id de los documentos:',
      picturesId: mediaEntities,
    };
  }

  async deleteProfilePictureService(id: string) {
    const picture = await this.mediaEntity.findOne({ where: { id: id } });
    if (!picture)
      throw new NotFoundException(
        `Imagen o documento con id ${id} no encontrado`,
      );

    await this.mediaRepository.deleteImageRepository(
      picture.publicId,
      picture.resourceType as 'image' | 'video' | 'raw',
    );
    await this.mediaEntity.delete({ id });
    return { message: 'Imagen o documento eliminado exitosamente' };
  }
}
