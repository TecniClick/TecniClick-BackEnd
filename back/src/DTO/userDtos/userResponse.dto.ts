import { UserRole } from "src/enums/UserRole.enum";

export class UsersResponseDto {
  id: string;

  name: string;

  email: string;

  password: string;

  phone: number;

  address: string;

  role: UserRole;

  imgUrl: string;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}