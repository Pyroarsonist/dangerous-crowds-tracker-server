import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { localsMiddleware } from 'common/middlewares/locals.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(localsMiddleware);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
}
bootstrap();
