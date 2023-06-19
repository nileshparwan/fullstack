import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
export declare class AuthController {
    private readonly authservice;
    constructor(authservice: AuthService);
    signIn(dto: AuthDto): Promise<{
        access_token: string;
    }>;
    signup(dto: AuthDto): Promise<{
        access_token: string;
    }>;
}
