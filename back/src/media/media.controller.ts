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
} from '@nestjs/common';
import { MediaService } from './media.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from 'src/Auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
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
  uploadMediaController(
    @Param('serviceProfileId') id: string,
    @Query('type') type: MediaType,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5000000,
            message: 'El archivo es demasiado pesado',
          }),
          new FileTypeValidator({
            fileType:
              /^(image\/(jpeg|png|webp)|application\/pdf|video\/(mp4|mov|avi))$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.mediaService.uploadMediaService(id, file, type);
  }

  // @ApiBearerAuth()
  // @Patch('foto/:userId')
  // @UseGuards(AuthGuard)
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // updateUserProfilePController(
  //   @Param('userId') id: string,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({
  //           maxSize: 200000,
  //           message: 'La imagen es demasiado pesada',
  //         }),
  //         new FileTypeValidator({
  //           fileType: /(jpg|jpeg|png|webp)$/,
  //         }),
  //       ],
  //     }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return this.mediaService.updateUserProfileService(id, file);
  // }

  // @Delete('profileImage/:id')
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  // deleteUserProfilePictureController(@Param('id') id: string) {
  //   return this.mediaService.deleteUserPofileService(id);
  // }
}
