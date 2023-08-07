import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStatus } from "./model";
import { CreateTaskDto } from "./dto";
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TaskService {

    private tasks: Array<Task> = [];

    getAllTasks(): Array<Task> {
        return [...this.tasks];
    }

    getTaskById(id: string): Task {
        const task = this.tasks.find(ts => ts.id === id);

        if (!task) {
            throw new HttpException(
                "Could not find task with the provided id, please try again",
                HttpStatus.NOT_FOUND
            )
        }

        return task;
    }

    getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
        const { status, search } = filterDto;

        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(ts => ts.status === status); 
        }

        if (search) {
            tasks = tasks.filter(ts => {
                if (
                    ts.title.toLowerCase().includes(search.toLowerCase()) || 
                    ts.description.toLowerCase().includes(search.toLowerCase()) 
                ) {
                    return true; 
                } 

                return false; 
            })
        }

        return tasks;
    }

    createTask(dto: CreateTaskDto): Task {
        const task: Task = {
            id: uuidv4(),
            title: dto.title,
            description: dto.description,
            status: TaskStatus.OPEN
        }

        this.tasks.push(task);

        return task;
    }

    updateTaskStatus(id: string, status: TaskStatus) {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }

    deleteTask(id: string) {
        this.tasks = this.tasks.filter(ts => ts.id !== id);
    }

}