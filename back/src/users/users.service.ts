import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { data } from '../utils/listOfUsers';
import { User } from 'src/entities/user.entity';
import { UsersResponseDto } from 'src/DTO/userDtos/userResponse.dto';
import { CreateAdminDto } from 'src/DTO/userDtos/createAdmin.dto';
import * as bcrypt from 'bcrypt';
import { ResonseAdminDto } from 'src/DTO/userDtos/responseAdmin.dto';
import { UpdateUserDto } from 'src/DTO/userDtos/updateUser.dto';
import { UserRole } from 'src/enums/UserRole.enum';
import { UpdatePasswordDto } from 'src/DTO/userDtos/updatePassword.dto';
import { ResponseOfUserDto } from 'src/DTO/userDtos/responseOfUser.dto';
import { MailService } from 'src/mail/mail.service';
import { IsNull, Not, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceProfileRepository } from 'src/service-profile/service-profile.repository';
import { ServiceProfileService } from 'src/service-profile/service-profile.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailService,
    private serviceProfileService: ServiceProfileService,
  ) {}

  // Get ALL Type of Users
  async getAllUsersService(): Promise<UsersResponseDto[]> {
    return await this.usersRepository.getAllUsersRepository();
  }

  //GET ALL USERS EMAILS
  async getAllUsersEmails(): Promise<{ email: string; name: string }[]> {
    return this.usersRepository.getAllUsersEmailsRepository();
  }

  //Get All Active Users
  async getAllActiveUsersService(): Promise<UsersResponseDto[]> {
    return this.usersRepository.getAllActiveUsersRepository();
  }

  //Get All Inactive Users
  async getAllInactiveUsersService(): Promise<UsersResponseDto[]> {
    return this.usersRepository.getAllInactiveUsersRepository();
  }

  //Get All Active CUSTUMERS
  async getAllActiveCustumersService(): Promise<UsersResponseDto[]> {
    return this.usersRepository.getAllActiveCustumersRepository();
  }

  //Get All Inactive CUSTUMERS
  async getAllInactiveCustumersService(): Promise<UsersResponseDto[]> {
    return this.usersRepository.getAllInactiveCustumersRepository();
  }

  //Get All Active PROVIDERS
  async getAllActiveProvidersService(): Promise<UsersResponseDto[]> {
    return this.usersRepository.getAllActiveProvidersRepository();
  }

  //Get All Inactive PROVIDERS
  async getAllInactiveProvidersService(): Promise<UsersResponseDto[]> {
    return this.usersRepository.getAllInactiveProvidersRepository();
  }

  //Get All Active ADMINS
  async getAllActiveAdminsService(): Promise<UsersResponseDto[]> {
    return this.usersRepository.getAllActiveAdminsRepository();
  }

  //Get All Inactive ADMINS
  async getAllInactiveAdminsService(): Promise<UsersResponseDto[]> {
    return this.usersRepository.getAllInactiveAdminsRepository();
  }

  //CARGA DE ADMINISTRADORES
  async addUsersService(): Promise<string> {
    //Verificar duplicados dentro de la data a cargar.
    const usersEmails: Set<string> = new Set();
    for (const element of data as CreateAdminDto[]) {
      if (usersEmails.has(element.email)) {
        throw new BadRequestException(
          `Estas tratando de agregar dos o más usuarios con el correo electrónico '${element.email}'. El correo electrónico no puede ser registrado más de una vez`,
        );
      }
      usersEmails.add(element.email);

      //Verificar duplicados dentro de la base de datos.
      const foundEmail: User =
        await this.usersRepository.getUserByEmailRepository(element.email);
      if (foundEmail) {
        throw new BadRequestException(
          `El correo electrónico '${element.email}' ya existe en la base de datos. El correo electrónico no puede ser registrado más de una vez.`,
        );
      }

      // Hashea las contraseñas
      const hashedPassword: string = await bcrypt.hash(element.password, 10);

      if (!hashedPassword)
        throw new BadRequestException(
          `La contraseña del usuario ${element.name} no se pudo hashear`,
        );

      element.password = hashedPassword;

      //Añade el usuario
      await this.usersRepository.addUsersRepository(element);
    }

    return 'Los Usuarios fueron agregados con éxito';
  }

  //CREAR UN ADMINISTRADOR
  async createAdminsService(admin: CreateAdminDto): Promise<ResonseAdminDto> {
    const userExists: User =
      await this.usersRepository.getUserByEmailRepository(admin.email);
    if (userExists)
      throw new BadRequestException(
        'El correo electrónico ya se encuentra registrado',
      );

    const hashedPassword: string = await bcrypt.hash(admin.password, 10);

    if (!hashedPassword)
      throw new BadRequestException('La contraseña no se pudo hashear');

    let role: UserRole;
    if (admin.role !== UserRole.SUPERADMIN) {
      role = UserRole.ADMIN;
    } else {
      role = admin.role;
    }

    const createdAdmin: User = await this.usersRepository.saveAUserRepository({
      ...admin,
      role,
      password: hashedPassword,
    });

    return {
      message: 'Administrador registrado con éxito.',
      admin: createdAdmin,
    };
  }

  //CAMBIAR UN USUARIO A ADMINISTRADOR POR CORREO
  async upgradeToAdminsService(email: string): Promise<UsersResponseDto> {
    if (!email || !email.includes('@')) {
      throw new BadRequestException('El email proporcionado no es válido');
    }

    const user: User =
      await this.usersRepository.getUserByEmailRepository(email);

    if (!user) {
      throw new NotFoundException(
        `Usuario con correo ${email} no fue encontrado`,
      );
    }

    if (![UserRole.CUSTOMER, UserRole.PROVIDER].includes(user.role)) {
      throw new ConflictException(
        'Solo usuarios customer o provider pueden ser promovidos',
      );
    }

    user.role = UserRole.ADMIN;
    const updatedUser = await this.usersRepository.saveAUserRepository(user);

    return updatedUser;
  }

  // OBTENER USUARIO POR ID
  async getUserByIdService(id: string): Promise<UsersResponseDto> {
    const user: User = await this.usersRepository.getUserByIdRepository(id);

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no fue encontrado`);
    }
    return user;
  }

  //  MODIFICAR USUARIO POR ID
  async updateUserService(
    id: string,
    updatedData: UpdateUserDto,
  ): Promise<UsersResponseDto> {
    const user: User = await this.usersRepository.getUserByIdRepository(id);
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no fue encontrado`);
    }

    if (updatedData.email) {
      const foudname: User =
        await this.usersRepository.getUserByEmailRepository(updatedData.email);

      if (foudname)
        throw new ConflictException(
          `El correo electrónico ya se encuentra registrado`,
        );
    }

    return await this.usersRepository.updateUserRepository(id, updatedData);
  }

  //  MODIFICAR CONTRASEÑA POR ID DE USUARIO
  async updatePasswordService(
    id: string,
    updatedData: UpdatePasswordDto,
  ): Promise<ResponseOfUserDto> {
    const user: User = await this.usersRepository.getUserByIdRepository(id);
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no fue encontrado`);
    }

    const isCurrentPasswordValid: boolean = await bcrypt.compare(
      updatedData.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    if (!updatedData.password || !updatedData.confirmPassword)
      throw new BadRequestException(
        'La contraseña y su confirmación son requeridas',
      );

    if (updatedData.password !== updatedData.confirmPassword)
      throw new BadRequestException(
        'La nueva contraseña y su confirmación no coinciden',
      );

    const hashedPassword: string = await bcrypt.hash(updatedData.password, 10);

    const modifiedUser = await this.usersRepository.updateUserRepository(id, {
      password: hashedPassword,
    });

    return {
      message: `La contraseña del usuario con id ${id} ha sido cambiada`,
      user: modifiedUser,
    };
  }

  // ELIMINAR LÓGICAMENTE A UN USUARIO POR ID
  async softDeleteService(id: string): Promise<ResponseOfUserDto> {
    const entity: User = await this.usersRepository.getUserByIdRepository(id);

    if (!entity)
      throw new NotFoundException(`Usuario con id ${id} no se pudo encontrar`);

    entity.deletedAt = new Date();

    const softDeletedUser: User =
      await this.usersRepository.saveAUserRepository(entity);

    // Enviar notificación por correo
    try {
      await this.mailService.sendAccountDeactivatedEmail(
        entity.email,
        entity.name,
      );
    } catch (error) {
      console.error('Error al enviar correo de desactivación:', error);
      // No lanzamos error para no interrumpir el flujo principal
    }

    return {
      message: `Usuario con ${id} eliminado lógicamente`,
      user: softDeletedUser,
    };
  }

  // Eliminar un usuario de la base de datos
  async deleteUserService(id: string): Promise<ResponseOfUserDto> {
    const userToDelete: User =
      await this.usersRepository.getUserByIdRepository(id);

    if (!userToDelete) {
      throw new NotFoundException(`Usuario con id ${id} no se pudo encontrar`);
    }

    await this.usersRepository.deleteUserRepository(userToDelete.id);

    return {
      message: `Usuario con id ${id} eliminado de la base de datos`,
      user: userToDelete,
    };
  }

  async reactivateUserService(id: string): Promise<void> {
    const updateResult = await this.usersRepository.reactivateUser(id);

    if (updateResult.affected === 0) {
      throw new NotFoundException('Usuario no encontrado o ya está activo');
    }
  }
}
