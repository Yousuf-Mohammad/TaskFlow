import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../database/user.entity';
export declare class AuthService {
    private readonly usersRepo;
    private readonly jwtService;
    constructor(usersRepo: Repository<User>, jwtService: JwtService);
    login(email: string, password: string): Promise<{
        access_token: string;
    }>;
}
