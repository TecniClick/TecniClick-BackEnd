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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/Auth/guards/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MediaType } from 'src/enums/mediaType.enum';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // OBTIENE TODOS LOS DOCUMENTOS EN MEDIA
  @Get()
  @ApiOperation({ summary: 'Obtener todos los documentos en media' })
  getAllMediaController() {
    return this.mediaService.getAllMediaService();
  }

  // OBTIENE TODOS LOS DOCUMENTOS DE TIPO GALLERY EN MEDIA DE UN PERFIL
  @Get('gallery/:profileId')
  @ApiOperation({ summary: 'Obtener documentos de tipo GALLERY por perfil' })
  @ApiParam({ name: 'profileId', type: String })
  getGalleryByProfileController(@Param('profileId') profileId: string) {
    return this.mediaService.getMediaByProfileAndTypeService(
      profileId,
      MediaType.GALLERY,
    );
  }

  // OBTIENE TODOS LOS DOCUMENTOS DE TIPO CERTIFICATE EN MEDIA DE UN PERFIL
  @Get('certificates/:profileId')
  @ApiOperation({
    summary: 'Obtener documentos de tipo CERTIFICATE por perfil',
  })
  @ApiParam({ name: 'profileId', type: String })
  getCertificatesByProfileController(@Param('profileId') profileId: string) {
    return this.mediaService.getMediaByProfileAndTypeService(
      profileId,
      MediaType.CERTIFICATE,
    );
  }

  // OBTIENE TODOS LOS DOCUMENTOS DE TIPO ID_DOCUMENTS EN MEDIA DE UN PERFIL
  @Get('id-documents/:profileId')
  @ApiOperation({
    summary: 'Obtener documentos de tipo ID_DOCUMENT por perfil',
  })
  @ApiParam({ name: 'profileId', type: String })
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
  @ApiOperation({ summary: 'Subir foto de perfil' })
  @ApiParam({ name: 'serviceProfileId', type: String })
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
  @ApiOperation({ summary: 'Subir uno o más archivos multimedia' })
  @ApiParam({ name: 'serviceProfileId', type: String })
  @ApiQuery({
    name: 'type',
    required: true,
    enum: MediaType,
    description: 'Tipo de archivo a subir',
  })
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
  @ApiOperation({ summary: 'Eliminar imagen o documento por ID de media' })
  @ApiParam({ name: 'mediaId', type: String })
  deleteProfilePictureController(@Param('mediaId') id: string) {
    return this.mediaService.deleteProfilePictureService(id);
  }
}
