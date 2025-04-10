import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Categories } from 'src/entities/categories.entity';
import { ApiBody } from '@nestjs/swagger';
import { CreateCategoryDto } from 'src/DTO/categoriesDtos/createCategory.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // CREAR UNA CATEGORÍA
  @Post('create')
  @ApiBody({ type: CreateCategoryDto })
  createCategoriesController(@Body() category: CreateCategoryDto) {
    return this.categoriesService.createCategoriesService(category);
  }

  // OBTENER CATEGORÍA POR NOMBRE
  @Get('by-name')
  getCategoryByNameController(@Query('name') name: string) {
    return this.categoriesService.getCategoryByNameService(name);
  }

  // OBTENER CATEGORÍA POR ID
  @Get('/:id')
  getCategoryByIdController(@Param('id') id: string) {
    return this.categoriesService.getCategoryByIdService(id);
  }
}
