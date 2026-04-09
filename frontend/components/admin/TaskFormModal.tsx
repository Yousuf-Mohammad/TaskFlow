'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { createTask, updateTask } from '@/store/slices/tasksSlice';
import type { Task, User, TaskStatus } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  users: User[];
}

const STATUS_OPTIONS: TaskStatus[] = ['PENDING', 'PROCESSING', 'DONE'];

export default function TaskFormModal({ isOpen, onClose, task, users }: Props) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('PENDING');
  const [assignedUserId, setAssignedUserId] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setStatus(task.status);
      setAssignedUserId(task.assignedUser?.id ?? 'none');
    } else {
      setTitle('');
      setDescription('');
      setStatus('PENDING');
      setAssignedUserId('none');
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      title,
      description,
      status,
      assignedUserId: assignedUserId && assignedUserId !== 'none' ? assignedUserId : null,
    };

    try {
      if (task) {
        await dispatch(updateTask({ id: task.id, ...formData })).unwrap();
        toast.success('Task updated successfully');
      } else {
        await dispatch(createTask(formData)).unwrap();
        toast.success('Task created successfully');
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 ">
            <Label>Assigned To</Label>
            <Select value={assignedUserId} onValueChange={(v) => setAssignedUserId(v as string)}>
              <SelectTrigger>
                <SelectValue placeholder="Unassigned">
                  {assignedUserId && assignedUserId !== 'none'
                    ? (() => {
                        const u = users.find((u) => u.id === assignedUserId);
                        if (!u) return 'Unassigned';
                        const name = [u.firstName, u.lastName].filter(Boolean).join(' ');
                        return name ? `${name} (${u.email})` : u.email;
                      })()
                    : 'Unassigned'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {users.map((user) => {
                  const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
                  return (
                    <SelectItem key={user.id} value={user.id}>
                      {name || user.email}
                      {/* {name && (
                        <span className="ml-1 text-slate-400 text-xs">({user.email})</span>
                      )} */}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
