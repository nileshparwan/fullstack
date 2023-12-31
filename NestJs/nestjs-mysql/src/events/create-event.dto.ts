import { IsDateString, IsString, Length, length } from "class-validator";

export class CreateEventDto {
    @IsString()
    @Length(5, 255, {message: "The name length is wrong"})
    name: string;

    @Length(5, 255)
    description: string;

    @IsDateString()
    when: string;

    // @Length(5, 255, { groups: ['create'] })
    // @Length(10, 255, { groups: ['update'] })
    address: string;
}