import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../database/audit-log.entity';
import { User } from '../database/user.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async log(
    actorId: string,
    actionType: string,
    targetTaskId: string,
    dataBefore?: Record<string, any>,
    dataAfter?: Record<string, any>,
  ): Promise<void> {
    const log = new AuditLog();
    log.actor = { id: actorId } as User;
    log.actionType = actionType;
    log.targetTaskId = targetTaskId;
    log.dataBefore = dataBefore ?? null;
    log.dataAfter = dataAfter ?? null;
    await this.auditRepo.save(log);
  }

  findAll(): Promise<AuditLog[]> {
    return this.auditRepo.find({
      relations: ['actor'],
      order: { createdAt: 'DESC' },
    });
  }
}
