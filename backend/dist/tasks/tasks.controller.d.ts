import type { RequestUser } from '../auth/current-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(dto: CreateTaskDto, user: RequestUser): Promise<import("../database/task.entity").Task>;
    findAll(user: RequestUser): Promise<import("../database/task.entity").Task[]>;
    findOne(id: string, user: RequestUser): Promise<import("../database/task.entity").Task>;
    update(id: string, dto: UpdateTaskDto, user: RequestUser): Promise<import("../database/task.entity").Task>;
    remove(id: string, user: RequestUser): Promise<{
        message: string;
    }>;
}
