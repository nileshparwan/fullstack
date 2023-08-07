import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../model"

export class GetTaskFilterDto {
    @IsString()
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsString()
    @IsOptional()
    search?: string; 
}