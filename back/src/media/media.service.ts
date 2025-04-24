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
    file: Express.Multer.File,
    type: MediaType = MediaType.GALLERY,
  ) {
    const profile = await this.serviceProfile.findOne({ where: { id: id } });
    if (!profile)
      throw new NotFoundException(`Proveedor con Id ${id} no encontrado`);
    const uploadedFile = await this.mediaRepository.uploadImage(file);
    const media = this.mediaEntity.create({
      imgUrl: uploadedFile.secure_url,
      serviceProfile: profile,
      type,
    });

    await this.mediaEntity.save(media);
    return media;
  }

  // async updateUserProfileService(id: string, file: Express.Multer.File) {
  //   const user = await this.usersRepository.findOne({ where: { id: id } });
  //   if (!user)
  //     throw new NotFoundException(`Usuario con Id ${id} no encontrado`);
  //   const uploadImage = await this.mediaRepository.uploadImage(file);
  //   await this.usersRepository.update(id, { imgUrl: uploadImage.secure_url });
  //   const updatedUser = await this.usersRepository.findOneBy({ id: id });
  //   return updatedUser;
  // }

  // async deleteUserPofileService(id: string) {
  //   const user = await this.usersRepository.findOne({ where: { id: id } });
  //   if (!user)
  //     throw new NotFoundException(`Usuario con Id ${id} no encontrado`);
  //   if (!user.imgUrl)
  //     throw new BadRequestException(
  //       `El usuario no tiene imagen de perfil para eliminar`,
  //     );
  //   const urlParts = user.imgUrl.split('/');
  //   const fileName = urlParts[urlParts.length - 1];
  //   const publicId = `avatars/${fileName.split('.')[0]}`;

  //   await this.mediaRepository.deleteImageRepository(publicId);
  //   await this.usersRepository.update(id, { imgUrl: null });
  //   return { message: 'Imagen de perfil eliminada exitosamente' };
  // }
}
