"use client";

import ActionItemCard from "./ActionItemCard";

const columns = [
  { key: "TODO", title: "To Do" },
  { key: "IN_PROGRESS", title: "In Progress" },
  { key: "DONE", title: "Done" },
  { key: "BLOCKED", title: "Blocked" },
];

export default function ActionItemsKanban({ items, onStatusChange, onDelete, onEdit }) {
  return (
    <div className="grid gap-5 xl:grid-cols-4">
      {columns.map((column) => {
        const columnItems = items.filter((item) => item.status === column.key);

        return (
          <section key={column.key} className="rounded-3xl bg-slate-100/70 p-4 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 dark:text-slate-100">{column.title}</h2>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {columnItems.length}
              </span>
            </div>

            <div className="space-y-4">
              {columnItems.map((item) => (
                <ActionItemCard
                  key={item.id}
                  item={item}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}

              {columnItems.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-5 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                  No items
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
