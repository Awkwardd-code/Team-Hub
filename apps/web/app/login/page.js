import AuthVisualPanel from "../../components/auth/AuthVisualPanel";
import LoginForm from "../../features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 bg-[radial-gradient(circle_at_top,#eef2ff_0%,#f8fafc_55%)] p-4 dark:bg-slate-950 dark:bg-none">
      <section className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 lg:grid-cols-2">
        <AuthVisualPanel variant="login" />

        <div className="flex items-center p-6 md:p-8">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-6 flex justify-center">
              <img src="/logo.png" alt="TeamHub" className="h-12 w-12 object-contain" />
            </div>
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
