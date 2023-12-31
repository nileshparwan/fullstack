import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { AppJanpanService } from './app.japan.service';
import { AppDummy } from './app.dummy';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load:[ormConfig], // this is for loading many config file
      expandVariables: true
      // ignoreEnvFile: true // ignores the .env file
      // envFilePath: ".env", // if i want to load only one config file

    }),
    TypeOrmModule.forRootAsync({
      useFactory: process.env.NODE_ENV !== 'production'
        ? ormConfig : ormConfigProd
    }),
    EventsModule
  ],
  controllers: [AppController],
  providers: [{
    provide: AppService,
    useClass: AppJanpanService
  }, {
    provide: 'APP_NAME',
    useValue: 'Nest Events Backend!'
  }, {
    provide: 'MESSAGE',
    inject: [AppDummy],
    useFactory: (app) => `${app.dummy()} Factory!`
  }, AppDummy],
})
export class AppModule { }
