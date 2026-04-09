import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { RequestUser } from '../auth/current-user.decorator';
import { ACTION_TYPES } from '../audit-log/audit-log.constants';
import { AuditLogService } from '../audit-log/audit-log.service';
import { Task } from '../database/task.entity';
import { Role, User } from '../database/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepo: Repository<Task>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(dto: CreateTaskDto, actor: RequestUser): Promise<Task> {
    let assignedUser: User | null = null;
    if (dto.assignedUserId) {
      assignedUser = await this.usersRepo.findOne({ where: { id: dto.assignedUserId } });
      if (!assignedUser) throw new NotFoundException('Assigned user not found');
    }

    const task = this.tasksRepo.create({
      title: dto.title,
      description: dto.description,
      assignedUser,
    });
    const saved = await this.tasksRepo.save(task);

    await this.auditLogService.log(
      actor.id,
      ACTION_TYPES.TASK_CREATED,
      saved.id,
      undefined,
      { title: saved.title, description: saved.description, status: saved.status, assignedUserId: saved.assignedUser?.id },
    );

    return saved;
  }

  async findAll(actor: RequestUser): Promise<Task[]> {
    if (actor.role === Role.ADMIN) {
      return this.tasksRepo.find();
    }
    return this.tasksRepo.find({
      where: { assignedUser: { id: actor.id } },
    });
  }

  async findOne(id: string, actor: RequestUser): Promise<Task> {
    const task = await this.tasksRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    if (actor.role !== Role.ADMIN && task.assignedUser?.id !== actor.id) {
      throw new ForbiddenException('Access denied');
    }
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, actor: RequestUser): Promise<Task> {
    const task = await this.tasksRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    if (actor.role !== Role.ADMIN && task.assignedUser?.id !== actor.id) {
      throw new ForbiddenException('Access denied');
    }

    const dataBefore = { title: task.title, description: task.description, status: task.status, assignedUserId: task.assignedUser?.id };

    const statusChanged = dto.status !== undefined && dto.status !== task.status;
    const assignmentChanged = dto.assignedUserId !== undefined && dto.assignedUserId !== task.assignedUser?.id;

    if (actor.role === Role.USER) {
      if (dto.status !== undefined) task.status = dto.status;
    } else {
      if (dto.title !== undefined) task.title = dto.title;
      if (dto.description !== undefined) task.description = dto.description;
      if (dto.status !== undefined) task.status = dto.status;
      if (dto.assignedUserId !== undefined) {
        if (dto.assignedUserId === null) {
          task.assignedUser = null;
        } else {
          const user = await this.usersRepo.findOne({ where: { id: dto.assignedUserId } });
          if (!user) throw new NotFoundException('Assigned user not found');
          task.assignedUser = user;
        }
      }
    }

    const saved = await this.tasksRepo.save(task);
    const dataAfter = { title: saved.title, description: saved.description, status: saved.status, assignedUserId: saved.assignedUser?.id };

    let actionType: string = ACTION_TYPES.TASK_UPDATED;
    if (statusChanged && !assignmentChanged) actionType = ACTION_TYPES.STATUS_CHANGED;
    else if (assignmentChanged && !statusChanged) actionType = ACTION_TYPES.ASSIGNMENT_CHANGED;

    await this.auditLogService.log(actor.id, actionType, saved.id, dataBefore, dataAfter);

    return saved;
  }

  async remove(id: string, actor: RequestUser): Promise<{ message: string }> {
    const task = await this.tasksRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    const dataBefore = { title: task.title, description: task.description, status: task.status, assignedUserId: task.assignedUser?.id };

    await this.tasksRepo.remove(task);

    await this.auditLogService.log(actor.id, ACTION_TYPES.TASK_DELETED, id, dataBefore, undefined);

    return { message: `Task: ${task.title} deleted successfully` };
  }
}
