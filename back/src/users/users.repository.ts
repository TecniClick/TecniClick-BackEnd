import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { InsertResult, Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

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

  //Actualizar cuando tengas la entidad de categorías (name por category)
  // OBTENER LISTA DE USUARIOS POR CATEGORÍA
  async getUsersByCategoryRepository(
    name: string,
    skip: number,
    limit: number,
  ): Promise<User[]> {
    return await this.usersRepository.find({
      where: { name },
      take: limit,
      skip: skip,
    });
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
  async createUserRepository(user: Partial<User>): Promise<Partial<User>> {
    return await this.usersRepository.save(user);
  }
}
