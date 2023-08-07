import { Module } from "@nestjs/common";
import { TaskController } from "./tasks.controller";
import { TaskService } from "./tasks.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TasksRepository } from "./repository/task.repository";
import { TaskEntity } from './entity/task.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TasksRepository,
            TaskEntity
        ])
    ],
    controllers: [TaskController],
    providers: [TaskService], 
})

export class TaskModule { }