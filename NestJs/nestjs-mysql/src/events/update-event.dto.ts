import { PartialType } from "@nestjs/mapped-types";
import { CreateEventDto } from './create-event.dto';

// install npm i --save @nestjs/mapped-types
// It helps you write less code 
// instead of copy and pasting CreateEventDto properties. 
// You can extends the partial type 
export class UpdateEventDto extends PartialType(CreateEventDto) {

}