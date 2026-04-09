import { Repository } from 'typeorm';
import { AuditLog } from '../database/audit-log.entity';
export declare class AuditLogService {
    private readonly auditRepo;
    constructor(auditRepo: Repository<AuditLog>);
    log(actorId: string, actionType: string, targetTaskId: string, dataBefore?: Record<string, any>, dataAfter?: Record<string, any>): Promise<void>;
    findAll(): Promise<AuditLog[]>;
}
