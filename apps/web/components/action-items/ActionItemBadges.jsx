const statusStyles = {
  TODO: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  IN_PROGRESS: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  DONE: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  BLOCKED: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
};

const priorityStyles = {
  LOW: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  MEDIUM: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  HIGH: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
  URGENT: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
};

const statusLabels = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  BLOCKED: "Blocked",
};

export function ActionStatusBadge({ status }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

export function ActionPriorityBadge({ priority }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[priority]}`}>
      {priority}
    </span>
  );
}
