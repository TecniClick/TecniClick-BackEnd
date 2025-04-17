import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';

export class ResponseOfUserDto {
  @ApiProperty({
    description:
      'Mensaje indicando que el usuario ha sido eliminado exitosamente.',
    example: 'Usuario eliminado con éxito.',
  })
  message: string;

  @ApiProperty({
    description: 'Objeto que contiene los detalles del usuario eliminado.',
    type: User,
  })
  user: User;
}
