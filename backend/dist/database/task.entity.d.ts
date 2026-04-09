import { User } from './user.entity';
export declare enum TaskStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    DONE = "DONE"
}
export declare class Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    assignedUser: User | null;
    assignedUserId: string | null;
    createdAt: Date;
    updatedAt: Date;
}
