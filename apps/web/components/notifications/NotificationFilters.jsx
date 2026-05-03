"use client";

const filters = ["All", "Unread", "Mentions", "Roles", "Tasks", "Announcements"];

export default function NotificationFilters({ activeFilter, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => {
        const active = activeFilter === filter;
        return (
          <button
            key={filter}
            onClick={() => onChange(filter)}
            className={`cursor-pointer rounded-xl px-3 py-2 text-sm font-medium transition ${
              active ? "bg-violet-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
