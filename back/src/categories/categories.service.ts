import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { data } from '../utils/listOfCategories';
import { CreateCategoryDto } from 'src/DTO/categoriesDtos/createCategory.dto';
import { Categories } from 'src/entities/categories.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  //OBTENER TODAS LAS CATEGORÍAS
  async getAllCategoriesService(): Promise<Categories[]> {
    return await this.categoriesRepository.getAllCategoriesRepository();
  }

  // CREAR UNA CATEGORÍA
  async createCategoriesService(
    category: CreateCategoryDto,
  ): Promise<Categories> {
    const exists: Categories =
      await this.categoriesRepository.getCategoryByNameRepository(
        category.name,
      );
    if (exists) {
      throw new ConflictException(`La categoría '${category.name}' ya existe`);
    }
    return await this.categoriesRepository.createCategoriesRepository(category);
  }

  // OBTENER CATEGORÍA POR NOMBRE
  async getCategoryByNameService(name: string): Promise<Categories> {
    if (!name)
      throw new BadRequestException('El nombre de la categoría es requerido');
    const category: Categories =
      await this.categoriesRepository.getCategoryByNameRepository(name);
    if (!category) {
      throw new NotFoundException(
        `No se encontró la categoría con nombre '${name}'`,
      );
    }
    return category;
  }

  //CARGA DE CATEGORÍAS
  async addCategoriesService(): Promise<string> {
    //Verificar duplicados dentro de la data a cargar.
    const categoriesNames: Set<string> = new Set();
    for (const element of data as CreateCategoryDto[]) {
      if (categoriesNames.has(element.name)) {
        throw new BadRequestException(
          `Estas tratando de agregar dos o más categorías con el nombre '${element.name}'. La categoría no puede ser registrada más de una vez`,
        );
      }
      categoriesNames.add(element.name);

      //Verificar duplicados dentro de la base de datos.
      const foundCategory: Categories =
        await this.categoriesRepository.getCategoryByNameRepository(
          element.name,
        );
      if (foundCategory) {
        throw new ConflictException(
          `La categoría '${element.name}' ya existe en la base de datos. Una categoría no puede ser registrada más de una vez.`,
        );
      }

      //Añade la categoría
      await this.categoriesRepository.addCategoriesRepository(element);
    }

    return 'Las categorías fueron agregadas con éxito';
  }

  // OBTENER UNA CATEGORÍA POR ID
  async getCategoryByIdService(id: string): Promise<Categories> {
    const category: Categories =
      await this.categoriesRepository.getCategoryByIdRepository(id);
    if (!category) {
      throw new NotFoundException(`Categoría con ID '${id}' no encontrada`);
    }
    return category;
  }
}
