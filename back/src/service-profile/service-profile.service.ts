import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ServiceProfileRepository } from './service-profile.repository';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { CategoriesRepository } from 'src/categories/categories.repository';
import { UsersRepository } from 'src/users/users.repository';
import { IJwtPayload } from 'src/interfaces/jwtPlayload.interface';
import { CreateServiceProfileDto } from 'src/DTO/serviceProfileDtos/createServiceProfile.dto';
import { Categories } from 'src/entities/categories.entity';
import { User } from 'src/entities/user.entity';
import { ServiceProfileToSaveDto } from 'src/DTO/serviceProfileDtos/serviceProfileToSave.dto';
import { UserRole } from 'src/enums/UserRole.enum';
import { ServiceProfileStatus } from 'src/enums/serviceProfileStatus.enum';

@Injectable()
export class ServiceProfileService {
  constructor(
    private readonly serviceProfileRepository: ServiceProfileRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  // OBTENER TODOS LOS PERFILES EXISTENTES
  async getAllServiceProfileService() {
    return await this.serviceProfileRepository.getAllServiceProfileRepository();
  }

  // OBTENER PERFILES PENDIENTES (solo admin)
  async getPendingServiceProfilesService(): Promise<ServiceProfile[]> {
    return await this.serviceProfileRepository.getPendingServiceProfilesRepository();
  }

  // OBTENER LISTA DE PERFILES POR CATEGORÍA
  async getAllServiceProfilesByCategoryService(
    categoryName: string,
    page: number,
    limit: number,
  ) {
    // Validación de la categoría
    if (!categoryName || categoryName.trim() === '') {
      throw new BadRequestException('La categoría no puede estar vacía.');
    }

    const category =
      await this.categoriesRepository.getCategoryByNameRepository(categoryName);
    if (!category)
      throw new NotFoundException(
        `No se encontró la categoría '${categoryName}'`,
      );

    const skip: number = (page - 1) * limit;

    const serviceProfiles =
      await this.serviceProfileRepository.getAllServiceProfilesByCategoryRepository(
        category.id,
        skip,
        limit,
      );

    if (serviceProfiles.length === 0) {
      throw new NotFoundException(
        `No se encontraron usuarios en la categoría '${categoryName}'.`,
      );
    }

    return serviceProfiles;
  }

  // OBTENER PERFIL POR ID
  async getServiceProfileByIdService(id: string) {
    const serviceProfile: ServiceProfile =
      await this.serviceProfileRepository.getServiceProfileByIdRepository(id);

    if (!serviceProfile) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }
    return serviceProfile;
  }

  // CREAR UN PERFIL
  async createServiceProfileService(
    serviceProfile: CreateServiceProfileDto,
    userOfToken: IJwtPayload,
  ): Promise<ServiceProfile> {
    const category: string = serviceProfile.category;
    if (!category) {
      throw new BadRequestException(`La categoría debe ser añadida`);
    }

    const foundCategory: Categories =
      await this.categoriesRepository.getCategoryByNameRepository(category);

    if (!foundCategory) {
      throw new NotFoundException(
        `La categoría ${category} no ha sido asignada`,
      );
    }

    //Checar si se crea la categoría al momento de querer asignar una nueva (checar con front)

    let user: User = await this.usersRepository.getUserByIdRepository(
      userOfToken.id,
    );

    if (user.role === UserRole.CUSTOMER) {
      user.role = UserRole.PROVIDER;
      user = await this.usersRepository.updateUserRepository(user.id, {
        role: user.role,
      });
    }

    const createdProfile: ServiceProfileToSaveDto =
      this.serviceProfileRepository.createServiceProfileRepository({
        ...serviceProfile,
        category: foundCategory,
        user: user,
      });

    // Cambiar el role del usuario

    return await this.serviceProfileRepository.saveServiceProfileRepository(
      createdProfile,
    );
  }

  // BORRADO LÓGICO DE UN PERFIL POR ID
  async softDeleteService(id: string) {
    const entity: ServiceProfile =
      await this.serviceProfileRepository.getServiceProfileByIdRepository(id);
    if (!entity)
      throw new NotFoundException(`Usuario con Id ${id} no fue encontrado`);
    entity.deletedAt = new Date();

    const newProfile =
      await this.serviceProfileRepository.saveServiceProfileRepository(entity);

    return {
      message: `Usuario con Id ${id} fue borrado lógicamente`,
      serviceProfile: newProfile,
    };
  }

  // MODIFICAR EL ESTADO DE UN PERFIL POR ID
  async updateServiceProfileStatusService(id: string) {
    const serviceProfile: ServiceProfile =
      await this.serviceProfileRepository.getServiceProfileByIdRepository(id);

    if (!serviceProfile) {
      throw new NotFoundException(
        `El perfil de servicio con id ${id} no fue encontrado`,
      );
    }

    // Validamos que el status actual es "pendiente" antes de actualizarlo
    if (serviceProfile.status !== ServiceProfileStatus.PENDING) {
      throw new BadRequestException(
        'Solo perfiles pendientes pueden ser activados',
      );
    }

    serviceProfile.status = ServiceProfileStatus.ACTIVE;

    return this.serviceProfileRepository.saveServiceProfileRepository(
      serviceProfile,
    );
  }
}
