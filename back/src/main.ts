import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middleware/logger.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { UsersService } from './users/users.service';
import { MailService } from './mail/mail.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/orders/webhook', bodyParser.raw({ type: 'application/json' }));
  app.use(new loggerGlobal().use);
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  setInterval(async () => {
    const users = await this.UsersService.getAllUsersEmailsRepository();
    users.forEach(user => {
      this.MailService.sendNewsletter(user.email, user.name)
        .catch(e => console.error(`Error con ${user.email}:`, e.message));
    });
  }, 5 * 60 * 1000);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('PF TECNICLICK')
    .setDescription('Documentación API para proyecto final Henry, TECNICLICK')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
