'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Navbar from '@/components/shared/Navbar';
import UserTable from '@/components/admin/UserTable';
import UserFormModal from '@/components/admin/UserFormModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUsers, deleteUser } from '@/store/slices/usersSlice';
import type { User } from '@/lib/types';

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((s) => s.users.items);
  const isLoading = useAppSelector((s) => s.users.isLoading);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success('User deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">User Management</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl px-5 py-2.5 bg-[#3064E8] hover:bg-blue-700 text-white font-semibold text-sm active:scale-95 transition-all duration-150"
            >
              + Add User
            </button>
          </div>

          <UserTable
            users={users}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <UserFormModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            user={selectedUser}
          />
        </main>
    </div>
  );
}
