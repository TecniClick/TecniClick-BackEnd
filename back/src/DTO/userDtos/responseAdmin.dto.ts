import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';

export class ResonseAdminDto {
  @ApiProperty({
    description:
      'Mensaje indicando que el administrador ha sido registrado exitosamente.',
    example: 'Administrador registrado con éxito.',
  })
  message: string;

  @ApiProperty({
    description:
      'Objeto que contiene los detalles del administrador registrado.',
    type: User,
  })
  admin: User;
}
