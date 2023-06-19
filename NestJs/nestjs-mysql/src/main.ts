import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug']
  }); 
  app.useGlobalPipes(new ValidationPipe()); 
  // adding validation on all @body -> global validation 
  await app.listen(3000);
}

bootstrap();
