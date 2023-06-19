import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from "./update-event.dto";
import { Event } from "./event.entity";
import { Repository } from "typeorm";
export declare class EventsController {
    private repository;
    private readonly logger;
    constructor(repository: Repository<Event>);
    findAll(): Promise<Event[]>;
    practice(): Promise<Event[]>;
    findOne(id: number): Promise<Event>;
    create(input: CreateEventDto): Promise<{
        when: string;
        name: string;
        description: string;
        address: string;
    } & Event>;
    update(id: any, input: UpdateEventDto): Promise<{
        when: string;
        name: string;
        description: string;
        address: string;
        id: number;
        attendees: import("./attendee.entity").Attendee[];
    } & Event>;
    remove(id: any): Promise<void>;
}
