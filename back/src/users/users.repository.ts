import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersResponseDto } from 'src/DTO/userDtos/userResponse.dto';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/enums/UserRole.enum';
import {
  ILike,
  InsertResult,
  IsNull,
  Not,
  Repository,
  UpdateResult,
} from 'typeorm';

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
      relations: ['serviceProfile'],
    });
  }

  //GET ALL USERS EMAILS
  async getAllUsersEmailsRepository(): Promise<
    { email: string; name: string }[]
  > {
    return this.usersRepository
      .createQueryBuilder('user')
      .select(['user.email', 'user.name'])
      .where('user.email IS NOT NULL')
      .getRawMany();
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
  async addUsersRepository(user: Partial<User>): Promise<InsertResult> {
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
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['serviceProfile'],
    });
  }

  // OBTENER USUARIO POR CORREO ELECTRÓNICO
  async getUserByEmailRepository(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        email: ILike(email.trim()),
      },
    });
  }

  // Obtener un usuario por el ID de su perfil de servicio
  async getUserByServiceProfileId(
    serviceProfileId: string,
  ): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: {
        serviceProfile: {
          id: serviceProfileId,
        },
      },
      relations: ['serviceProfile'],
    });
  }

  // GUARDAR UN USUARIO EN LA BASE DE DATOS
  async saveAUserRepository(entity: Partial<User>): Promise<User> {
    return await this.usersRepository.save(entity);
  }

  // MODIFICAR USUARIO POR ID
  async updateUserRepository(id: string, data: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, data);
    return await this.usersRepository.findOneBy({ id });
  }

  // Eliminar un usuario de la base de datos
  async deleteUserRepository(id: string) {
    await this.usersRepository.delete(id);
  }

  //REACTIVAR UN USUARIO
  async reactivateUser(id: string): Promise<UpdateResult> {
    return this.usersRepository.update(
      { id, deletedAt: Not(IsNull()) },
      { deletedAt: null },
    );
  }
}
