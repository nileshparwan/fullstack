import { IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto {
    @IsString() // pipes 
    @IsNotEmpty()
    title:string; 

    @IsString()
    @IsNotEmpty()
    description:string;
}