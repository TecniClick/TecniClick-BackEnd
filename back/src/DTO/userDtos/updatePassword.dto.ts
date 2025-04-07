import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    required: true,
    description: 'Contraseña actual del usuario',
    example: 'OldPass123!',
  })
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    required: false,
    description:
      'Clave del usuario debe tener entre 8 y 15 caracteres e incluir al menos una mayúscula, minúscula y un simbolo',
    example: 'SecurePass123!',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @IsStrongPassword({
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  password: string;

  @ApiProperty({
    required: false,
    description: 'Confirmación de la contraseña',
    example: 'SecurePass123!',
  })
  @IsNotEmpty()
  confirmPassword: string;
}
