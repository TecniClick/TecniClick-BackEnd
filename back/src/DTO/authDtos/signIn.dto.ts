import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
  @ApiProperty({
    example: 'Usuario logeado con éxito',
    description:
      'Mensaje de respuesta confirmando que el usuario ha sido logeado con éxito',
  })
  message: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description:
      'Token JWT generado para autenticar al usuario después de su registro.',
  })
  token: string;
}
