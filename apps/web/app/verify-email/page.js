import VerifyForm from "../../features/auth/VerifyForm";

export default async function VerifyEmailPage({ searchParams }) {
  const params = await searchParams;
  const email = typeof params?.email === "string" ? params.email : "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <VerifyForm email={email} />
      </section>
    </main>
  );
}
