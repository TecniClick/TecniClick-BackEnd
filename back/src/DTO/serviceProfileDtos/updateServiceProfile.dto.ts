import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { AddressDto } from '../generalDtos/address.dto';

export class UpdateServiceProfileDto {
  @ApiProperty({
    example: 'Electricista Profesional',
    description: 'Título del servicio ofrecido',
  })
  @IsOptional()
  serviceTitle?: string;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del usuario que ofrece el servicio',
  })
  @IsOptional()
  userName?: string;

  @ApiProperty({
    description: 'Dirección del proveedor del servicio',
    type: AddressDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({
    example:
      'Servicio de instalaciones eléctricas residenciales y comerciales.',
    description: 'Descripción del servicio',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 150000, description: 'Precio por cita en dolares' })
  @IsOptional()
  appointmentPrice?: number;

  @ApiProperty({
    example: '3001234567',
    description: 'Número de teléfono del proveedor del servicio',
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'Electricidad',
    description: 'Categoría del servicio',
  })
  @IsOptional()
  category?: string;
}
