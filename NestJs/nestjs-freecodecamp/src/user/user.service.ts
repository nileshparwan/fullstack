import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EditUserDto } from "./dto";

@Injectable()
export class UserService {

    constructor(private readonly prisma:PrismaService) {

    }

    async editUser(userId: number, dto: EditUserDto) {
        let user; 

        console.log(dto);

        try {
            user = await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    ...dto
                }
            })
        } catch (error) {
            throw new  HttpException(
                "Something went wrong",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        if(!user){
            throw new  HttpException(
                "Could not found user",
                HttpStatus.NOT_FOUND
            );
        }

        delete user.hash; 

        return user;

    }


}