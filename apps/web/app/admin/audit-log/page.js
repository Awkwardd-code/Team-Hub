"use client";

import { useEffect, useState } from "react";
import AdminRoute from "../../../components/auth/AdminRoute";
import DashboardShell from "../../../components/dashboard/DashboardShell";
import AuditLogFilters from "../../../components/admin/audit-log/AuditLogFilters";
import AuditLogSkeleton from "../../../components/admin/audit-log/AuditLogSkeleton";
import AuditLogTimeline from "../../../components/admin/audit-log/AuditLogTimeline";
import { auditLogApi } from "../../../features/audit-log/services/auditLogApi";
import { useAuditLogStore } from "../../../store/auditLogStore";
import { useWorkspaceStore } from "../../../store/workspaceStore";

export default function AdminAuditLogPage() {
  const { workspaces, fetchWorkspaces } = useWorkspaceStore();
  const { logs, loading, error, fetchLogs } = useAuditLogStore();

  const [filters, setFilters] = useState({
    workspaceId: "",
    entityType: "",
    action: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchWorkspaces();
    fetchLogs(filters);
  }, [fetchWorkspaces, fetchLogs]);

  function handleApplyFilters() {
    fetchLogs(filters);
  }

  function handleExport() {
    auditLogApi.exportCsv(filters);
  }

  return (
    <DashboardShell>
      <AdminRoute>
        <div className="mx-auto max-w-6xl space-y-6">
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Audit Log</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Track key admin actions and workspace-level events.
            </p>
          </header>

          <AuditLogFilters
            filters={filters}
            setFilters={setFilters}
            workspaces={workspaces}
            onApply={handleApplyFilters}
            onExport={handleExport}
          />

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {loading ? <AuditLogSkeleton /> : <AuditLogTimeline logs={logs} />}
        </div>
      </AdminRoute>
    </DashboardShell>
  );
}
