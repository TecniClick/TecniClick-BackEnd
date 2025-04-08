import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';

export class SignUpResponseDto {
  @ApiProperty({
    description:
      'Mensaje indicando que el usuario ha sido registrado exitosamente.',
    example: 'Usuario registrado con éxito.',
  })
  message: string;

  @ApiProperty({
    description: 'Objeto que contiene los detalles del usuario registrado.',
    type: User,
  })
  createdUser: User;

  @ApiProperty({
    description:
      'Token JWT generado para autenticar al usuario después de su registro.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;
}
