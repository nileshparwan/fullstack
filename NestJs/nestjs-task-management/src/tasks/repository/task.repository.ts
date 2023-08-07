import { Repository } from 'typeorm';
import { TaskEntity } from '../entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksRepository extends Repository<TaskEntity> {

}