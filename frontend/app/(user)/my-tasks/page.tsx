'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import Navbar from '@/components/shared/Navbar';
import MyTaskTable from '@/components/user/MyTaskTable';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks, updateTask } from '@/store/slices/tasksSlice';
import type { TaskStatus } from '@/lib/types';

export default function MyTasksPage() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((s) => s.tasks.items);
  const isLoading = useAppSelector((s) => s.tasks.isLoading);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const onStatusChange = async (id: string, status: TaskStatus) => {
    try {
      await dispatch(updateTask({ id, status })).unwrap();
      toast.success('Status updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
          <MyTaskTable
            tasks={tasks}
            isLoading={isLoading}
            onStatusChange={onStatusChange}
          />
        </main>
    </div>
  );
}
