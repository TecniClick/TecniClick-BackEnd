import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from 'src/DTO/userDtos/updateUser.dto';
import { UsersResponseDto } from 'src/DTO/userDtos/userResponse.dto';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/enums/UserRole.enum';
import { InsertResult, IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  // Get ALL Type of Users
  async getAllUsersRepository(): Promise<UsersResponseDto[]> {
    return await this.usersRepository.find();
  }

  //Get All Active Users
  async getAllActiveUsersRepository(): Promise<UsersResponseDto[]> {
    return await this.usersRepository.find({
      where: [
        { role: UserRole.CUSTOMER, deletedAt: IsNull() },
        { role: UserRole.PROVIDER, deletedAt: IsNull() },
      ],
    });
  }

  //Get All Inactive Users
  async getAllInactiveUsersRepository(): Promise<UsersResponseDto[]> {
    return await this.usersRepository.find({
      where: [
        { role: UserRole.CUSTOMER, deletedAt: Not(IsNull()) },
        { role: UserRole.PROVIDER, deletedAt: Not(IsNull()) },
      ],
    });
  }

  //Get All Active CUSTUMERS
  async getAllActiveCustumersRepository(): Promise<UsersResponseDto[]> {
    return await this.usersRepository.find({
      where: {
        role: UserRole.CUSTOMER,
        deletedAt: IsNull(),
      },
    });
  }

  //Get All Inactive CUSTUMERS
  async getAllInactiveCustumersRepository(): Promise<UsersResponseDto[]> {
    return await this.usersRepository.find({
      where: {
        role: UserRole.CUSTOMER,
        deletedAt: Not(IsNull()),
      },
    });
  }

  //Get All Active PROVIDERS
  async getAllActiveProvidersRepository(): Promise<UsersResponseDto[]> {
    return await this.usersRepository.find({
      where: {
        role: UserRole.PROVIDER,
        deletedAt: IsNull(),
      },
    });
  }

  //Get All Inactive PROVIDERS
  async getAllInactiveProvidersRepository(): Promise<UsersResponseDto[]> {
    return await this.usersRepository.find({
      where: {
        role: UserRole.PROVIDER,
        deletedAt: Not(IsNull()),
      },
    });
  }

  //Get All Active ADMINS
  async getAllActiveAdminsRepository(): Promise<UsersResponseDto[]> {
    return await this.usersRepository.find({
      where: [
        { role: UserRole.ADMIN, deletedAt: IsNull() },
        { role: UserRole.SUPERADMIN, deletedAt: IsNull() },
      ],
    });
  }

  //Get All Inactive ADMINS
  async getAllInactiveAdminsRepository(): Promise<UsersResponseDto[]> {
    return await this.usersRepository.find({
      where: [
        { role: UserRole.ADMIN, deletedAt: Not(IsNull()) },
        { role: UserRole.SUPERADMIN, deletedAt: Not(IsNull()) },
      ],
    });
  }

  //CARGA DE SUPERADMINISTRADORES
  async addAdminsRepository(user: Partial<User>): Promise<InsertResult> {
    return await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(user)
      .orIgnore()
      .execute();
  }

  // OBTENER USUARIO POR ID
  async getUserByIdRepository(id: string): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  // OBTENER USUARIO POR CORREO ELECTRÓNICO
  async getUserByEmailRepository(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  // GUARDAR UN USUARIO EN LA BASE DE DATOS
  async saveAUserRepository(entity: Partial<User>): Promise<User> {
    return await this.usersRepository.save(entity);
  }

  // MODIFICAR USUARIO POR ID
  async updateUserRepository(id: string, user: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, user);
    return await this.usersRepository.findOneBy({ id });
  }

  // Eliminar un usuario de la base de datos
  async deleteUserRepository(id: string) {
    await this.usersRepository.delete(id);
  }
}
