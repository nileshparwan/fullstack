import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBookmarkDto {
    @IsString()
    @IsNotEmpty()
    title:string; 

    @IsString()
    @IsOptional()
    descriprion?:string; 

    @IsString()
    @IsNotEmpty()
    link: string; 

}