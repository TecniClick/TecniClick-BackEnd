import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('Home')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Mensaje de bienvenida' })
  @ApiResponse({
    status: 200,
    description: 'Mensaje simple de bienvenida para probar la API',
    schema: {
      example: 'Bienvenidos al Back-End de TecniClick',
      type: 'string',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
