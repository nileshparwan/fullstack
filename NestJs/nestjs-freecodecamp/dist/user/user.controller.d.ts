import { UserService } from "./user.service";
import { User } from "@prisma/client";
import { EditUserDto } from "./dto";
export declare class UserController {
    private readonly userservice;
    constructor(userservice: UserService);
    getMe(user: User, email: any): User;
    editUser(userId: number, dto: EditUserDto): Promise<any>;
}
