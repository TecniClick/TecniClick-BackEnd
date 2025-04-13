import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description:
      'Token JWT generado para autenticar al usuario después de su registro.',
  })
  token: string;

  @ApiProperty({
    example: 'Usuario logeado con éxito',
    description:
      'Mensaje de respuesta confirmando que el usuario ha sido logeado con éxito',
  })
  message: string;

  @ApiProperty({
    example: '84e78112-d23f-4f03-92f8-7630bf798aa0',
    description: 'Id del usuario que ha sido logeado con éxito',
  })
  userId: string;
}
