import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtGuard } from "src/auth/guard";
import { GetUser } from "src/auth/decorator";
import { User } from "@prisma/client";
import { EditUserDto } from "./dto";

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userservice: UserService) { }

    @Get("me")
    getMe(
        @GetUser() user: User,
        @GetUser("email") email
    ) {
        console.log(email);
        return user;
    }

    @Patch("edit")
    editUser(@GetUser('id') userId:number, @Body() dto:EditUserDto) {
        console.log(userId);
        return this.userservice.editUser(userId, dto)
    }
}