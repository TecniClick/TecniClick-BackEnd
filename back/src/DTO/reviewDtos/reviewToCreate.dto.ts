import { Appointment } from 'src/entities/appointment.entity';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { User } from 'src/entities/user.entity';

export class ReviewToCreateDto {
  rating: number;
  comment: string;
  appointment: Appointment;
  user: User;
  serviceProfile: ServiceProfile;
}
