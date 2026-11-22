
import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#faf8f3] px-5 py-8 md:px-10 md:py-12">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">

        <section className="flex flex-col justify-between bg-[#25352d] p-8 text-white md:p-12">
          <p className="text-sm font-semibold tracking-[0.25em] text-[#d7b98b]">
            THE GROWTH CIRCLE
          </p>

          <div className="my-12">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#d7b98b]">
              Read. Connect. Grow.
            </p>

            <h1 className="font-[var(--font-playfair)] text-4xl leading-tight md:text-5xl">
              Keep growing. Keep becoming.
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/75">
              Secure your account and continue contributing to
              a community built around learning and growth.
            </p>
          </div>

          <p className="text-xs text-white/50">
            READ → THINK → DISCUSS → APPLY → GROW
          </p>
        </section>

        <section className="flex items-center justify-center px-7 py-12 md:px-14">
          <div className="w-full max-w-md">
            <p className="mb-3 text-sm font-semibold tracking-widest text-[#9b7545]">
              ACCOUNT SECURITY
            </p>

            <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-[#25352d] md:text-4xl">
              Create new password
            </h2>

            <p className="mb-8 mt-3 text-sm leading-6 text-gray-500">
              Choose a strong password to secure your administrator account.
            </p>

            <ResetPasswordForm />

            <p className="mt-10 text-center text-xs text-gray-400">
              The Growth Circle · Read. Connect. Grow.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
