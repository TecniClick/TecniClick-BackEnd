import { Categories } from 'src/entities/categories.entity';
import { User } from 'src/entities/user.entity';

export class ServiceProfileToSaveDto {
  serviceTitle: string;

  userName: string;

  address: string;

  rating: number;

  description: string;

  appointmentPrice: number;

  phone: string;

  category: Categories;

  user: User;
}
