import { User } from './user.entity';
export declare class AuditLog {
    id: string;
    actor: User;
    actionType: string;
    targetTaskId: string;
    dataBefore: Record<string, any> | null;
    dataAfter: Record<string, any> | null;
    createdAt: Date;
}
