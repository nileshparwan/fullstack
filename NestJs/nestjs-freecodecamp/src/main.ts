import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  })); // allow usage of pipe.

  await app.listen(3333);
}

bootstrap();


/**
 * whitelist forbids additional element to be passed inside json body if they are 
 * not a prop set inside a dto
 */
