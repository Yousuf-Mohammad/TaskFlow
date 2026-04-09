import { Repository } from 'typeorm';
import { User } from '../database/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly usersRepo;
    constructor(usersRepo: Repository<User>);
    findAll(): Promise<Omit<User, 'password'>[]>;
    create(dto: CreateUserDto): Promise<Omit<User, 'password'>>;
    update(id: string, dto: UpdateUserDto): Promise<Omit<User, 'password'>>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
