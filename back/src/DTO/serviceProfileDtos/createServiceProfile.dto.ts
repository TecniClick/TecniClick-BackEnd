import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, ValidateNested } from 'class-validator';
import { AddressDto } from '../generalDtos/address.dto';
import { Type } from 'class-transformer';

export class CreateServiceProfileDto {
  @ApiProperty({
    example: 'Electricista Profesional',
    description: 'Título del servicio ofrecido',
  })
  serviceTitle: string;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del usuario que ofrece el servicio',
  })
  userName: string;

  @ApiProperty({
    description: 'Dirección del proveedor del servicio',
    type: AddressDto,
  })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({
    example:
      'Servicio de instalaciones eléctricas residenciales y comerciales.',
    description: 'Descripción del servicio',
  })
  description: string;

  @ApiProperty({ example: 150000, description: 'Precio por cita en dolares' })
  appointmentPrice: number;

  @ApiProperty({
    example: '3001234567',
    description: 'Número de teléfono del proveedor del servicio',
  })
  phone: string;

  @ApiProperty({
    example:
      'https://www.shutterstock.com/image-vector/default-avatar-profile-social-media-600nw-1920331226.jpg',
    description: 'Foto de perfil',
  })
  @IsEmpty() //No quitar
  profilePicture: string;

  @ApiProperty({
    example: 'Electricidad',
    description: 'Categoría del servicio',
  })
  category: string;
}
