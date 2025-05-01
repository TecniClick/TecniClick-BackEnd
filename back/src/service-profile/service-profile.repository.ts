import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceProfileToSaveDto } from 'src/DTO/serviceProfileDtos/serviceProfileToSave.dto';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class ServiceProfileRepository {
  constructor(
    @InjectRepository(ServiceProfile)
    private serviceProfileRepository: Repository<ServiceProfile>,
  ) {}

  // OBTENER TODOS LOS PERFILES EXISTENTES
  async getAllServiceProfileRepository(): Promise<ServiceProfile[]> {
    return await this.serviceProfileRepository.find({
      where: {
        deletedAt: null,
      },
      relations: ['subscription'],
    });
  }

  // OBTENER PERFILES ACTIVOS (solo admin)
  async getActiveServiceProfilesRepository(): Promise<ServiceProfile[]> {
    return this.serviceProfileRepository
      .createQueryBuilder('serviceProfile')
      .leftJoinAndSelect('serviceProfile.user', 'user')
      .leftJoinAndSelect('serviceProfile.category', 'category')
      .leftJoinAndSelect('serviceProfile.reviews', 'reviews')
      .leftJoinAndSelect('reviews.user', 'reviewUser')
      .where('serviceProfile.status = :status', { status: 'active' })
      .andWhere('serviceProfile.deletedAt IS NULL')
      .orderBy('serviceProfile.createdAt', 'ASC')
      .addOrderBy('reviews.createdAt', 'DESC')
      .getMany(); // mejora en relaciones
  }

  // OBTENER PERFILES PENDIENTES (solo admin)
  async getPendingServiceProfilesRepository(): Promise<ServiceProfile[]> {
    return this.serviceProfileRepository
      .createQueryBuilder('serviceProfile')
      .leftJoinAndSelect('serviceProfile.user', 'user')
      .leftJoinAndSelect('serviceProfile.category', 'category')
      .where('serviceProfile.status = :status', { status: 'pending' })
      .andWhere('serviceProfile.deletedAt IS NULL')
      .orderBy('serviceProfile.createdAt', 'ASC') // ordena del más viejo al más nuevo ('DESC' para orden inverso)
      .getMany();
  }

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
      relations: ['user', 'reviews', 'subscription'],
    });
  }

  // OBTENER PERFIL POR ID DE USUARIO
  async getServiceProfileByUserIdRepository(
    userId: string,
  ): Promise<ServiceProfile> {
    return await this.serviceProfileRepository.findOne({
      where: { user: { id: userId } },
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

  // ELIMINAR DEFINITIVAMENTE UN PERFIL
  async deleteServiceProfileByIdRepository(
    id: string,
  ): Promise<{ message: string }> {
    await this.serviceProfileRepository.delete(id);
    return { message: `Perfil con id ${id} ha sido eliminado permanentemente` };
  }

  async reactivateServiceProfile(profileId: string): Promise<void> {
    const updateResult = await this.serviceProfileRepository.update(
      { id: profileId, deletedAt: Not(IsNull()) },
      { deletedAt: null },
    );

    if (updateResult.affected === 0) {
      throw new NotFoundException(
        'Perfil de servicio no encontrado o ya está activo',
      );
    }
  }
}
