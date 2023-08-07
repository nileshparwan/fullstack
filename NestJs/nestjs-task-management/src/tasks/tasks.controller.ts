import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { TaskService } from "./tasks.service";
import { Task, TaskStatus } from "./model";
import { CreateTaskDto } from "./dto";
import { GetTaskFilterDto } from "./dto/get-tasks-filter.dto";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { TasksRepository } from './repository/task.repository';

@Controller("tasks")
export class TaskController {

    constructor(
        @InjectRepository(TasksRepository)
        private tasksRepository: TasksRepository,
        private readonly taskservice: TaskService
    ) { }

    @Get()
    getTasks(@Query() filterDto: GetTaskFilterDto): Array<Task> {
        if (Object.keys(filterDto).length) {
            return this.taskservice.getTasksWithFilters(filterDto);
        } else {
            return this.taskservice.getAllTasks();
        }
    }

    @Get("/:id")
    getTaskById(@Param("id") id: string): Task {
        return this.taskservice.getTaskById(id)
    }

    @Post()
    createTask(
        @Body() dto: CreateTaskDto
    ): Task {
        return this.taskservice.createTask(dto)
    }

    @Patch("/:id/status")
    updateTaskStatus(
        @Param("id") id: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto
    ): Task {
        const { status } = updateTaskStatusDto;
        return this.taskservice.updateTaskStatus(id, status)
    }


    @Delete("/:id")
    deleteTask(@Param("id") id: string): void {
        return this.taskservice.deleteTask(id)
    }

}