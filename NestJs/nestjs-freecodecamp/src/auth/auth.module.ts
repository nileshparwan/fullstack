import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from './auth.controller';
import { AuthService } from "./auth.service";
// import { AuthGuard } from "./auth.guard";
import { JwtStrategy } from "./strategy";

@Module({
    // imports:[PrismaModule], // nextjs is modular so to use prisma just add the module in the import
    imports: [
        JwtModule.register({
            global: true
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports:[]
})

export class AuthModule { }

// import is commented because, we've allowed the prisma module to be accessible 
// anywhere inside the code by using the Global() decorator..