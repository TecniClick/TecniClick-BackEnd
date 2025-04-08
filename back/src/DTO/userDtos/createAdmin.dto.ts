import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/enums/UserRole.enum';

export class CreateAdminDto {
  @ApiProperty({
    required: true,
    example: 'Juan Perez',
    description: 'Nombre completo del usuario',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan@example.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
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
    required: true,
    description: 'Número de teléfono del usuario',
    example: '123456789',
  })
  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @ApiProperty({
    required: true,
    description: 'Dirección del usuario',
    example: 'Calle 123, Ciudad, País',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address: string;

  @ApiProperty({
    description:
      'Accesos para el usuario administrador de acuerdo al role otorgado',
    example: 'admin',
    required: false,
  })
  @IsEnum(UserRole)
  role: UserRole;
}
