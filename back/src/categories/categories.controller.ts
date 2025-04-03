import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // CREAR UNA CATEGORÍA
  @Post('create')
  createCategoriesController(@Body() category) {
    return this.categoriesService.createCategoriesService(category);
  }

  // OBTENER CATEGORÍA POR NOMBRE
  @Get('by-name')
  getCategoryByNameController(@Query('name') name: string) {
    return this.categoriesService.getCategoryByNameService(name);
  }
}
