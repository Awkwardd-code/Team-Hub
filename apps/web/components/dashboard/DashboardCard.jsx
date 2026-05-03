export default function DashboardCard({ title, action, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3> : <span />}
          {action ? <div>{action}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}
