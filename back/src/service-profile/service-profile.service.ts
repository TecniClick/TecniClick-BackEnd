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
    category: string,
    page: number,
    limit: number,
  ) {
    // Validación de la categoría
    if (!category || category.trim() === '') {
      throw new BadRequestException('La categoría no puede estar vacía.');
    }

    console.log('Categoría recibida:', category); // 🔍 Verifica qué llega aquí

    const skip: number = (page - 1) * limit;

    // Consultar usuarios con esa categoría
    const serviceProfiles =
      await this.serviceProfileRepository.getAllServiceProfilesByCategoryRepository(
        category,
        skip,
        limit,
      );

    console.log('Perfiles encontrados:', serviceProfiles);

    // Validar si no hay resultados
    if (serviceProfiles.length === 0) {
      throw new NotFoundException(
        `No se encontraron usuarios en la categoría '${category}'.`,
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
}
