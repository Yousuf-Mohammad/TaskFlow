import { TaskStatus } from '../../database/task.entity';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    status?: TaskStatus;
    assignedUserId?: string;
}
