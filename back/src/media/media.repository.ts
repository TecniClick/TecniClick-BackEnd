import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadApiResponse, v2 as Cloudinary } from 'cloudinary';
import { Media } from 'src/entities/media.entity';
import { Repository } from 'typeorm';
import toStream = require('buffer-to-stream')

@Injectable()
export class MediaRepository {
  constructor() {}
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse>{
    return new Promise((resolve, reject) => {
      const upload = Cloudinary.uploader.upload_stream(
        {resource_type: 'auto'},
        (error, result) => {
          if(error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      )
      toStream(file.buffer).pipe(upload)
    })
  }

  async deleteImageRepository(publicId: string): Promise<void>{
    return new Promise((resolve, reject) => {
      Cloudinary.uploader.destroy(publicId, {resource_type: 'auto'}, (error, result) => {
        if(error) return reject(error);
        resolve();
      })
    })
  }
}
