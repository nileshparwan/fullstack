import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // when using pipes, for example, @IsString(), etc. 
  // we need to inform nest to perform its validation 
  app.useGlobalPipes(new ValidationPipe()); 

  await app.listen(3333);
}
bootstrap();
