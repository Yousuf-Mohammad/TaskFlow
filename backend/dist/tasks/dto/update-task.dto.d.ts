import { TaskStatus } from '../../database/task.entity';
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
    assignedUserId?: string;
}
