import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new loggerGlobal().use);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
