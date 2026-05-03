"use client";

export default function AuditLogFilters({
  filters,
  setFilters,
  workspaces,
  onApply,
  onExport,
}) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3 dark:border-slate-800 dark:bg-slate-900">
      <select
        value={filters.workspaceId}
        onChange={(e) => setFilters((prev) => ({ ...prev, workspaceId: e.target.value }))}
        className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      >
        <option value="">All Workspaces</option>
        {workspaces.map((workspace) => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={filters.entityType}
        onChange={(e) => setFilters((prev) => ({ ...prev, entityType: e.target.value }))}
        placeholder="Entity type"
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />

      <input
        type="text"
        value={filters.action}
        onChange={(e) => setFilters((prev) => ({ ...prev, action: e.target.value }))}
        placeholder="Action"
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />

      <input
        type="date"
        value={filters.startDate}
        onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
        className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />

      <input
        type="date"
        value={filters.endDate}
        onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
        className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onApply}
          className="w-full cursor-pointer rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white dark:bg-slate-700"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={onExport}
          className="w-full cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}
