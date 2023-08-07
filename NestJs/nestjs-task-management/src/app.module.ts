import { Module } from '@nestjs/common';
import { TaskModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TaskModule, 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres-dev-db',
      port: 5432, 
      username: 'admin', 
      password: 'admin', 
      database: "task-management", 
      autoLoadEntities: true, 
      synchronize: true
    })
  ]
})
export class AppModule {}

// all custom module must be referenced in the import array 