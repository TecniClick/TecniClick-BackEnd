import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from 'src/DTO/categoriesDtos/createCategory.dto';
import { Categories } from 'src/entities/categories.entity';
import { InsertResult, Repository } from 'typeorm';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  //OBTENER TODAS LAS CATEGORÍAS
  async getAllCategoriesRepository(): Promise<Categories[]> {
    return await this.categoriesRepository.find();
  }

  //CREAR UNA CATEGORÍA
  async createCategoriesRepository(
    category: CreateCategoryDto,
  ): Promise<Categories> {
    return await this.categoriesRepository.save(category);
  }

  // OBTENER UNA CATEGORÍA POR NOMBRE
  async getCategoryByNameRepository(name: string): Promise<Categories> {
    return await this.categoriesRepository.findOne({
      where: { name },
    });
  }

  //CARGA DE CATEGORÍAS
  async addCategoriesRepository(
    category: Partial<Categories>,
  ): Promise<InsertResult> {
    return await this.categoriesRepository
      .createQueryBuilder()
      .insert()
      .into(Categories)
      .values(category)
      .orIgnore()
      .execute();
  }

  // OBTENER UNA CATEGORÍA POR ID
  async getCategoryByIdRepository(id: string): Promise<Categories> {
    return await this.categoriesRepository.findOne({
      where: { id },
    });
  }
}
