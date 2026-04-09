import { Repository } from 'typeorm';
import type { RequestUser } from '../auth/current-user.decorator';
import { AuditLogService } from '../audit-log/audit-log.service';
import { Task } from '../database/task.entity';
import { User } from '../database/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private readonly tasksRepo;
    private readonly usersRepo;
    private readonly auditLogService;
    constructor(tasksRepo: Repository<Task>, usersRepo: Repository<User>, auditLogService: AuditLogService);
    create(dto: CreateTaskDto, actor: RequestUser): Promise<Task>;
    findAll(actor: RequestUser): Promise<Task[]>;
    findOne(id: string, actor: RequestUser): Promise<Task>;
    update(id: string, dto: UpdateTaskDto, actor: RequestUser): Promise<Task>;
    remove(id: string, actor: RequestUser): Promise<{
        message: string;
    }>;
}
