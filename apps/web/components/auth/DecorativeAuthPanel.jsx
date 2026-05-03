export default function DecorativeAuthPanel({ title, subtitle }) {
  return (
    <aside className="relative hidden min-h-[760px] w-1/2 flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#ecebfb] via-[#e8e6ff] to-[#dee7ff] p-8 shadow-xl md:flex md:p-10">
      <div className="absolute -top-16 -right-12 h-56 w-56 rounded-full bg-violet-300/40 blur-2xl" />
      <div className="absolute top-1/3 -left-14 h-48 w-48 rounded-full bg-indigo-300/30 blur-2xl" />
      <div className="absolute -bottom-20 left-1/4 h-72 w-72 rounded-full bg-sky-200/25 blur-3xl" />

      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold text-white">T</div>
        <p className="text-[34px] font-semibold tracking-tight text-slate-900">TeamHub</p>
      </div>

      <div className="relative z-10 mt-16 max-w-sm">
        <h2 className="text-5xl font-bold leading-tight text-slate-900">{title}</h2>
        <p className="mt-4 max-w-xs text-base leading-relaxed text-slate-600">{subtitle}</p>
      </div>

      <div className="relative z-10 mt-auto grid gap-4">
        <div className="rounded-2xl border border-white/60 bg-white/45 p-4 shadow-lg backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Team Dashboard</p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-900">72%</p>
              <p className="text-sm text-slate-600">Overall progress</p>
            </div>
            <div className="h-12 w-24 rounded-lg bg-gradient-to-tr from-indigo-500/30 to-violet-500/40" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/60 bg-white/55 p-3 text-center shadow-md backdrop-blur-md">
            <p className="text-xs text-slate-500">Tasks</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">24</p>
          </div>
          <div className="rounded-xl border border-white/60 bg-white/55 p-3 text-center shadow-md backdrop-blur-md">
            <p className="text-xs text-slate-500">Online</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">8</p>
          </div>
          <div className="rounded-xl border border-white/60 bg-white/55 p-3 text-center shadow-md backdrop-blur-md">
            <p className="text-xs text-slate-500">Goals</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">5</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
