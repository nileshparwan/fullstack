import { ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as argon from 'argon2';

import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService
    ) { }

    async signup(dto: AuthDto) {
        let user, hash;

        // generate the password hash
        try {
            hash = await argon.hash(dto.password);
        } catch (error) {
            throw new HttpException(
                "Could not create user, please try again",
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }

        // save user in the db
        try {
            user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash
                }
            })
        } catch (error) {
            // don't need to catch all errors. Below is for unique fields only. 
            if (error instanceof PrismaClientKnownRequestError) {

                // prisma has error code for known errors
                // this error code is specific to unique fields 
                if (error.code === "P2002") {

                    // comes from nestjs
                    throw new ForbiddenException(
                        "Credential taken"
                    )
                }
            }

            console.log("here");
            throw error;
        }

        // delete user.hash;
        return await this.signToken(user.id, user.email);
    }

    async signin(dto: AuthDto) {
        let user, pwdMatch;

        // find the user by email
        try {
            user = await this.prisma.user.findUnique({
                where: {
                    email: dto.email
                }
            });
        } catch (error) {
            throw new HttpException(
                "Signin up failed, please try again later",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        // if user does not exist throw exceptions
        if (!user) {
            throw new HttpException(
                "Could not identified user. Credential seems to be wrong",
                HttpStatus.UNAUTHORIZED
            );
        }

        // compare password
        try {
            // hash is taken from user db
            pwdMatch = await argon.verify(user.hash, dto.password);
        } catch (error) {
            throw new HttpException(
                "Could not log you in, please check your credentials and try again",
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }

        // if password incorrect throw exceptions
        if (!pwdMatch) {
            throw new HttpException(
                "Invalid credentials, could not log you in",
                HttpStatus.FORBIDDEN
            )
        }

        // delete user.hash;
        return await this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{access_token: string}> {
        let token: string;

        const payload = {
            sub: userId, // sub comes from jwt, use to store id
            email
        }

        try {
            token = await this.jwt.signAsync(payload, {
                secret: this.config.get("JWT_SECRET"),
                expiresIn: '1hr'
            });
        } catch (error) {
            throw new HttpException(
                "Signin up failed, please try again later",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        return {
            access_token: token
        };
    }

}


// to get access to the prisma service. We make use of dependency injection