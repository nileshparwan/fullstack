import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './products/products.module';

@Module({
  imports: [ProductModule], // all module must be added here for it to work.
  controllers: [AppController], // handle requests
  providers: [AppService], // extra services and classes
})

export class AppModule { }
