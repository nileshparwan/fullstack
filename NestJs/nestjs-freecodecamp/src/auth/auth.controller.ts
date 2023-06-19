import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authservice: AuthService
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signIn(@Body() dto:AuthDto) {
        return this.authservice.signin(dto);
    }

    @Post('signup')
    signup(@Body() dto:AuthDto) {
        return this.authservice.signup(dto);
    }

}


/**
 * Pipes
 * @Body('password', ParseInt) password: string 
 * ParseInt is one type of pipes and it transform the password above to a number 
 */