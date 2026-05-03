"use client";

import { Activity, Database, User } from "lucide-react";

export default function AuditLogTimeline({ logs }) {
  if (logs.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-violet-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
          <Activity size={28} />
        </div>
        <h2 className="mt-5 text-xl font-bold text-slate-900">No audit logs found</h2>
        <p className="mt-2 text-sm text-slate-500">
          Admin and workspace-level actions will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Audit Timeline</h2>
        <p className="text-sm text-slate-500">
          Track admin actions and workspace-level events.
        </p>
      </div>

      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="relative rounded-2xl border border-slate-100 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                <Database size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-bold text-slate-900">{log.action}</h3>
                  <span className="text-xs font-medium text-slate-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {log.entityType}
                  </span>

                  {log.workspace && (
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                      {log.workspace.name}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <User size={15} />
                  <span>{log.user?.email || "System"}</span>
                </div>

                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <pre className="mt-4 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}