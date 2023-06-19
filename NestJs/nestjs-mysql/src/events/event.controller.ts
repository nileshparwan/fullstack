import { Body, Controller, Delete, Get, HttpCode, Injectable, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, ValidationPipe } from "@nestjs/common";
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from "./update-event.dto";
import { Event } from "./event.entity";
import { Like, MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Controller('/api/events')
export class EventsController {

    private readonly logger = new Logger(EventsController.name);

    constructor(
        @InjectRepository(Event)
        private repository: Repository<Event>,
    ){

    }

    @Get()
    async findAll() {
        this.logger.log(`Hit the findAll route`);
        const events = await this.repository.find();
        this.logger.debug(`Found ${events.length} events`);
        return events;
    }

    @Get("/practice")
    async practice() {
        return await this.repository.find({
            select: ['id', 'when'],
            where: [{
                id: MoreThan(3),
                // when:`${MoreThan(new Date("2021-02-12T13:00:00"))}`
            }, {
                description: Like("%meet%")
            }],
            take: 2,
            // skip: 4, 
            order: {
                id: 'DESC'
            }
        })
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id:number) {
        const event = await this.repository.findOneBy({id})

        if (!event) {
            throw new NotFoundException();
        }

        return event;
    }

    // @UsePipes -> can use this also instead of new valid...
    @Post()
    async create(
        // @Body(new ValidationPipe({ groups: ['create'] }))
        input: CreateEventDto
    ) {
        return await this.repository.save({
            ...input,
            when: `${new Date(input.when)}`,
        })
    }

    // ValidationPipe, when u use custom validation u cannot use global validation ( main.ts )
    @Patch(':id')
    async update(
        @Param('id') id,
        // @Body(new ValidationPipe({ groups: ['update'] }))
        input: UpdateEventDto
    ) {
        const event = await this.repository.findOne(id);
        return this.repository.save({
            ...event, 
            ...input, 
            when: input.when ? `${new Date(input.when)}` : `${event.when}`
        });
    }

    @Delete(':id')
    @HttpCode(204) // delete uses 204 and normally when deleted we do not send data to the client
    async remove(@Param('id') id) {
        const event = await this.repository.findOne(id);

        if (!event) {
            throw new NotFoundException();
        }
 

        await this.repository.remove(event)
    }
}