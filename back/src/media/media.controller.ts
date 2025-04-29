import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from 'src/Auth/guards/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MediaType } from 'src/enums/mediaType.enum';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // OBTIENE TODOS LOS DOCUMENTOS EN MEDIA
  @Get()
  getAllMediaController() {
    return this.mediaService.getAllMediaService();
  }

  // OBTIENE TODOS LOS DOCUMENTOS DE TIPO GALLERY EN MEDIA DE UN PERFIL
  @Get('gallery/:profileId')
  getGalleryByProfileController(@Param('profileId') profileId: string) {
    return this.mediaService.getMediaByProfileAndTypeService(
      profileId,
      MediaType.GALLERY,
    );
  }

  // OBTIENE TODOS LOS DOCUMENTOS DE TIPO CERTIFICATE EN MEDIA DE UN PERFIL
  @Get('certificates/:profileId')
  getCertificatesByProfileController(@Param('profileId') profileId: string) {
    return this.mediaService.getMediaByProfileAndTypeService(
      profileId,
      MediaType.CERTIFICATE,
    );
  }

  // OBTIENE TODOS LOS DOCUMENTOS DE TIPO ID_DOCUMENTS EN MEDIA DE UN PERFIL
  @Get('id-documents/:profileId')
  getIdDocumentsByProfileController(@Param('profileId') profileId: string) {
    return this.mediaService.getMediaByProfileAndTypeService(
      profileId,
      MediaType.ID_DOCUMENT,
    );
  }

  // CARGA DE FOTO DE PERFIL
  @Post('profile-picture/:serviceProfileId')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadProfilePicture(
    @Param('serviceProfileId') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5000000,
            message: 'El archivo es demasiado pesado',
          }),
          new FileTypeValidator({
            fileType: /^(image\/(jpeg|png|webp)|video\/(mp4|mov|avi))$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.mediaService.uploadProfilePicture(id, file);
  }

  // CARGA DE FOTOS O DOCUMENTOS
  @Post('upload/:serviceProfileId')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files', 20))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadMediaController(
    @Param('serviceProfileId') id: string,
    @Query('type') type: MediaType,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.mediaService.uploadMediaService(id, files, type);
  }

  // ELIMINAR FOTO O DOCUMENTO POR ID DE MEDIA
  @Delete('delete-picture/:mediaId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  deleteProfilePictureController(@Param('mediaId') id: string) {
    return this.mediaService.deleteProfilePictureService(id);
  }
}
