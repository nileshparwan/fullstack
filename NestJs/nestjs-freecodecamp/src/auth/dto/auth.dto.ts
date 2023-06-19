import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string; 

    @IsString()
    @IsNotEmpty()
    password: string; 
}


/**
 * npm i --save class-validator class-transformer
 * Also counts as a pipe. 
 * Pipes like above won't work unless allowed globally 
 */