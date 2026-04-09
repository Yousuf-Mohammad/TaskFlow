'use client';

import type { AuditLog } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  logs: AuditLog[];
  isLoading: boolean;
}

const ACTION_COLORS: Record<string, string> = {
  TASK_CREATED: 'bg-green-100 text-green-800',
  TASK_DELETED: 'bg-red-100 text-red-800',
  TASK_UPDATED: 'bg-blue-100 text-blue-800',
  STATUS_CHANGED: 'bg-yellow-100 text-yellow-800',
  ASSIGNMENT_CHANGED: 'bg-purple-100 text-purple-800',
};

function getDetails(log: AuditLog): string {
  switch (log.actionType) {
    case 'TASK_CREATED':
      return `Created "${log.dataAfter?.title}"`;
    case 'TASK_DELETED':
      return `Deleted "${log.dataBefore?.title}"`;
    case 'STATUS_CHANGED':
      return `${log.dataBefore?.status} → ${log.dataAfter?.status}`;
    case 'ASSIGNMENT_CHANGED':
      return `Assigned to ${log.dataAfter?.assignedUser?.email ?? 'Unassigned'}`;
    default:
      return 'Updated';
  }
}

export default function AuditLogTable({ logs, isLoading }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/80">
            <TableHead>Timestamp</TableHead>
            <TableHead>Actor</TableHead>
            <TableHead>Action Type</TableHead>
            <TableHead>Task ID</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-slate-500 py-10">
                No audit logs found
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-sm text-slate-600 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>{log.actor?.email ?? 'Unknown'}</TableCell>
                <TableCell>
                  <Badge className={ACTION_COLORS[log.actionType] ?? 'bg-slate-100 text-slate-800'}>
                    {log.actionType}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {log.targetTaskId.slice(0, 8)}...
                </TableCell>
                <TableCell className="text-sm text-slate-700">
                  {getDetails(log)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
