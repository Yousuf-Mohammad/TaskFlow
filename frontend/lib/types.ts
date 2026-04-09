export type Role = 'ADMIN' | 'USER';
export type TaskStatus = 'PENDING' | 'PROCESSING' | 'DONE';

export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedUser: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actor: User;
  actionType: string;
  targetTaskId: string;
  dataBefore: Record<string, any> | null;
  dataAfter: Record<string, any> | null;
  createdAt: string;
}

export interface AuthPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status: TaskStatus;
  assignedUserId?: string | null;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // role: Role;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: Role;
}
