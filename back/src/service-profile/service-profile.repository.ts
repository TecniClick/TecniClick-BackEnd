import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceProfileRepository {
  constructor(
    @InjectRepository(ServiceProfile)
    private serviceProfileRepository: Repository<ServiceProfile>,
  ) {}

  //Actualizar cuando tengas la entidad de categorías (name por category)
  // OBTENER LISTA DE USUARIOS POR CATEGORÍA
  async getAllServiceProfilesByCategoryRepository(
    category: string,
    skip: number,
    limit: number,
  ): Promise<ServiceProfile[]> {
    return this.serviceProfileRepository
      .createQueryBuilder('sp')
      .innerJoinAndSelect('sp.category', 'c')
      .where('c.name = :category', { category })
      .take(limit)
      .skip(skip)
      .getMany();
  }

  // OBTENER PERFIL POR ID
  async getServiceProfileByIdRepository(id: string): Promise<ServiceProfile> {
    return await this.serviceProfileRepository.findOne({
      where: { id },
    });
  }

  //CREAR UN USUARIO
  async createServiceProfileRepository(serviceProfile) {
    return await this.serviceProfileRepository.save(serviceProfile);
  }
}
