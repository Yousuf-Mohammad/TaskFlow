import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../../database/task.entity';

export class CreateTaskDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  assignedUserId?: string;
}
