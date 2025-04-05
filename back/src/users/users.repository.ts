import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/DTO/userDtos/CreateUser.dto';
import { User } from 'src/entities/user.entity';
import { InsertResult, Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  //Get All Users
  async getAllUsersRepository() {
    const users = await this.usersRepository.find();
    return users.map(({ password, role, ...user }) => user);
  }

  //CARGA DE ADMINISTRADORES
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
    return await this.usersRepository.findOne({
      where: { id },
    });
  }

  // OBTENER USUARIO POR CORREO ELECTRÓNICO
  async getUserByEmailRepository(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  //CREATE USER
  async createUserRepository(user: CreateUserDto): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async softDeleteRepository(id: string) {
    const entity = await this.usersRepository.findOneBy({ id: id });
    if (!entity)
      throw new NotFoundException(`Usuario con id ${id} no se pudo encontrar`);
    entity.deletedAt = new Date();
    return {
      message: `Usuario con ${id} eliminado lógicamente`,
      user: this.usersRepository.save(entity),
    };
  }
}
