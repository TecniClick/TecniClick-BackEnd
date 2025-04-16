import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { data } from '../utils/listOfCategories';
import { CreateCategoryDto } from 'src/DTO/categoriesDtos/createCategory.dto';
import { Categories } from 'src/entities/categories.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  //OBTENER TODAS LAS CATEGORÍAS
  async getAllCategoriesService() {
    return await this.categoriesRepository.getAllCategoriesRepository();
  }

  // CREAR UNA CATEGORÍA
  async createCategoriesService(category) {
    return await this.categoriesRepository.createCategoriesRepository(category);
  }

  // OBTENER CATEGORÍA POR NOMBRE
  async getCategoryByNameService(name: string) {
    return await this.categoriesRepository.getCategoryByNameRepository(name);
  }

  //CARGA DE ADMINISTRADORES
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
        throw new BadRequestException(
          `La categoría '${element.name}' ya existe en la base de datos. Una categoría no puede ser registrada más de una vez.`,
        );
      }

      //Añade la categoría
      await this.categoriesRepository.addCategoriesRepository(element);
    }

    return 'Las categorías fueron agregadas con éxito';
  }

  // OBTENER UNA CATEGORÍA POR ID
  async getCategoryByIdService(id: string) {
    return await this.categoriesRepository.getCategoryByIdRepository(id);
  }
}
