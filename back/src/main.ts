import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middleware/logger.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new loggerGlobal().use);
  const swaggerConfig = new DocumentBuilder()
                          .setTitle('PF TECNICLICK')
                          .setDescription('Documentación API para proyecto final Henry, TECNICLICK')
                          .setVersion('1.0.0')
                          .addBearerAuth()
                          .build()
                          
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
