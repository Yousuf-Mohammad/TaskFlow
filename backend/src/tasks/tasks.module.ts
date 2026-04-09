import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { Task } from '../database/task.entity';
import { User } from '../database/user.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User]), AuditLogModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
