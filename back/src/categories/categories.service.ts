import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  // CREAR UNA CATEGORÍA
  async createCategoriesService(category) {
    return await this.categoriesRepository.createCategoriesRepository(category);
  }

  // OBTENER CATEGORÍA POR NOMBRE
  async getCategoryByNameService(name: string) {
    return await this.categoriesRepository.getCategoryByNameRepository(name);
  }

  async getCategoryByIdService(id: string){
    return await this.categoriesRepository.getCategoryByIdRepository(id)
  }
}
