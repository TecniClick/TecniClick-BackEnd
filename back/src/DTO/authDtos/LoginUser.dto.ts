import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    required: true,
    description: 'Correo electrónico del usuario',
    example: 'Juan@email.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description:
      'Contraseña del usuario (debe tener entre 8 y 15 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y un símbolo)',
    example: 'Pass1234!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
