import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ServiceProfileRepository } from './service-profile.repository';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { CategoriesRepository } from 'src/categories/categories.repository';

@Injectable()
export class ServiceProfileService {
  constructor(
    private readonly serviceProfileRepository: ServiceProfileRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

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

    console.log('Categoría recibida:', categoryName);

    const category =
      await this.categoriesRepository.getCategoryByNameRepository(categoryName);
    if (!category)
      throw new NotFoundException(
        `No se encontró la categoría '${categoryName}'`,
      );
    console.log('Categoría encontrada:', category);

    const skip: number = (page - 1) * limit;

    const serviceProfiles =
      await this.serviceProfileRepository.getAllServiceProfilesByCategoryRepository(
        category.id,
        skip,
        limit,
      );

    console.log('Perfiles encontrados:', serviceProfiles);

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
  async createServiceProfileService(serviceProfile) {
    const category = serviceProfile.category;
    if (!category) {
      throw new BadRequestException(`La categoría debe ser añadida`);
    }

    let foundCategory =
      await this.categoriesRepository.getCategoryByNameRepository(category);

    if (!foundCategory) {
      throw new NotFoundException(
        `La categoría ${category} no ha sido asignada`,
      );
    }

    //Checar si se crea la categoría al momento de querer asignar una nueva (checar con front)

    serviceProfile.category = foundCategory;

    return await this.serviceProfileRepository.createServiceProfileRepository(
      serviceProfile,
    );
  }

  async softDeleteService(id: string){
    return this.serviceProfileRepository.softDeleteRepository(id)
  }
}
