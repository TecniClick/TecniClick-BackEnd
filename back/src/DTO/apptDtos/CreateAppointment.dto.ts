import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    required: true,
    description: 'Fecha de la cita en formato ISO 8601',
    example: '2025-04-08T10:30:00Z',
  })
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    required: true,
    description: 'ID del usuario que solicita la cita',
    example: 'c1a9f1a4-bd8e-4d70-a8b4-b1f5a33b7de1',
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    required: true,
    description: 'ID del proveedor de servicios que atenderá la cita',
    example: 'e8b7a5e1-5aef-4b6e-9c5a-d038bfb3e2f1',
  })
  @IsNotEmpty()
  @IsUUID()
  providerId: string;

  @ApiProperty({
    required: false,
    description: 'Notas adicionales que el usuario desea agregar a la cita',
    example: 'El paciente es alérgico a la penicilina.',
  })
  @IsOptional()
  @IsString()
  additionalNotes: string;
}
