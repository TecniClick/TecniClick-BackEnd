import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/entities/categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  //CREAR UNA CATEGORÍA
  async createCategoriesRepository(category) {
    return await this.categoriesRepository.save(category);
  }

  // OBTENER UNA CATEGORÍA POR NOMBRE
  async getCategoryByNameRepository(name: string): Promise<Categories> {
    return await this.categoriesRepository.findOne({
      where: { name: name },
    });
  }

  async getCategoryByIdRepository(id) {
    return await this.categoriesRepository.findOne({
      where: { id: id },
    });
  }
}
