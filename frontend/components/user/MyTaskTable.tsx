'use client';

import type { Task, TaskStatus } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  tasks: Task[];
  isLoading: boolean;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const STATUS_OPTIONS: TaskStatus[] = ['PENDING', 'PROCESSING', 'DONE'];

const STATUS_PILL: Record<TaskStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
};

export default function MyTaskTable({ tasks, isLoading, onStatusChange }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/80">
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 4 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-slate-500 py-10">
                No tasks assigned to you yet
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell className="text-slate-600">
                  {task.description && task.description.length > 50
                    ? task.description.slice(0, 50) + '...'
                    : task.description}
                </TableCell>
                <TableCell>
                  <Select
                    value={task.status}
                    onValueChange={(val) => onStatusChange(task.id, val as TaskStatus)}
                  >
                    <SelectTrigger className="w-fit border-0 shadow-none bg-transparent p-0 h-auto gap-1 focus-visible:ring-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_PILL[task.status]}`}>
                        {task.status}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((value) => (
                        <SelectItem key={value} value={value}>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_PILL[value]}`}>
                            {value}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {new Date(task.updatedAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
