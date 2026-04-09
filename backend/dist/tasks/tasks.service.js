"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_log_constants_1 = require("../audit-log/audit-log.constants");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const task_entity_1 = require("../database/task.entity");
const user_entity_1 = require("../database/user.entity");
let TasksService = class TasksService {
    tasksRepo;
    usersRepo;
    auditLogService;
    constructor(tasksRepo, usersRepo, auditLogService) {
        this.tasksRepo = tasksRepo;
        this.usersRepo = usersRepo;
        this.auditLogService = auditLogService;
    }
    async create(dto, actor) {
        let assignedUser = null;
        if (dto.assignedUserId) {
            assignedUser = await this.usersRepo.findOne({ where: { id: dto.assignedUserId } });
            if (!assignedUser)
                throw new common_1.NotFoundException('Assigned user not found');
        }
        const task = this.tasksRepo.create({
            title: dto.title,
            description: dto.description,
            assignedUser,
        });
        const saved = await this.tasksRepo.save(task);
        await this.auditLogService.log(actor.id, audit_log_constants_1.ACTION_TYPES.TASK_CREATED, saved.id, undefined, { title: saved.title, description: saved.description, status: saved.status, assignedUserId: saved.assignedUser?.id });
        return saved;
    }
    async findAll(actor) {
        if (actor.role === user_entity_1.Role.ADMIN) {
            return this.tasksRepo.find();
        }
        return this.tasksRepo.find({
            where: { assignedUser: { id: actor.id } },
        });
    }
    async findOne(id, actor) {
        const task = await this.tasksRepo.findOne({ where: { id } });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        if (actor.role !== user_entity_1.Role.ADMIN && task.assignedUser?.id !== actor.id) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return task;
    }
    async update(id, dto, actor) {
        const task = await this.tasksRepo.findOne({ where: { id } });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        if (actor.role !== user_entity_1.Role.ADMIN && task.assignedUser?.id !== actor.id) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const dataBefore = { title: task.title, description: task.description, status: task.status, assignedUserId: task.assignedUser?.id };
        const statusChanged = dto.status !== undefined && dto.status !== task.status;
        const assignmentChanged = dto.assignedUserId !== undefined && dto.assignedUserId !== task.assignedUser?.id;
        if (actor.role === user_entity_1.Role.USER) {
            if (dto.status !== undefined)
                task.status = dto.status;
        }
        else {
            if (dto.title !== undefined)
                task.title = dto.title;
            if (dto.description !== undefined)
                task.description = dto.description;
            if (dto.status !== undefined)
                task.status = dto.status;
            if (dto.assignedUserId !== undefined) {
                if (dto.assignedUserId === null) {
                    task.assignedUser = null;
                }
                else {
                    const user = await this.usersRepo.findOne({ where: { id: dto.assignedUserId } });
                    if (!user)
                        throw new common_1.NotFoundException('Assigned user not found');
                    task.assignedUser = user;
                }
            }
        }
        const saved = await this.tasksRepo.save(task);
        const dataAfter = { title: saved.title, description: saved.description, status: saved.status, assignedUserId: saved.assignedUser?.id };
        let actionType = audit_log_constants_1.ACTION_TYPES.TASK_UPDATED;
        if (statusChanged && !assignmentChanged)
            actionType = audit_log_constants_1.ACTION_TYPES.STATUS_CHANGED;
        else if (assignmentChanged && !statusChanged)
            actionType = audit_log_constants_1.ACTION_TYPES.ASSIGNMENT_CHANGED;
        await this.auditLogService.log(actor.id, actionType, saved.id, dataBefore, dataAfter);
        return saved;
    }
    async remove(id, actor) {
        const task = await this.tasksRepo.findOne({ where: { id } });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        const dataBefore = { title: task.title, description: task.description, status: task.status, assignedUserId: task.assignedUser?.id };
        await this.tasksRepo.remove(task);
        await this.auditLogService.log(actor.id, audit_log_constants_1.ACTION_TYPES.TASK_DELETED, id, dataBefore, undefined);
        return { message: `Task: ${task.title} deleted successfully` };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        audit_log_service_1.AuditLogService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map