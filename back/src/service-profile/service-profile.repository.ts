import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesRepository } from 'src/categories/categories.repository';
import { ServiceProfileToSaveDto } from 'src/DTO/serviceProfileDtos/serviceProfileToSave.dto';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceProfileRepository {
  constructor(
    @InjectRepository(ServiceProfile)
    private serviceProfileRepository: Repository<ServiceProfile>,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  //Actualizar cuando tengas la entidad de categorías (name por category)
  // OBTENER LISTA DE USUARIOS POR CATEGORÍA
  async getAllServiceProfilesByCategoryRepository(
    categoryId: string,
    skip: number,
    limit: number,
  ): Promise<ServiceProfile[]> {
    return this.serviceProfileRepository
      .createQueryBuilder('serviceProfile')
      .leftJoinAndSelect('serviceProfile.category', 'category')
      .where('category.id = :categoryId', { categoryId })
      .andWhere('serviceProfile.deletedAt IS NULL')
      .skip(skip)
      .take(limit)
      .getMany();
  }

  // OBTENER PERFIL POR ID
  async getServiceProfileByIdRepository(id: string): Promise<ServiceProfile> {
    return await this.serviceProfileRepository.findOne({
      where: { id },
    });
  }

  //CREAR UN PERFIL PARA POSTERIOREMENTE GUARDAR EN LA BASE DE DATOS
  createServiceProfileRepository(
    serviceProfile: ServiceProfileToSaveDto,
  ): ServiceProfile {
    return this.serviceProfileRepository.create(serviceProfile);
  }

  //GUARDAR UN PERFIL EN LA BASE DE DATOS
  async saveServiceProfileRepository(
    serviceProfile: ServiceProfileToSaveDto,
  ): Promise<ServiceProfile> {
    return await this.serviceProfileRepository.save(serviceProfile);
  }

  async softDeleteRepository(id: string) {
    const entity = await this.serviceProfileRepository.findOneBy({ id: id });
    if (!entity)
      throw new NotFoundException(`Usuario con Id ${id} no fue encontrado`);
    entity.deletedAt = new Date();
    return {
      message: `Usuario con Id ${id} fue borrado lógicamente`,
      serviceProfile: this.serviceProfileRepository.save(entity),
    };
  }
}
