'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Navbar from '@/components/shared/Navbar';
import TaskTable from '@/components/admin/TaskTable';
import TaskFormModal from '@/components/admin/TaskFormModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks, deleteTask } from '@/store/slices/tasksSlice';
import { fetchUsers } from '@/store/slices/usersSlice';
import type { Task } from '@/lib/types';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((s) => s.tasks.items);
  const isLoading = useAppSelector((s) => s.tasks.isLoading);
  const users = useAppSelector((s) => s.users.items);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      toast.success('Task deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete task');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(undefined);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Task Management</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl px-5 py-2.5 bg-[#3064E8] hover:bg-blue-700 text-white font-semibold text-sm active:scale-95 transition-all duration-150"
            >
              + Create Task
            </button>
          </div>

          <TaskTable
            tasks={tasks}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <TaskFormModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            task={selectedTask}
            users={users}
          />
        </main>
    </div>
  );
}
