import {
  CheckCircle,
  KeyRound,
  Lock,
  Mail,
  RotateCcw,
  Send,
  ShieldCheck,
} from "lucide-react";

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-violet-600 shadow-sm ring-1 ring-white/80">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <p className="text-xl font-semibold text-slate-900">TeamHub</p>
    </div>
  );
}

function GlassCard({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-white/60 bg-white/60 p-4 shadow-xl backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

const content = {
  forgot: {
    title: "Forgot Password?",
    subtitle: "No worries! Enter your email address and we'll send you a link to reset your password.",
  },
  reset: {
    title: "Reset Password",
    subtitle: "Create a new password for your account. Make sure it's strong and unique.",
  },
};

export default function PasswordVisualPanel({ variant = "forgot" }) {
  const data = content[variant] || content.forgot;

  return (
    <aside className="relative hidden min-h-[680px] overflow-hidden bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-100 p-8 lg:flex lg:flex-col lg:p-10">
      <div className="pointer-events-none absolute inset-0 opacity-[0.09] [background-image:linear-gradient(to_right,rgba(255,255,255,.9)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.9)_1px,transparent_1px)] [background-size:26px_26px]" />
      <div className="absolute -right-10 -top-8 h-48 w-48 rounded-full bg-violet-300/45 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 h-52 w-52 rounded-full bg-indigo-200/55 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-200/40 blur-3xl" />

      <div className="relative z-10">
        <Brand />

        <h2 className="mt-12 text-4xl font-bold leading-tight text-slate-900">{data.title}</h2>
        <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-600">{data.subtitle}</p>
      </div>

      <div className="relative z-10 mt-10 flex-1">
        {variant === "forgot" ? (
          <div className="relative max-w-md">
            <GlassCard className="pt-5">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Lock className="h-6 w-6" />
              </div>
              <p className="text-sm text-slate-500">Secure recovery</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">Password reset requested</p>
              <p className="mt-2 text-sm text-slate-600">A secure reset email is delivered instantly to your inbox.</p>
            </GlassCard>

            <GlassCard className="absolute -right-3 -top-4 w-44 p-3">
              <div className="flex items-center gap-2 text-violet-600">
                <Send className="h-4 w-4" />
                <p className="text-xs font-semibold">Mail sent</p>
              </div>
              <p className="mt-1 text-xs text-slate-600">Secure reset link</p>
            </GlassCard>

            <div className="absolute -bottom-5 left-4 rounded-full border border-white/80 bg-white/70 px-3 py-1 text-xs font-medium text-violet-700 shadow-lg backdrop-blur-xl">
              Valid for 1 hour
            </div>
          </div>
        ) : (
          <div className="relative max-w-md">
            <GlassCard className="pt-5">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="text-sm text-slate-500">Account protection</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">Set a strong new password</p>
              <div className="mt-3 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-3.5 w-3.5 text-violet-600" />
                  <span>Use a unique password</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-3.5 w-3.5 text-violet-600" />
                  <span>All sessions are protected</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="absolute -right-3 -top-4 w-44 p-3">
              <p className="text-xs font-semibold text-violet-700">Strength</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-violet-100">
                <div className="h-full w-3/4 rounded-full bg-violet-500" />
              </div>
              <p className="mt-1 text-xs text-slate-600">Strong password</p>
            </GlassCard>

            <div className="absolute -bottom-5 left-4 flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3 py-1 text-xs font-medium text-violet-700 shadow-lg backdrop-blur-xl">
              <CheckCircle className="h-3.5 w-3.5" />
              Session protected
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-violet-200 bg-white/70 px-3 py-1 text-violet-700">Secure flow</span>
        <span className="rounded-full border border-violet-200 bg-white/70 px-3 py-1 text-violet-700">Encrypted tokens</span>
        <span className="rounded-full border border-violet-200 bg-white/70 px-3 py-1 text-violet-700">Trusted recovery</span>
      </div>
    </aside>
  );
}