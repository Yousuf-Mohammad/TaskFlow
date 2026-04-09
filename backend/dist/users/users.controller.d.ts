import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<Omit<import("../database/user.entity").User, "password">[]>;
    create(dto: CreateUserDto): Promise<Omit<import("../database/user.entity").User, "password">>;
    update(id: string, dto: UpdateUserDto): Promise<Omit<import("../database/user.entity").User, "password">>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
