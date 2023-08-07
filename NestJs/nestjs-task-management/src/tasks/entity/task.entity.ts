import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "../model";

@Entity() 
export class TaskEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string; 

    @Column()
    title: string; 

    @Column()
    description:string; 

    @Column()
    status: TaskStatus; 
}


// entity is used for database, to configure the table