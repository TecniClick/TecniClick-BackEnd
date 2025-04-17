import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCategoryDto } from 'src/DTO/categoriesDtos/createCategory.dto';
import { Categories } from 'src/entities/categories.entity';

@ApiTags('Endpoints de categorías')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  //OBTENER TODAS LAS CATEGORÍAS
  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  getAllCategoriesController(): Promise<Categories[]> {
    return this.categoriesService.getAllCategoriesService();
  }
  // CREAR UNA CATEGORÍA
  @Post('create')
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiBody({ type: CreateCategoryDto })
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  createCategoriesController(
    @Body() category: CreateCategoryDto,
  ): Promise<Categories> {
    return this.categoriesService.createCategoriesService(category);
  }

  // OBTENER CATEGORÍA POR NOMBRE
  @Get('by-name')
  @ApiOperation({ summary: 'Obtener una categoría por nombre' })
  @ApiQuery({ name: 'name', required: true })
  getCategoryByNameController(
    @Query('name') name: string,
  ): Promise<Categories> {
    return this.categoriesService.getCategoryByNameService(name);
  }

  //CARGA DE CATEGORÍAS
  @Get('seeder')
  @ApiOperation({ summary: 'Cargar todas las categorías predeterminadas' })
  addCategoriesAController(): Promise<string> {
    return this.categoriesService.addCategoriesService();
  }

  // OBTENER CATEGORÍA POR ID
  @Get('/:id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiParam({ name: 'id', required: true })
  getCategoryByIdController(@Param('id') id: string): Promise<Categories> {
    return this.categoriesService.getCategoryByIdService(id);
  }
}
