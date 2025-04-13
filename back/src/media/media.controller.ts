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
} from '@nestjs/common';
import { MediaService } from './media.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from 'src/Auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

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
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5000000,
            message: 'El archivo es demasiado pesado',
          }),
          new FileTypeValidator({
            fileType: /\.(jpg|jpeg|png|webp|mp4|mov|avi)$/i,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.mediaService.uploadMediaService(id, file);
  }

  @ApiBearerAuth()
  @Patch('foto/:userId')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
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
  updateUserProfilePController(
    @Param('userId') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000,
            message: 'La imagen es demasiado pesada',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.mediaService.updateUserProfileService(id, file);
  }

  @Delete('profileImage/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  deleteUserProfilePictureController(@Param('id') id: string) {
    return this.mediaService.deleteUserPofileService(id);
  }
}
