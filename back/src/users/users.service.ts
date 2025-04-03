import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { data } from '../utils/listOfAdmins';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  //CARGA DE ADMINISTRADORES
  async addAdminsService() {
    //Verificar duplicados dentro de la data a cargar.
    const usersEmails: Set<string> = new Set();
    for (const element of data) {
      if (usersEmails.has(element.email)) {
        throw new BadRequestException(
          `Estas tratando de agregar dos o más usuarios con el correo electrónico '${element.email}'. El correo electrónico no puede ser registrado más de una vez`,
        );
      }
      usersEmails.add(element.email);

      //Verificar duplicados dentro de la base de datos.
      const foundEmail = await this.usersRepository.getUserByEmailRepository(
        element.email,
      );
      if (foundEmail) {
        throw new BadRequestException(
          `El correo electrónico '${element.email}' ya existe en la base de datos. El correo electrónico no puede ser registrado más de una vez.`,
        );
      }
      //Añade el usuario

      await this.usersRepository.addAdminsRepository(element);
    }

    return 'Los Administradores fueron agregados con éxito';
  }

  // OBTENER USUARIO POR ID
  async getUserByIdService(id: string) {
    const user: User = await this.usersRepository.getUserByIdRepository(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }
    return user;
  }
}
