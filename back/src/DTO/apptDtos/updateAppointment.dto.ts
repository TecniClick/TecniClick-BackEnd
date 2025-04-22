import { Type } from 'class-transformer';
import { IsOptional, IsString, IsDate } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date) // 👈 esto convierte el string a Date automáticamente
  date?: Date;

  @IsOptional()
  @IsString()
  additionalNotes?: string;
}
