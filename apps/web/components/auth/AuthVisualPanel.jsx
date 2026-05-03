function BrandMark() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/30 backdrop-blur-sm">
      <div className="grid grid-cols-2 gap-0.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/85" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/85" />
        <span className="h-2.5 w-2.5 rounded-full bg-white" />
      </div>
    </div>
  );
}

function FeaturePill({ text }) {
  return (
    <div className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
      {text}
    </div>
  );
}

function FloatingCard({ title, value, className = "" }) {
  return (
    <div className={`rounded-xl border border-white/25 bg-white/15 p-3 shadow-xl backdrop-blur-md ${className}`}>
      <p className="text-[11px] text-white/80">{title}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

const CONTENT = {
  login: {
    title: "Welcome back to your team workspace",
    subtitle: "Track goals, manage tasks, and collaborate with your team in real time.",
  },
  register: {
    title: "Start building better teamwork today",
    subtitle: "Create your workspace, invite your team, and keep every goal moving forward.",
  },
};

export default function AuthVisualPanel({ variant = "login" }) {
  const data = CONTENT[variant] || CONTENT.login;

  return (
    <aside className="relative hidden h-full min-h-[620px] flex-col overflow-hidden bg-gradient-to-br from-sky-400 via-sky-500 to-cyan-500 p-7 text-white lg:flex lg:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute -right-12 -top-10 h-56 w-56 rounded-full bg-sky-200/35 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-14 translate-y-10 rounded-full bg-cyan-200/35 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-100/30 blur-3xl" />

      <div className="relative z-10 flex items-center gap-3">
        <BrandMark />
        <p className="text-xl font-semibold tracking-tight">TeamHub</p>
      </div>

      <div className="relative z-10 mt-10 max-w-md">
        <h2 className="text-4xl font-bold leading-tight">{data.title}</h2>
        <p className="mt-4 max-w-sm text-base leading-relaxed text-white/80">{data.subtitle}</p>
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap gap-2.5">
        <FeaturePill text="Real-time collaboration" />
        <FeaturePill text="Goal tracking" />
        <FeaturePill text="Team announcements" />
      </div>

      <div className="relative z-10 mt-auto grid grid-cols-2 gap-3">
        <FloatingCard title="Goal progress" value="72% this sprint" className="translate-y-1" />
        <FloatingCard title="Members online" value="3 now" className="-translate-y-1" />
        <FloatingCard title="Announcements" value="New announcement pinned" className="-translate-y-2" />
        <FloatingCard title="Tasks" value="5 completed this week" className="translate-y-2" />
      </div>
    </aside>
  );
}
