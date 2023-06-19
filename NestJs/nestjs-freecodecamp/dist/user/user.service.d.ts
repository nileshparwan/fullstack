import { PrismaService } from "src/prisma/prisma.service";
import { EditUserDto } from "./dto";
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    editUser(userId: number, dto: EditUserDto): Promise<any>;
}
