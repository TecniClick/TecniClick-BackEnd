import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    required: false,
    example: 'Juan Perez',
    description: 'Nombre completo del usuario',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    required: false,
    description: 'Número de teléfono del usuario',
    example: '123456789',
  })
  @IsOptional()
  @IsNumber()
  phone?: number;

  @ApiProperty({
    required: false,
    description: 'Dirección del usuario',
    example: 'Calle 123, Ciudad, País',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address?: string;
}
