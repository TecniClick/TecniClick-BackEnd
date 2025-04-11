// address.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @ApiProperty({ example: '321', description: 'Número exterior del domicilio' })
  @IsNotEmpty()
  @IsString()
  extNumber: string;

  @ApiProperty({ example: 'A', description: 'Número interior del domicilio' })
  @IsOptional()
  @IsString()
  intNumber?: string;

  @ApiProperty({ example: 'Cra 45', description: 'Nombre de la calle' })
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty({ example: 'El Poblado', description: 'Barrio' })
  @IsOptional()
  @IsString()
  neighborhood?: string;

  @ApiProperty({ example: '25250', description: 'Código Postal' })
  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @ApiProperty({ example: 'Medellín', description: 'Ciudad' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'Antioquia', description: 'Provincia o estado' })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ example: 'México', description: 'País' })
  @IsNotEmpty()
  @IsString()
  country: string;
}
