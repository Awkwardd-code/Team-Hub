import PasswordVisualPanel from "../../components/auth/PasswordVisualPanel";
import ResetPasswordGate from "../../features/auth/components/ResetPasswordGate";

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const token = typeof params?.token === "string" ? params.token : "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <section className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 lg:grid-cols-2">
        <PasswordVisualPanel variant="reset" />

        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md">
            <div className="mb-6 flex justify-center">
              <img src="/logo.png" alt="TeamHub" className="h-12 w-12 object-contain" />
            </div>
            <ResetPasswordGate token={token} />
          </div>
        </div>
      </section>
    </main>
  );
}
