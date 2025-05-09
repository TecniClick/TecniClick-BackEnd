import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'agua',
    description: 'Nombre de la categoría',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la categoría no puede estar vacío' })
  @Length(3, 100)
  name: string;

  @ApiProperty({
    example: 'Trabajar todas las tuberías',
    description: 'Descripción general de los servicios que abarca la categoría',
  })
  @IsString()
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  description: string;
}
