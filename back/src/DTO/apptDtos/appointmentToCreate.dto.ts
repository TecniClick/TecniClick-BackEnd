import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from 'src/entities/user.entity';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';

export class AppointmentToSaveDto {
  @ApiProperty({
    required: true,
    description: 'Fecha de la cita como objeto Date',
    example: '2025-04-08T10:30:00Z',
  })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    required: false,
    description: 'Notas adicionales para la cita',
    example: 'Llevar receta anterior.',
  })
  @IsOptional()
  additionalNotes?: string;

  @ApiProperty({
    required: true,
    description: 'Usuario que agenda la cita',
    type: () => User,
  })
  users: User;

  @ApiProperty({
    required: true,
    description: 'Proveedor de servicio que atiende la cita',
    type: () => ServiceProfile,
  })
  provider: ServiceProfile;
}
