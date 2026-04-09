'use client';

import { useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import AuditLogTable from '@/components/admin/AuditLogTable';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAuditLogs } from '@/store/slices/auditLogSlice';
import { Button } from '@/components/ui/button';

export default function AuditLogsPage() {
  const dispatch = useAppDispatch();
  const logs = useAppSelector((s) => s.auditLogs.items);
  const isLoading = useAppSelector((s) => s.auditLogs.isLoading);

  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Audit Logs</h1>
            <Button variant="outline" onClick={() => dispatch(fetchAuditLogs())}>
              Refresh
            </Button>
          </div>

          <AuditLogTable logs={logs} isLoading={isLoading} />
        </main>
    </div>
  );
}
