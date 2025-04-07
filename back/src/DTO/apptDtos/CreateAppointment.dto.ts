import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  providerId: string;

  @IsOptional()
  @IsString()
  additionalNotes: string;
}
