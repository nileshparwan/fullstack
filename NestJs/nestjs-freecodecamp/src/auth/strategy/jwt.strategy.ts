import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt'
) {

    constructor(
        config: ConfigService, // super cannot read this.config that is why we did not put private
        private readonly prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // ignoreExpiration: false,
            secretOrKey: config.get("JWT_SECRET"),
        })
    }

    async validate(payload: any) {
        let user; 

        try {
            user = await this.prisma.user.findUnique({
                where: {
                    id: payload.sub
                }
            }); 
        } catch (error) {
            throw new HttpException(
                "Couldn't fetch information", 
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }

        if (!user){
            throw new HttpException(
                "Invalid credentials", 
                HttpStatus.UNAUTHORIZED
            )
        }

        delete user.hash

        return user;
    }
}